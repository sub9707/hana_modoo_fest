// src/components/online-festival/Quiz/QuizCard.tsx
import { memo } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Quiz } from '@/types/Quiz'
import styles from './QuizCard.module.css'

interface QuizCardProps {
  quiz: Quiz
  selectedAnswer: number | null
  showResult: boolean
  isCorrect: boolean | null
  currentIndex: number
  totalQuizzes: number
  progress: number
  shakeCard: boolean
  onAnswerSelect: (index: number) => void
  onSubmit: () => void
  onNext: () => void
  isLastQuiz: boolean
}

export const QuizCard = memo(function QuizCard({
  quiz,
  selectedAnswer,
  showResult,
  isCorrect,
  currentIndex,
  totalQuizzes,
  progress,
  shakeCard,
  onAnswerSelect,
  onSubmit,
  onNext,
  isLastQuiz
}: QuizCardProps) {
  return (
    <div className="max-w-2xl mx-auto">
      {/* 진행상황 */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <span className="text-green-600 font-semibold">
          {currentIndex + 1} / {totalQuizzes}
        </span>
        <div className="w-48 bg-purple-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-green-500 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 퀴즈 카드 */}
      <div 
        className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-lg transition-all duration-300 ${
          shakeCard ? styles.shakeAnimation : ''
        }`}
      >
        <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
          {quiz.question}
        </h3>

        <div className="space-y-3 mb-6">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 hover:-translate-y-0.5 ${
                showResult
                  ? index === quiz.correctAnswer
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                    : selectedAnswer === index
                    ? 'border-rose-500 bg-rose-50 text-rose-800'
                    : 'border-gray-200 bg-gray-50'
                  : selectedAnswer === index
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && (
                  <div>
                    {index === quiz.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                    {selectedAnswer === index && index !== quiz.correctAnswer && (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">💡 설명</h4>
            <p className="text-purple-700">{quiz.explanation}</p>
          </div>
        )}

        <div className="text-center">
          {!showResult ? (
            <button
              onClick={onSubmit}
              disabled={selectedAnswer === null}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
            >
              정답 확인
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              {isLastQuiz ? '결과 보기' : '다음 문제'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
})