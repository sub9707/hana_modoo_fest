// src/hooks/useQuiz.ts
import { useState, useCallback, useMemo, useEffect } from 'react'
import { Quiz } from '@/types/Quiz'
import QUIZ_DATA from '@/data/QuizData.json'
import { useAuth } from '@/contexts/AuthContext'

interface QuizParticipationData {
  perfectScore: boolean
  totalQuestions: number
  correctAnswers: number
  completionTime: number
  participatedAt: string
}

export function useQuiz() {
  const { user } = useAuth()
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [hasParticipated, setHasParticipated] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [canShowRegisterButton, setCanShowRegisterButton] = useState(false)

  const currentQuizData = useMemo(() => QUIZ_DATA[currentQuiz], [currentQuiz])
  const totalQuizzes = QUIZ_DATA.length
  const progress = useMemo(() => ((currentQuiz + 1) / totalQuizzes) * 100, [currentQuiz, totalQuizzes])
  const isPerfectScore = useMemo(() => score === totalQuizzes, [score, totalQuizzes])

  // 퀴즈 시작 시 시간 기록
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date())
    }
  }, [startTime])

  // 사용자 참여 상태 확인
  useEffect(() => {
    if (user?.id) {
      checkParticipationStatus()
    }
  }, [user?.id])

  // 퀴즈 완료 시 등록 버튼 표시 여부 결정
  useEffect(() => {
    if (isCompleted && isPerfectScore && !hasParticipated) {
      setCanShowRegisterButton(true)
    } else {
      setCanShowRegisterButton(false)
    }
  }, [isCompleted, isPerfectScore, hasParticipated])

  // 참여 상태 확인
  const checkParticipationStatus = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/quiz/participation-status?userId=${user.id}`)
      const data = await response.json()
      
      if (data.success) {
        setHasParticipated(data.hasParticipated)
      }
    } catch (error) {
      console.error('참여 상태 확인 실패:', error)
    }
  }

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex)
    }
  }, [showResult])

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null || !user?.id) return
    
    const correct = selectedAnswer === currentQuizData.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuiz] = selectedAnswer
    setUserAnswers(newUserAnswers)
    
    if (correct) {
      setScore(prev => prev + 1)
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 1100)
    } else {
      setShakeCard(true)
      setTimeout(() => setShakeCard(false), 400)
    }

  }, [selectedAnswer, userAnswers, currentQuiz, currentQuizData.correctAnswer, user?.id])

  const handleNextQuiz = useCallback(() => {
    if (currentQuiz < totalQuizzes - 1) {
      setCurrentQuiz(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(null)
      setShakeCard(false)
    } else {
      setIsCompleted(true)
    }
  }, [currentQuiz, totalQuizzes])

  const resetQuiz = useCallback(() => {
    setCurrentQuiz(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setUserAnswers([])
    setIsCompleted(false)
    setIsCorrect(null)
    setShowCelebration(false)
    setShakeCard(false)
    setStartTime(new Date())
    setCanShowRegisterButton(false)
  }, [])

  // 결과 등록
  const registerResult = useCallback(async () => {
    if (!user?.id || !startTime || !isPerfectScore || hasParticipated) {
      return { success: false, message: '등록 조건을 만족하지 않습니다.' }
    }

    setIsRegistering(true)

    try {
      const completionTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      
      const participationData: QuizParticipationData = {
        perfectScore: true,
        totalQuestions: totalQuizzes,
        correctAnswers: score,
        completionTime,
        participatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/quiz/register-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...participationData
        })
      })

      const result = await response.json()

      if (result.success) {
        setHasParticipated(true)
        setCanShowRegisterButton(false)
        return { 
          success: true, 
          message: '퀴즈 이벤트 참여가 완료되었습니다! 추첨을 통해 100명에게 경품을 제공합니다.' 
        }
      } else {
        return { success: false, message: result.message || '등록에 실패했습니다.' }
      }
    } catch (error) {
      console.error('결과 등록 실패:', error)
      return { success: false, message: '네트워크 오류가 발생했습니다.' }
    } finally {
      setIsRegistering(false)
    }
  }, [user?.id, startTime, isPerfectScore, hasParticipated, totalQuizzes, score])

  // 완료 시간 계산
  const getCompletionTime = useCallback(() => {
    if (!startTime) return 0
    return Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
  }, [startTime])

  return {
    // 기존 상태
    currentQuiz,
    selectedAnswer,
    showResult,
    score,
    isCompleted,
    currentQuizData,
    totalQuizzes,
    progress,
    isCorrect,
    showCelebration,
    shakeCard,
    
    // 새로운 상태
    isPerfectScore,
    hasParticipated,
    canShowRegisterButton,
    isRegistering,
    
    // 기존 액션
    handleAnswerSelect,
    handleAnswerSubmit,
    handleNextQuiz,
    resetQuiz,
    
    // 새로운 액션
    registerResult,
    getCompletionTime,
    checkParticipationStatus
  }
}