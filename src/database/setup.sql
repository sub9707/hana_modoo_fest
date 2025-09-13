-- MySQL 데이터베이스 및 사용자 테이블 생성
-- 데이터베이스 생성 (필요한 경우)
CREATE DATABASE IF NOT EXISTS modohana_festival CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE modohana_festival;

-- 사용자 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(50) NOT NULL,                    -- 실명
  username VARCHAR(30) UNIQUE NOT NULL,         -- 로그인용 사용자명
  password_hash VARCHAR(64) NOT NULL,           -- SHA256 해시된 비밀번호
  password_salt VARCHAR(32) NOT NULL,           -- 비밀번호 솔트
  gender ENUM('male', 'female', 'none') NOT NULL, -- 성별
  birth_date DATE NOT NULL,                     -- 생년월일
  phone VARCHAR(15) NOT NULL,                   -- 휴대폰번호
  role ENUM('admin', 'editor', 'user') NOT NULL DEFAULT 'user', -- 권한
  
  -- 세션 관리
  session_token VARCHAR(64) UNIQUE,             -- 세션 토큰
  session_expires_at TIMESTAMP NULL,            -- 세션 만료시간
  
  -- 활동 추적
  last_login_at TIMESTAMP NULL,                 -- 마지막 로그인 시간
  last_activity_at TIMESTAMP NULL,              -- 마지막 활동 시간
  
  -- 메타데이터
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_session_token ON users(session_token);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_session_expires_at ON users(session_expires_at);

-- 테스트 계정 데이터 삽입
-- 비밀번호는 각각 admin123, editor123, user123 입니다.
INSERT INTO users (
  id,
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
  UUID(),
  '관리자',
  'admin',
  '',  -- 아래에서 업데이트
  'salt_admin_2025',
  'none',
  '1990-01-01',
  '010-0000-0001',
  'admin'
),
-- 편집자 계정 (editor / editor123)
(
  UUID(),
  '편집자',
  'editor',
  '',  -- 아래에서 업데이트
  'salt_editor_2025',
  'female',
  '1992-06-15',
  '010-0000-0002',
  'editor'
),
-- 일반 사용자 계정 (user / user123)
(
  UUID(),
  '사용자',
  'user',
  '',  -- 아래에서 업데이트
  'salt_user_2025',
  'male',
  '1995-12-25',
  '010-0000-0003',
  'user'
)
ON DUPLICATE KEY UPDATE username = username; -- 중복 시 무시

-- 실제 해시값으로 업데이트 (SHA256(password + salt))
-- admin123 + salt_admin_2025
UPDATE users SET password_hash = SHA2('admin123salt_admin_2025', 256) WHERE username = 'admin';

-- editor123 + salt_editor_2025  
UPDATE users SET password_hash = SHA2('editor123salt_editor_2025', 256) WHERE username = 'editor';

-- user123 + salt_user_2025
UPDATE users SET password_hash = SHA2('user123salt_user_2025', 256) WHERE username = 'user';

-- 세션 정리 프로시저 생성 (만료된 세션 자동 정리)
DELIMITER //
CREATE PROCEDURE CleanupExpiredSessions()
BEGIN
  UPDATE users 
  SET session_token = NULL, session_expires_at = NULL
  WHERE session_expires_at < NOW();
END //
DELIMITER ;

-- 이벤트 스케줄러 활성화 (필요한 경우)
-- SET GLOBAL event_scheduler = ON;

-- 매일 자정에 만료된 세션 정리하는 이벤트 (선택사항)
-- CREATE EVENT IF NOT EXISTS cleanup_sessions_event
-- ON SCHEDULE EVERY 1 DAY
-- STARTS '2025-01-01 00:00:00'
-- DO
--   CALL CleanupExpiredSessions();