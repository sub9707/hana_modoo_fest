'use client'

import { useState, useEffect } from 'react'
import { Settings, Save, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/online-festival/ui/card'
import { Button } from '@/components/admin/online-festival/ui/button'
import { Input } from '@/components/admin/online-festival/ui/input'

interface PrizeWithProbability {
  id: number
  name: string
  icon: string
  color: string
  type: string
  probability: number
  is_active: boolean
  probability_active: boolean
  current_quantity: number
}

interface PrizeProbabilityManagerProps {
  onUpdate?: () => void
}

export function PrizeProbabilityManager({ onUpdate }: PrizeProbabilityManagerProps) {
  const [prizes, setPrizes] = useState<PrizeWithProbability[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning', text: string } | null>(null)

  // 상품 목록 조회
  const fetchPrizes = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/event/prizes')
      const data = await response.json()
      
      if (data.success) {
        // probability를 명시적으로 숫자로 변환
        const normalizedPrizes = data.data.map((prize: any) => ({
          ...prize,
          probability: parseFloat(prize.probability) || 0
        }))
        setPrizes(normalizedPrizes)
      }
    } catch (error) {
      console.error('Failed to fetch prizes:', error)
      setMessage({ type: 'error', text: '상품 목록을 불러오는데 실패했습니다.' })
    } finally {
      setLoading(false)
    }
  }

  // 확률 변경 핸들러
  const handleProbabilityChange = (prizeId: number, value: string) => {
    const numValue = parseFloat(value) || 0
    
    setPrizes(prev => prev.map(prize => 
      prize.id === prizeId 
        ? { ...prize, probability: numValue }
        : prize
    ))
  }

  // 전체 확률 합계 계산 (꽝 제외)
  const getTotalProbability = (): number => {
    if (!prizes || prizes.length === 0) return 0
    
    return prizes
      .filter(p => p.type !== 'none')
      .reduce((sum, prize) => {
        const prob = parseFloat(String(prize.probability)) || 0
        return sum + prob
      }, 0)
  }

  // 꽝 확률 계산
  const getConsolationProbability = (): number => {
    const total = getTotalProbability()
    return Math.max(0, 100 - total)
  }

  // 확률 저장
  const handleSave = async () => {
    const total = getTotalProbability()
    
    // 확률 합계 검증 (100% 이하여야 함)
    if (total > 100) {
      setMessage({ 
        type: 'error', 
        text: `확률의 합이 100%를 초과합니다. 현재: ${total.toFixed(2)}%` 
      })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      // 각 상품의 확률 업데이트
      const updates = prizes
        .filter(p => p.type !== 'none')
        .map(prize => 
          fetch('/api/admin/event/prizes', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prize_id: prize.id,
              probability: prize.probability,
              is_active: true
            })
          })
        )

      const results = await Promise.all(updates)
      const allSuccess = results.every(r => r.ok)

      if (allSuccess) {
        setMessage({ type: 'success', text: '확률이 성공적으로 저장되었습니다.' })
        if (onUpdate) onUpdate()
        
        // 3초 후 메시지 제거
        setTimeout(() => setMessage(null), 3000)
      } else {
        throw new Error('일부 확률 업데이트에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save probabilities:', error)
      setMessage({ type: 'error', text: '확률 저장 중 오류가 발생했습니다.' })
    } finally {
      setSaving(false)
    }
  }


  useEffect(() => {
    fetchPrizes()
  }, [])

  const totalProb = getTotalProbability()
  const consolationProb = getConsolationProbability()
  const isProbabilityValid = totalProb <= 100

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg">상품 확률 설정</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            {isExpanded ? '접기' : '펼치기'}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          {/* 메시지 표시 */}
          {message && (
            <div 
              className={`rounded-lg border p-4 ${
                message.type === 'error' 
                  ? 'border-red-500 bg-red-50 text-red-900' 
                  : message.type === 'warning'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-900'
                  : 'border-green-500 bg-green-50 text-green-900'
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                {message.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                {message.type !== 'success' && <AlertCircle className="h-4 w-4" />}
                <span>{message.text}</span>
              </div>
            </div>
          )}

          {/* 확률 합계 표시 */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isProbabilityValid ? 'bg-orange-50 border-2 border-orange-500' : 'bg-red-50 border-2 border-red-500'}`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">상품 확률 합계:</span>
                <span className={`text-xl font-bold ${isProbabilityValid ? 'text-orange-700' : 'text-red-700'}`}>
                  {typeof totalProb === 'number' ? totalProb.toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-50 border-2 border-gray-400">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">꽝 확률 (자동):</span>
                <span className="text-xl font-bold text-gray-700">
                  {consolationProb.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {!isProbabilityValid && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">
                상품 확률의 합이 100%를 초과할 수 없습니다. 현재: {totalProb.toFixed(2)}%
              </p>
            </div>
          )}

          {/* 상품 목록 및 확률 입력 */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : prizes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">상품이 없습니다.</div>
          ) : (
            <div className="space-y-3">
              {/* 일반 상품 (입력 가능) */}
              {prizes
                .filter(prize => prize.type !== 'none')
                .map(prize => (
                  <div 
                    key={prize.id} 
                    className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{prize.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{prize.name}</div>
                        <div className="text-sm text-gray-500">
                          남은 수량: {prize.current_quantity}개
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={prize.probability}
                        onChange={(e) => handleProbabilityChange(prize.id, e.target.value)}
                        className="w-24 text-right font-semibold"
                      />
                      <span className="text-gray-600 font-medium">%</span>
                    </div>
                  </div>
                ))}

              {/* 꽝 (읽기 전용) */}
              {prizes
                .filter(prize => prize.type === 'none')
                .map(prize => (
                  <div 
                    key={prize.id} 
                    className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">{prize.icon}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-700">{prize.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Info className="h-3 w-3" />
                          자동 계산 (100% - 상품 확률 합)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={consolationProb.toFixed(2)}
                        disabled
                        className="w-24 text-right font-semibold bg-gray-100 text-gray-700"
                      />
                      <span className="text-gray-600 font-medium">%</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={!isProbabilityValid || loading || saving || prizes.length === 0}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? '저장 중...' : '저장'}
            </Button>
          </div>

          {/* 안내 문구 */}
          <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
            <p>- 상품 확률의 합은 100% 이하여야 합니다.</p>
            <p>- 꽝 확률은 자동으로 계산됩니다: 100% - (상품 확률 합)</p>
            <p>- 균등 분배 버튼을 누르면 모든 상품에 동일한 확률이 적용됩니다.</p>
            <p>- 예: 상품 확률 합이 35%면, 꽝 확률은 65%가 됩니다.</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}