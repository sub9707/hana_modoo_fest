import { useState, useEffect } from 'react'
import { User } from '@/types/writing'
import { checkCurrentUser } from '@/utils/writing'

export function useUser() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const initUser = async () => {
      const user = await checkCurrentUser()
      setCurrentUser(user)
    }
    initUser()
  }, [])

  return { currentUser, setCurrentUser }
}