'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const contactSchema = z.object({
  name: z.string().min(2, '이름을 2자 이상 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  phone: z.string().optional(),
  category: z.enum(['general', 'partnership', 'volunteer', 'media']),
  subject: z.string().min(5, '제목을 5자 이상 입력해주세요'),
  message: z.string().min(10, '내용을 10자 이상 입력해주세요')
})

type ContactFormData = z.infer<typeof contactSchema>

const categoryOptions = [
  { value: 'general', label: '일반 문의' },
  { value: 'partnership', label: '협력 제안' },
  { value: 'volunteer', label: '자원봉사' },
  { value: 'media', label: '언론 문의' }
]

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Mock API 호출
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('문의 접수:', data)
      setSubmitSuccess(true)
      reset()
      
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      console.error('문의 접수 실패:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            문의가 접수되었습니다
          </h3>
          <p className="text-muted-foreground">
            빠른 시일 내에 답변드리겠습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>문의하기</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                이름 *
              </label>
              <Input
                placeholder="홍길동"
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                이메일 *
              </label>
              <Input
                type="email"
                placeholder="example@email.com"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                연락처
              </label>
              <Input
                placeholder="010-1234-5678"
                {...register('phone')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                문의 유형 *
              </label>
              <Select onValueChange={(value) => setValue('category', value as any)}>
                <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                  <SelectValue placeholder="문의 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              제목 *
            </label>
            <Input
              placeholder="문의 제목을 입력하세요"
              {...register('subject')}
              className={errors.subject ? 'border-destructive' : ''}
            />
            {errors.subject && (
              <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              내용 *
            </label>
            <Textarea
              placeholder="문의 내용을 자세히 입력해주세요"
              className={`h-32 ${errors.message ? 'border-destructive' : ''}`}
              {...register('message')}
            />
            {errors.message && (
              <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={!isValid || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                접수 중...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                문의 접수
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}