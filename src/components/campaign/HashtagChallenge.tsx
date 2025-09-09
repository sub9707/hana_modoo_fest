'use client'

import { useState } from 'react'
import { Hash, Upload, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

const popularHashtags = [
  '모두의서울', '함께하는축제', '가족다양성', '한부모가족', 
  '여의도공원', '서울축제', '가족이야기', '일상공유'
]

export default function HashtagChallenge() {
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [customHashtag, setCustomHashtag] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleHashtagToggle = (hashtag: string) => {
    setSelectedHashtags(prev => 
      prev.includes(hashtag) 
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    )
  }

  const handleAddCustomHashtag = () => {
    if (customHashtag && !selectedHashtags.includes(customHashtag)) {
      setSelectedHashtags(prev => [...prev, customHashtag])
      setCustomHashtag('')
    }
  }

  const handleSubmit = async () => {
    if (selectedHashtags.length === 0 || !content.trim()) return
    
    setIsSubmitting(true)
    // Mock API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    
    // 성공 처리
    alert('해시태그 챌린지 참여가 완료되었습니다!')
    setContent('')
    setSelectedHashtags([])
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="w-5 h-5 text-primary" />
            <span>해시태그 챌린지 참여하기</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 인기 해시태그 */}
          <div>
            <h3 className="font-medium mb-3">인기 해시태그</h3>
            <div className="flex flex-wrap gap-2">
              {popularHashtags.map((hashtag) => (
                <Badge
                  key={hashtag}
                  variant={selectedHashtags.includes(hashtag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleHashtagToggle(hashtag)}
                >
                  #{hashtag}
                  {selectedHashtags.includes(hashtag) && (
                    <Check className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* 커스텀 해시태그 추가 */}
          <div>
            <h3 className="font-medium mb-3">나만의 해시태그 추가</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="해시태그 입력 (# 없이)"
                value={customHashtag}
                onChange={(e) => setCustomHashtag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomHashtag()}
              />
              <Button onClick={handleAddCustomHashtag} variant="outline">
                추가
              </Button>
            </div>
          </div>

          {/* 선택된 해시태그 */}
          {selectedHashtags.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">선택된 해시태그</h3>
              <div className="flex flex-wrap gap-2">
                {selectedHashtags.map((hashtag) => (
                  <Badge key={hashtag} className="bg-primary">
                    #{hashtag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 콘텐츠 작성 */}
          <div>
            <h3 className="font-medium mb-3">내용 작성</h3>
            <Textarea
              placeholder="가족과의 소중한 이야기를 들려주세요..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-32"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {content.length}/500자
            </p>
          </div>

          {/* 참여 가이드 */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">참여 방법</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. 해시태그를 선택하거나 추가하세요</li>
              <li>2. 가족과의 일상 이야기를 작성하세요</li>
              <li>3. SNS에 해시태그와 함께 게시하세요</li>
              <li>4. 주간 우수작에 선정되면 상품을 드려요!</li>
            </ol>
          </div>

          {/* 제출 버튼 */}
          <Button 
            onClick={handleSubmit}
            disabled={selectedHashtags.length === 0 || !content.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                참여 중...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                챌린지 참여하기
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}