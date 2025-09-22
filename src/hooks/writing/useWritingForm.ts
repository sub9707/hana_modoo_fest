import { useState } from 'react'
import { WritingTopic, User, CooldownData, TabType } from '@/types/writing'

export function useWritingForm() {
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null)
  const [writingTitle, setWritingTitle] = useState('')
  const [writingContent, setWritingContent] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (
    currentUser: User | null,
    setCooldown: (cooldown: CooldownData) => void,
    setCurrentTab: (tab: TabType) => void
  ) => {
    if (!selectedTopic || !writingTitle.trim() || !writingContent.trim() || !currentUser) return

    try {
      const response = await fetch('/api/writings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: selectedTopic.title,
          title: writingTitle.trim(),
          content: writingContent.trim()
        })
      })

      const data = await response.json()

      if (data.success) {
        setIsSubmitted(true)
        setTimeout(() => {
          setWritingTitle('')
          setWritingContent('')
          setSelectedTopic(null)
          setCurrentTab('browse')
          setIsSubmitted(false)
        }, 2000)
      } else {
        if (data.cooldownRemaining) {
          setCooldown({
            canWrite: false,
            remainingSeconds: data.cooldownRemaining
          })
        }
        alert(data.error)
      }
    } catch (error) {
      console.error('Error submitting writing:', error)
      alert('글 작성에 실패했습니다.')
    }
  }

  const resetForm = () => {
    setWritingTitle('')
    setWritingContent('')
    setSelectedTopic(null)
    setIsSubmitted(false)
  }

  return {
    selectedTopic,
    setSelectedTopic,
    writingTitle,
    setWritingTitle,
    writingContent,
    setWritingContent,
    isSubmitted,
    setIsSubmitted,
    handleSubmit,
    resetForm
  }
}