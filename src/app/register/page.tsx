'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Calendar, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

const registrationSchema = z.object({
  name: z.string().min(2, '이름을 2자 이상 입력해주세요'),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, '올바른 휴대폰 번호를 입력해주세요 (예: 010-1234-5678)'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  type: z.enum(['citizen', 'single-parent', 'support-group', 'volunteer', 'organization']),
  accompaniedCount: z.number().min(0).max(10, '동반인원은 최대 10명까지 가능합니다'),
  interestedPrograms: z.array(z.string()).min(1, '관심 프로그램을 최소 1개 이상 선택해주세요'),
  privacyConsent: z.boolean().refine(val => val === true, '개인정보 수집·이용 동의는 필수입니다'),
  marketingConsent: z.boolean().optional(),
  emergencyContact: z.string().optional(),
  specialRequests: z.string().max(500, '특별 요청사항은 500자 이내로 입력해주세요').optional()
})

type RegistrationFormData = z.infer<typeof registrationSchema>

const participantTypes = [
  { value: 'citizen', label: '일반 시민/가족', description: '서울시민 누구나' },
  { value: 'single-parent', label: '한부모가족', description: '한부모가족 및 자녀' },
  { value: 'support-group', label: '자조모임', description: '한부모가족 자조모임 회원' },
  { value: 'volunteer', label: '자원봉사자', description: '축제 운영 자원봉사' },
  { value: 'organization', label: '기관 관계자', description: '협력기관 및 단체' }
]

