-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,                    -- 실명
  username VARCHAR(30) UNIQUE NOT NULL,         -- 로그인용 사용자명
  password_hash VARCHAR(64) NOT NULL,           -- SHA256 해시된 비밀번호
  password_salt VARCHAR(32) NOT NULL,           -- 비밀번호 솔트
  gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female', 'none')), -- 성별
  birth_date DATE NOT NULL,                     -- 생년월일
  phone VARCHAR(15) NOT NULL,                   -- 휴대폰번호
  role VARCHAR(10) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')), -- 권한
  
  -- 세션 관리
  session_token VARCHAR(64) UNIQUE,             -- 세션 토큰
  session_expires_at TIMESTAMPTZ,               -- 세션 만료시간
  
  -- 활동 추적
  last_login_at TIMESTAMPTZ,                    -- 마지막 로그인 시간
  last_activity_at TIMESTAMPTZ,                 -- 마지막 활동 시간
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_session_expires_at ON users(session_expires_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성 (모든 사용자가 읽기 가능, 자신의 데이터만 수정 가능)
CREATE POLICY "Users can read all user data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at 트리거 생성
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 테스트 계정 데이터 삽입
-- 비밀번호는 각각 admin123, editor123, user123 입니다.
INSERT INTO users (
  name, 
  username, 
  password_hash, 
  password_salt, 
  gender, 
  birth_date, 
  phone, 
  role
) VALUES 
-- 관리자 계정 (admin / admin123)
(
  '관리자',
  'admin',
  'a7b9c3d2e1f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0',  -- admin123 해시값 예시
  'salt_admin_2025',
  'other',
  '1990-01-01',
  '010-0000-0001',
  'admin'
),
-- 편집자 계정 (editor / editor123)
(
  '편집자',
  'editor',
  'b8c9d3e2f1g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6d7e8f9g0',  -- editor123 해시값 예시
  'salt_editor_2025',
  'female',
  '1992-06-15',
  '010-0000-0002',
  'editor'
),
-- 일반 사용자 계정 (user / user123)
(
  '사용자',
  'user',
  'c9d0e3f2g1h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0',  -- user123 해시값 예시
  'salt_user_2025',
  'male',
  '1995-12-25',
  '010-0000-0003',
  'user'
);

-- 실제 해시값으로 업데이트 (SHA256(password + salt))
-- admin123 + salt_admin_2025
UPDATE users SET password_hash = encode(sha256('admin123salt_admin_2025'::bytea), 'hex') WHERE username = 'admin';

-- editor123 + salt_editor_2025  
UPDATE users SET password_hash = encode(sha256('editor123salt_editor_2025'::bytea), 'hex') WHERE username = 'editor';

-- user123 + salt_user_2025
UPDATE users SET password_hash = encode(sha256('user123salt_user_2025'::bytea), 'hex') WHERE username = 'user';

-- 세션 정리 함수 (만료된 세션 자동 정리)
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET session_token = NULL, session_expires_at = NULL
  WHERE session_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 매일 자정에 만료된 세션 정리하는 cron job (Supabase에서 지원하는 경우)
-- SELECT cron.schedule('cleanup-sessions', '0 0 * * *', 'SELECT cleanup_expired_sessions();');