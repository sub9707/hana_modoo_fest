import { useState, useCallback, useMemo, useEffect } from 'react'
import { Quiz } from '@/types/Quiz'
import QUIZ_DATA from '@/data/QuizData.json'

export function useQuiz() {
  const [currentQuiz, setCurrentQuiz] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [shakeCard, setShakeCard] = useState(false)

  const currentQuizData = useMemo(() => QUIZ_DATA[currentQuiz], [currentQuiz])
  const totalQuizzes = QUIZ_DATA.length
  const progress = useMemo(() => ((currentQuiz + 1) / totalQuizzes) * 100, [currentQuiz, totalQuizzes])

  const handleAnswerSelect = useCallback((answerIndex: number) => {
    if (!showResult) {
      setSelectedAnswer(answerIndex)
    }
  }, [showResult])

  const handleAnswerSubmit = useCallback(() => {
    if (selectedAnswer === null) return
    
    const correct = selectedAnswer === currentQuizData.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuiz] = selectedAnswer
    setUserAnswers(newUserAnswers)
    
    if (correct) {
      setScore(prev => prev + 1)
      setShowCelebration(true)
      // 팡파레 애니메이션 시간 최적화 (1초 + 여유시간)
      setTimeout(() => setShowCelebration(false), 1100)
    } else {
      setShakeCard(true)
      // 흔들기 애니메이션 유지
      setTimeout(() => setShakeCard(false), 400)
    }
  }, [selectedAnswer, userAnswers, currentQuiz, currentQuizData.correctAnswer])

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
  }, [])

  return {
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
    handleAnswerSelect,
    handleAnswerSubmit,
    handleNextQuiz,
    resetQuiz
  }
}