// src/components/online-festival/Quiz/QuizEvent.tsx
'use client'

import { useQuiz } from '@/hooks/useQuiz'
import { useAuth } from '@/contexts/AuthContext'
import { useState } from 'react'
import styles from './QuizEvent.module.css'
import { QuizCard } from './QuizCard'
import { ResultScreen } from './ResultScreen'
import { ParticipationCompleted } from './ParticipationCompleted'
import { LoginRequired } from './LoginRequired'

export default function QuizEvent() {
  const { user, isLoading } = useAuth()
  const quiz = useQuiz()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // 결과 등록 핸들러
  const handleRegisterResult = async () => {
    const result = await quiz.registerResult()
    
    if (result.success) {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)
    } else {
      alert(result.message)
    }
  }

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen p-8 md:p-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 로그인이 필요한 경우
  if (!user) {
    return <LoginRequired />
  }

  // 이미 참여한 경우
  if (quiz.hasParticipated) {
    return <ParticipationCompleted user={user} />
  }

  return (
    <div className="min-h-screen p-8 md:p-12 relative">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
          <span className="text-2xl">🧩</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-300 bg-clip-text text-transparent mb-4">
          모두하나 퀴즈 이벤트
        </h1>
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="text-md sm:text-lg text-gray-600">
            가족과 관련된 다양한 퀴즈를 풀어보세요!
          </p>
          <p className="text-sm text-gray-500">
            아래 퀴즈는 여러번 풀 수 있고, 만점 시 추첨을 통해 100명에게 경품을 제공합니다.
          </p>
        </div>
      </div>

      {/* 성공 메시지 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
          🎉 이벤트 참여 완료! 추첨 결과를 기다려주세요!
        </div>
      )}

      {/* 팡파레 파티클 효과 */}
      {quiz.showCelebration && (
        <div className={styles.fanfareContainer}>
          <div className={styles.particle} style={{ backgroundColor: '#8b5cf6' }} />
          <div className={styles.particle} style={{ backgroundColor: '#ec4899' }} />
          <div className={styles.particle} style={{ backgroundColor: '#10b981' }} />
          <div className={styles.particle} style={{ backgroundColor: '#f59e0b' }} />
          <div className={styles.particle} style={{ backgroundColor: '#ef4444' }} />
          <div className={styles.particle} style={{ backgroundColor: '#06b6d4' }} />
          <div className={styles.particle} style={{ backgroundColor: '#8b5cf6' }} />
          <div className={styles.particle} style={{ backgroundColor: '#ec4899' }} />
        </div>
      )}

      {/* 성공 메시지 */}
      {quiz.showCelebration && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className={styles.successText}>
            정답! 🎉
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {!quiz.isCompleted ? (
        <QuizCard
          quiz={quiz.currentQuizData}
          selectedAnswer={quiz.selectedAnswer}
          showResult={quiz.showResult}
          isCorrect={quiz.isCorrect}
          currentIndex={quiz.currentQuiz}
          totalQuizzes={quiz.totalQuizzes}
          progress={quiz.progress}
          shakeCard={quiz.shakeCard}
          onAnswerSelect={quiz.handleAnswerSelect}
          onSubmit={quiz.handleAnswerSubmit}
          onNext={quiz.handleNextQuiz}
          isLastQuiz={quiz.currentQuiz === quiz.totalQuizzes - 1}
        />
      ) : (
        <ResultScreen
          score={quiz.score}
          totalQuizzes={quiz.totalQuizzes}
          isPerfectScore={quiz.isPerfectScore}
          canShowRegisterButton={quiz.canShowRegisterButton}
          isRegistering={quiz.isRegistering}
          completionTime={quiz.getCompletionTime()}
          onReset={quiz.resetQuiz}
          onRegister={handleRegisterResult}
        />
      )}
    </div>
  )
}