'use client'

import { useQuiz } from '@/hooks/useQuiz'
import styles from './QuizEvent.module.css'
import { QuizCard } from './QuizCard'
import { ResultScreen } from './ResultScreen'

export default function QuizEvent() {
  const quiz = useQuiz()

  return (
    <div className="min-h-screen  p-8 md:p-12 relative">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
          <span className="text-2xl">🧩</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-300 bg-clip-text text-transparent mb-4">
          모두하나 퀴즈 이벤트
        </h1>
        <p className="text-md sm:text-lg text-gray-600">
          가족과 관련된 다양한 퀴즈를 풀어보세요!
        </p>
      </div>

      {/* 최적화된 팡파레 파티클 효과 (8개) */}
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
        <div className="max-w-2xl mx-auto">
          {/* 진행상황 */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className="text-green-600 font-semibold">
              {quiz.currentQuiz + 1} / {quiz.totalQuizzes}
            </span>
            <div className="w-48 bg-purple-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${quiz.progress}%` }}
              />
            </div>
          </div>

          <QuizCard
            quiz={quiz.currentQuizData}
            selectedAnswer={quiz.selectedAnswer}
            showResult={quiz.showResult}
            shakeCard={quiz.shakeCard}
            onAnswerSelect={quiz.handleAnswerSelect}
            onSubmit={quiz.handleAnswerSubmit}
            onNext={quiz.handleNextQuiz}
            isLastQuiz={quiz.currentQuiz === quiz.totalQuizzes - 1}
          />
        </div>
      ) : (
        <ResultScreen
          score={quiz.score}
          total={quiz.totalQuizzes}
          onReset={quiz.resetQuiz}
        />
      )}
    </div>
  )
}