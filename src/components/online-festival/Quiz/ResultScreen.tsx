import { memo } from 'react'
import { RotateCcw } from 'lucide-react'

interface ResultScreenProps {
  score: number
  total: number
  onReset: () => void
}

export const ResultScreen = memo(function ResultScreen({
  score,
  total,
  onReset
}: ResultScreenProps) {
  const percentage = (score / total) * 100
  const emoji = percentage === 100 ? '🏆' : percentage >= 70 ? '🎉' : '📚'
  const message = percentage === 100
    ? '완벽해요! 가족에 대해 정말 잘 알고 계시네요! 🌟'
    : percentage >= 70
    ? '잘했어요! 가족에 대한 지식이 풍부하시네요! 👏'
    : '더 배워보세요! 가족에 대해 더 알아가는 기회가 될 거예요! 💪'

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="text-6xl mb-6 animate-bounce">{emoji}</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">퀴즈 완료!</h3>
        <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {score} / {total}
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span>다시 도전</span>
        </button>
      </div>
    </div>
  )
})