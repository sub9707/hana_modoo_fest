'use client'

import { useState } from 'react'
import Notice from '@/components/ui/Notice'
import { useQuiz } from '@/hooks/useQuiz'
import { useAuth } from '@/contexts/AuthContext'
import { MessageSquareQuote, CheckCircle } from 'lucide-react'
import styles from './QuizEvent.module.css'
import { QuizCard } from './QuizCard'
import { ResultScreen } from './ResultScreen'
import { ParticipationCompleted } from './ParticipationCompleted'
import { LoginRequired } from './LoginRequired'
import FestivalTabHeader from '../FestivalTabHeader'

export default function QuizEvent() {
  const { user, isLoading } = useAuth()
  const quiz = useQuiz()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // 이벤트 종료 상태
  const EVENT_ENDED = false

  // 결과 등록 핸들러 (데모 버전)
  const handleRegisterResult = async () => {
    // 데모 버전: 실제 DB 저장 대신 안내 메시지만 표시
    alert('현재 데모 버전에서는 퀴즈 참여만 가능합니다.\n실제 이벤트에서는 참여 결과가 등록됩니다.')
    return

    // 실제 운영 시 아래 코드 사용
    // const result = await quiz.registerResult()
    //
    // if (result.success) {
    //   setShowSuccessMessage(true)
    //   setTimeout(() => setShowSuccessMessage(false), 3000)
    // } else {
    //   alert(result.message)
    // }
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
    <div className="p-1 py-4 sm:p-8 md:p-12">
      {/* 헤더 */}
      <FestivalTabHeader
        title="퀴즈 이벤트"
        description={
          EVENT_ENDED
            ? '퀴즈 이벤트가 종료되었습니다. 참여해주신 모든 분들께 감사드립니다.'
            : '가족 관련 퀴즈를 풀고 만점을 달성하여 경품 추첨에 참여하세요!'
        }
        titleColorVariant="default"
      >
        {!EVENT_ENDED && (
          <p className="text-sm text-gray-500">
            아래 퀴즈는 여러번 풀 수 있고, 만점 시 추첨을 통해 100명에게 경품을 제공합니다.
          </p>
        )}
      </FestivalTabHeader>

      {/* 이벤트 종료 안내 배너 */}
      {EVENT_ENDED && (
        <div className="max-w-4xl mx-auto mb-8">
          <Notice title="퀴즈 이벤트 종료">
            <p>모두하나대축제 2025 퀴즈 이벤트가 종료되었습니다.</p>
            <p>당첨자 발표는 별도로 안내드릴 예정입니다. 많은 관심과 참여 감사드립니다.</p>
          </Notice>
        </div>
      )}

      {/* 성공 메시지 */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse flex items-center space-x-2">
          <CheckCircle className="w-5 h-5" />
          <span>이벤트 참여 완료! 추첨 결과를 기다려주세요!</span>
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
          <div className={`${styles.successText} flex items-center space-x-2`}>
            <CheckCircle className="w-8 h-8" />
            <span>정답!</span>
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 */}
      {EVENT_ENDED ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-lg">
            <CheckCircle className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              퀴즈 이벤트가 종료되었습니다
            </h3>
            <p className="text-gray-600 mb-6">
              많은 분들의 참여 감사드립니다. 당첨자 발표는 별도 안내 예정입니다.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <p className="text-green-800 font-medium">
                참여해주신 모든 분들께 진심으로 감사드립니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}