import { queryOne } from "@/lib/mysql/connection"
import { createHash } from "crypto"

export async function checkRecentDeletion(phone: string) {
  try {
    const phoneHash = createHash('sha256').update(phone).digest('hex')
    
    const recentDeletion = await queryOne(
      `SELECT deleted_at FROM account_deletions 
       WHERE phone_hash = ? 
       AND deleted_at > DATE_SUB(NOW(), INTERVAL 12 HOUR)
       ORDER BY deleted_at DESC 
       LIMIT 1`,
      [phoneHash]
    )

    if (recentDeletion) {
      const deletedAt = new Date(recentDeletion.deleted_at)
      const now = new Date()
      const remainingMs = (12 * 60 * 60 * 1000) - (now.getTime() - deletedAt.getTime())
      const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000))

      return {
        allowed: false,
        error: `탈퇴 후 12시간 이내에는 재가입할 수 없습니다. ${remainingHours}시간 후 다시 시도해주세요.`,
        remainingHours
      }
    }

    return { allowed: true }
  } catch (error) {
    console.error('Recent deletion check error:', error)
    return { allowed: true } // 에러 시 가입 허용
  }
}