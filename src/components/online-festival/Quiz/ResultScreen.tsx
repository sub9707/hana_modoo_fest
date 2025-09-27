// src/components/online-festival/Quiz/ResultScreen.tsx
'use client'

import { memo } from 'react'
import { RotateCcw, Trophy, Clock, Target, Gift, Sparkles } from 'lucide-react'

interface ResultScreenProps {
  score: number
  totalQuizzes: number
  isPerfectScore: boolean
  canShowRegisterButton: boolean
  isRegistering: boolean
  completionTime: number
  onReset: () => void
  onRegister: () => void
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}분 ${remainingSeconds}초`
}

export const ResultScreen = memo(({
  score,
  totalQuizzes,
  isPerfectScore,
  canShowRegisterButton,
  isRegistering,
  completionTime,
  onReset,
  onRegister
}: ResultScreenProps) => {
  const scorePercentage = Math.round((score / totalQuizzes) * 100)

  return (
    <div className="max-w-2xl mx-auto">
      {/* 결과 카드 */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-8 mb-6 border border-white/20">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className={`text-8xl mb-4 ${isPerfectScore ? 'animate-bounce' : ''}`}>
            {isPerfectScore ? '🏆' : scorePercentage >= 80 ? '🎉' : scorePercentage >= 60 ? '👏' : '💪'}
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isPerfectScore 
              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent' 
              : 'text-gray-800'
          }`}>
            {isPerfectScore 
              ? '완벽합니다!' 
              : scorePercentage >= 80 
                ? '훌륭해요!' 
                : scorePercentage >= 60 
                  ? '잘했어요!' 
                  : '다시 도전하세요!'}
          </h2>
          <p className="text-gray-600">
            {isPerfectScore 
              ? '모든 문제를 맞히셨네요!' 
              : '아쉽지만 다시 도전할 수 있어요!'}
          </p>
        </div>

        {/* 점수 표시 */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">{score}/{totalQuizzes}</div>
            <div className="text-sm text-green-600">정답 수</div>
          </div>
        
        </div>

        {/* 만점 달성 시 이벤트 안내 */}
        {isPerfectScore && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl">
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-orange-500 mr-2" />
              <h3 className="text-xl font-bold text-orange-800">이벤트 참여 자격 획득!</h3>
              <Sparkles className="w-6 h-6 text-orange-500 ml-2" />
            </div>
            <div className="text-center space-y-2 text-orange-700">
              <p className="font-medium">🎯 만점을 달성하셨습니다!</p>
              <p className="text-sm">추첨을 통해 100명에게 경품을 제공합니다.</p>
              <p className="text-sm font-medium">아래 버튼을 눌러 이벤트에 참여하세요!</p>
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* 다시 도전 버튼 */}
          <button
            onClick={onReset}
            className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-lg"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            다시 도전하기
          </button>

          {/* 결과 등록 버튼 (만점일 때만 표시) */}
          {canShowRegisterButton && (
            <button
              onClick={onRegister}
              disabled={isRegistering}
              className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg animate-pulse"
            >
              {isRegistering ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  등록 중...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  이벤트 참여하기
                </>
              )}
            </button>
          )}
        </div>

        {/* 추가 안내 메시지 */}
        {!isPerfectScore && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-blue-700 text-sm">
              💡 <strong>팁:</strong> 만점을 달성하면 추첨을 통해 경품을 받을 수 있는 기회가 주어집니다!
            </p>
          </div>
        )}
      </div>

      {/* 퀴즈 이벤트 정보 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">🎁 이벤트 안내</h3>
        <div className="space-y-2 text-gray-700 text-sm flex flex-col justify-center items-center">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 font-bold">•</span>
            <span>퀴즈는 횟수 제한 없이 계속 도전할 수 있습니다</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 font-bold">•</span>
            <span>모든 문제를 맞춰야 이벤트 참여 자격이 주어집니다</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 font-bold">•</span>
            <span>한 번 참여하면 중복 참여는 불가능합니다</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 font-bold">•</span>
            <span>추첨을 통해 100명에게 경품을 제공합니다</span>
          </div>
        </div>
      </div>
    </div>
  )
})