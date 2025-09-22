export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\. /g, '/').replace('.', '')
}

export const formatDateMobile = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  
  // 24시간 이내면 시간만 표시
  if (diffInHours < 24) {
    return date.toLocaleString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 그 외에는 월/일 시:분 형식
  return date.toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(/\. /g, '/').replace('.', '')
}

export const checkCurrentUser = async () => {
  try {
    const response = await fetch('/api/auth/me')
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    return null
  } catch (error) {
    console.error('Error checking user:', error)
    return null
  }
}

export const loadWritingTopics = async () => {
  try {
    const response = await fetch('/api/writing-topics')
    const data = await response.json()
    return data.success ? data.data : []
  } catch (error) {
    console.error('Error loading topics:', error)
    return []
  }
}

export const checkCooldown = async () => {
  try {
    const response = await fetch('/api/writings/cooldown')
    const data = await response.json()
    return data.success ? data.data : { canWrite: true, remainingSeconds: 0 }
  } catch (error) {
    console.error('Error checking cooldown:', error)
    return { canWrite: true, remainingSeconds: 0 }
  }
}