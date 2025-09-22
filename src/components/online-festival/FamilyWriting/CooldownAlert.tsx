import { formatTime } from '@/utils/writing'

interface CooldownAlertProps {
  remainingSeconds: number
}

export default function CooldownAlert({ remainingSeconds }: CooldownAlertProps) {
  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
      <div className="text-4xl mb-4">⏰</div>
      <h3 className="text-xl font-bold text-orange-800 mb-2">잠시만 기다려주세요</h3>
      <p className="text-orange-600">
        다음 글 작성까지 <span className="font-bold">{formatTime(remainingSeconds)}</span> 남았습니다
      </p>
    </div>
  )
}