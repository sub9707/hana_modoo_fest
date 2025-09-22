import { useState, useEffect } from 'react'
import { WritingTopic } from '@/types/writing'
import { loadWritingTopics } from '@/utils/writing'

export function useWritingTopics() {
  const [writingTopics, setWritingTopics] = useState<WritingTopic[]>([])

  useEffect(() => {
    const initTopics = async () => {
      const topics = await loadWritingTopics()
      setWritingTopics(topics)
    }
    initTopics()
  }, [])

  return { writingTopics }
}