const programCategories = [
  { id: 'opening', label: '개막식/폐막식', category: 'official' },
  { id: 'performance', label: '무대 공연', category: 'performance' },
  { id: 'experience', label: '체험 부스', category: 'experience' },
  { id: 'workshop', label: '워크숍', category: 'experience' },
  { id: 'support-booth', label: '자조모임 부스', category: 'support-group' },
  { id: 'solidarity', label: '연대 부스', category: 'solidarity' },
  { id: 'food', label: '먹거리 코너', category: 'experience' },
  { id: 'kids', label: '키즈 프로그램', category: 'experience' }
]

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      accompaniedCount: 0,
      interestedPrograms: [],
      privacyConsent: false,
      marketingConsent: false
    }
  })

  const selectedType = watch('type')
  const selectedPrograms = watch('interestedPrograms') || []

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Mock API 호출
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('신청 처리 중 오류가 발생했습니다.')
      }

      const result = await response.json()
      
      // 성공 페이지로 이동
      router.push(`/register/success?id=${result.applicationId}`)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProgramToggle = (programId: string) => {
    const currentPrograms = selectedPrograms || []
    const newPrograms = currentPrograms.includes(programId)
      ? currentPrograms.filter(id => id !== programId)
      : [...currentPrograms, programId]
    
    setValue('interestedPrograms', newPrograms, { shouldValidate: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            사전참가 신청
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            모두하나대축제 2025 참가신청
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            축제 당일 더욱 즐거운 시간을 보내기 위해 사전에 참가신청을 해주세요.<br />
            신청하신 분들께는 축제 안내와 특별 혜택을 제공합니다.
          </p>
        </div>

        {/* 축제 정보 요약 */}
        <Card className="mb-8 border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">행사 일정</p>
                  <p className="font-semibold">2025.10.18(토) 11:00-16:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">개최 장소</p>
                  <p className="font-semibold">여의도공원 문화의마당</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-slate-600">참가비</p>
                  <p className="font-semibold text-green-600">무료</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 신청 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <span>기본 정보</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">이름 *</Label>
                  <Input
                    id="name"
                    placeholder="홍길동"
                    {...register('name')}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">휴대폰 번호 *</Label>
                  <Input
                    id="phone"
                    placeholder="010-1234-5678"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">이메일 주소 *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...register('email')}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  축제 관련 안내사항을 이메일로 발송합니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 참가자 유형 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <span>참가자 유형</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedType}
                onValueChange={(value) => setValue('type', value as any, { shouldValidate: true })}
                className="space-y-4"
              >
                {participantTypes.map((type) => (
                  <div key={type.value} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value={type.value} id={type.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={type.value} className="font-medium cursor-pointer">
                        {type.label}
                      </Label>
                      <p className="text-sm text-slate-600 mt-1">{type.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {errors.type && (
                <p className="text-sm text-red-600 mt-2">{errors.type.message}</p>
              )}
            </CardContent>
          </Card>

          {/* 동반 인원 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <span>동반 인원</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="accompaniedCount">함께 참석할 인원 수 (본인 제외)</Label>
                <Select
                  value={watch('accompaniedCount')?.toString() || '0'}
                  onValueChange={(value) => setValue('accompaniedCount', parseInt(value), { shouldValidate: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="인원 수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num === 0 ? '혼자 참석' : `${num}명`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500 mt-1">
                  총 참석 인원: {(watch('accompaniedCount') || 0) + 1}명
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 관심 프로그램 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <span>관심 프로그램</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">참여하고 싶은 프로그램을 선택해주세요. (복수 선택 가능)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {programCategories.map((program) => (
                  <div key={program.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors">
                    <Checkbox
                      id={program.id}
                      checked={selectedPrograms.includes(program.id)}
                      onCheckedChange={() => handleProgramToggle(program.id)}
                    />
                    <Label htmlFor={program.id} className="flex-1 cursor-pointer">
                      {program.label}
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      {program.category}
                    </Badge>
                  </div>
                ))}
              </div>
              
              {errors.interestedPrograms && (
                <p className="text-sm text-red-600 mt-2">{errors.interestedPrograms.message}</p>
              )}
              
              {selectedPrograms.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    선택된 프로그램: {selectedPrograms.length}개
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <span>추가 정보 (선택사항)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="emergencyContact">비상연락처</Label>
                <Input
                  id="emergencyContact"
                  placeholder="010-1234-5678"
                  {...register('emergencyContact')}
                />
                <p className="text-sm text-slate-500 mt-1">
                  응급상황 시 연락할 수 있는 번호를 입력해주세요.
                </p>
              </div>

              <div>
                <Label htmlFor="specialRequests">특별 요청사항</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="휠체어 이용, 수유실 필요, 식이제한 등 특별히 요청하실 사항이 있으시면 자유롭게 작성해주세요."
                  className="h-24"
                  {...register('specialRequests')}
                />
                <p className="text-sm text-slate-500 mt-1">
                  접근성 지원, 식이제한, 기타 도움이 필요한 사항을 알려주세요.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 개인정보 동의 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</div>
                <span>개인정보 수집·이용 동의</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg text-sm">
                <h4 className="font-medium mb-2">개인정보 수집·이용 안내</h4>
                <ul className="space-y-1 text-slate-600">
                  <li>• 수집항목: 이름, 연락처, 이메일, 참가자 유형, 동반인원, 관심프로그램</li>
                  <li>• 수집목적: 축제 참가 접수, 행사 안내, 현장 운영</li>
                  <li>• 보유기간: 축제 종료 후 1개월 (법적 의무 보관기간 제외)</li>
                  <li>• 동의 거부권: 개인정보 수집·이용에 동의하지 않을 권리가 있으며, 동의 거부 시 참가신청이 제한됩니다.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacyConsent"
                    checked={watch('privacyConsent')}
                    onCheckedChange={(checked) => setValue('privacyConsent', !!checked, { shouldValidate: true })}
                    className={errors.privacyConsent ? 'border-red-500' : ''}
                  />
                  <Label htmlFor="privacyConsent" className="text-sm leading-relaxed cursor-pointer">
                    <span className="text-red-500">*</span> 개인정보 수집·이용에 동의합니다.
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketingConsent"
                    checked={watch('marketingConsent')}
                    onCheckedChange={(checked) => setValue('marketingConsent', !!checked)}
                  />
                  <Label htmlFor="marketingConsent" className="text-sm leading-relaxed cursor-pointer">
                    향후 서울시 한부모가족지원센터의 행사 및 프로그램 안내 수신에 동의합니다. (선택)
                  </Label>
                </div>
              </div>

              {errors.privacyConsent && (
                <p className="text-sm text-red-600">{errors.privacyConsent.message}</p>
              )}
            </CardContent>
          </Card>

          {/* 에러 메시지 */}
          {submitError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {/* 제출 버튼 */}
          <div className="text-center">
            <Button 
              type="submit" 
              size="lg" 
              disabled={!isValid || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 px-12 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  신청 접수 중...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  참가신청 완료
                </>
              )}
            </Button>
            
            <p className="text-sm text-slate-500 mt-4">
              신청 완료 후 입력하신 연락처로 확인 안내를 보내드립니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}