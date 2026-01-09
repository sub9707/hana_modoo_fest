-- 포트폴리오 테스트용 슈퍼 관리자 계정 생성
-- 사용자명: test_admin
-- 비밀번호: Test1234!
-- 역할: admin (모든 권한)

-- 비밀번호는 'Test1234!'를 SHA-256으로 해시한 값입니다
-- Salt: 'testsalt2025'
-- 실제 운영 환경에서는 더 강력한 해싱 알고리즘(bcrypt, argon2 등)을 사용해야 합니다

INSERT INTO users (
  id,
  name,
  username,
  company,
  password_hash,
  password_salt,
  gender,
  birth_date,
  phone,
  address,
  address_detail,
  zip_code,
  role,
  session_token,
  session_expires_at,
  last_login_at,
  last_activity_at,
  last_login_ip,
  signup_method,
  email,
  profile_image,
  created_at,
  updated_at
) VALUES (
  'test-admin-uuid-0000-000000000001',
  '테스트 관리자',
  'test_admin',
  '하나모두대축제',
  SHA2(CONCAT('Test1234!', 'testsalt2025'), 256),
  'testsalt2025',
  'none',
  '1990-01-01',
  '010-0000-0000',
  '서울특별시 강남구 테스트로 123',
  '테스트빌딩 1층',
  '06000',
  'admin',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  'phone',
  'test_admin@hanamodo.kr',
  NULL,
  NOW(),
  NOW()
);

-- 생성 확인
SELECT
  id,
  name,
  username,
  role,
  phone,
  email,
  created_at
FROM users
WHERE username = 'test_admin';

-- ============================================
-- 테스트 계정 정보
-- ============================================
-- 사용자명: test_admin
-- 비밀번호: Test1234!
-- 이름: 테스트 관리자
-- 전화번호: 010-0000-0000
-- 이메일: test_admin@hanamodo.kr
-- 역할: admin (모든 권한 보유)
-- ============================================
