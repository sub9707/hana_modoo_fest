'use client'

import { useState, useRef } from 'react'
import { Upload, X, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'

interface UploadedFile {
  id: string
  file: File
  preview: string
}

export default function PhotoUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [nickname, setNickname] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const id = Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)
        
        setUploadedFiles(prev => [...prev, { id, file, preview }])
      }
    })
  }

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id)
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0 || !title.trim() || !story.trim()) return
    
    setIsSubmitting(true)
    // Mock API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    
    // 성공 처리
    alert('포토 스토리가 성공적으로 업로드되었습니다!')
    
    // 초기화
    uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview))
    setUploadedFiles([])
    setTitle('')
    setStory('')
    setNickname('')
    setIsAnonymous(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>포토 스토리 업로드</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 파일 업로드 */}
          <div>
            <h3 className="font-medium mb-3">사진 업로드</h3>
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                클릭하여 사진을 업로드하세요
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                최대 5장까지 업로드 가능 (JPG, PNG)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* 업로드된 사진 미리보기 */}
          {uploadedFiles.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">업로드된 사진</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 제목 */}
          <div>
            <h3 className="font-medium mb-3">제목</h3>
            <Input
              placeholder="포토 스토리의 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 스토리 내용 */}
          <div>
            <h3 className="font-medium mb-3">스토리</h3>
            <Textarea
              placeholder="사진과 함께 들려주고 싶은 이야기를 작성해주세요..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="h-32"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {story.length}/1000자
            </p>
          </div>

          {/* 작성자 정보 */}
          <div>
            <h3 className="font-medium mb-3">작성자 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                />
                <label htmlFor="anonymous" className="text-sm cursor-pointer">
                  익명으로 게시하기
                </label>
              </div>
              
              {!isAnonymous && (
                <Input
                  placeholder="닉네임을 입력하세요"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              )}
            </div>
          </div>

          {/* 가이드라인 */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">업로드 가이드라인</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 개인정보가 포함된 사진은 업로드하지 마세요</li>
              <li>• 타인의 초상권을 침해하지 않는 사진만 업로드해주세요</li>
              <li>• 부적절한 내용의 사진은 관리자 검토 후 삭제될 수 있습니다</li>
              <li>• 업로드된 사진은 축제 홍보에 활용될 수 있습니다</li>
            </ul>
          </div>

          {/* 제출 버튼 */}
          <Button 
            onClick={handleSubmit}
            disabled={uploadedFiles.length === 0 || !title.trim() || !story.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Upload className="w-4 h-4 mr-2 animate-spin" />
                업로드 중...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                포토 스토리 업로드
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}