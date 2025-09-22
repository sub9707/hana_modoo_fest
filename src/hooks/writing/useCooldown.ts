import { useState, useEffect } from 'react'
import { CooldownData, User } from '@/types/writing'
import { checkCooldown } from '@/utils/writing'

export function useCooldown(currentUser: User | null) {
  const [cooldown, setCooldown] = useState<CooldownData>({ 
    canWrite: true, 
    remainingSeconds: 0 
  })

  // 쿨타임 타이머
  useEffect(() => {
    if (cooldown.remainingSeconds > 0) {
      const timer = setInterval(() => {
        setCooldown(prev => ({
          ...prev,
          remainingSeconds: Math.max(0, prev.remainingSeconds - 1)
        }))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown.remainingSeconds])

  const checkUserCooldown = async () => {
    if (!currentUser) return
    const cooldownData = await checkCooldown()
    setCooldown(cooldownData)
  }

  return {
    cooldown,
    setCooldown,
    checkUserCooldown
  }
}