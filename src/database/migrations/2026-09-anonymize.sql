-- =====================================================================
-- 하나모두 대축제 : 보관기간 만료에 따른 회원 일괄 익명화
-- 대상 DB : MariaDB 10.11 (dbhow9775)
-- 실행 전 : 반드시 mysqldump 전체 백업
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. users 테이블에 탈퇴 상태 컬럼 추가
--    TIMESTAMP 대신 DATETIME 사용 : MariaDB 에서 TIMESTAMP 컬럼은 명시하지
--    않으면 NOT NULL DEFAULT CURRENT_TIMESTAMP 가 암묵 적용될 수 있음
-- ---------------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN deleted_at    DATETIME    NULL DEFAULT NULL,
  ADD COLUMN deletion_type VARCHAR(30) NULL DEFAULT NULL,
  ADD INDEX idx_users_deleted_at (deleted_at);

-- ---------------------------------------------------------------------
-- 2. 익명화 처리 감사 로그
--    개인정보는 물론 전화번호/이메일 해시도 남기지 않는다.
--    (해시를 남기면 account_deletions 의 재가입 차단 로직에 걸려
--     다음 축제 때 재가입이 막히고, 파기 취지에도 어긋남)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_anonymization_log (
  id             VARCHAR(36)  NOT NULL PRIMARY KEY,
  user_id        VARCHAR(36)  NOT NULL,
  dummy_username VARCHAR(30)  NOT NULL,
  signup_method  VARCHAR(20)  NULL,
  had_social     TINYINT(1)   NOT NULL DEFAULT 0,
  batch_id       VARCHAR(36)  NOT NULL,
  reason         VARCHAR(50)  NOT NULL,
  anonymized_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_batch (batch_id),
  INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 3. 데모 계정 권한 강등
--    test_admin 자격증명(test_admin / Test1234!)이 클라이언트 번들에
--    평문 노출되어 있어 role=admin 인 한 누구나 관리자 화면에 진입 가능.
--    버튼은 유지하되 권한만 일반 회원으로 내린다.
-- ---------------------------------------------------------------------
UPDATE users SET role = 'user' WHERE username = 'test_admin';
