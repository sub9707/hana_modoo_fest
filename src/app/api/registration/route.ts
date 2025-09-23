import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, queryOne, transaction } from '@/lib/mysql/connection'
import type { RegistrationFormData, Registration } from '@/types/registration'

// 신청번호 생성 함수
function generateRegistrationNumber(): string {
  const year = new Date().getFullYear()
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `MH${year}-${randomStr}`
}

// GET: 현재 사용자의 참가신청 조회
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const registration = await queryOne(
      `SELECT r.*, u.name as user_name, u.phone as user_phone 
       FROM registrations r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.user_id = ? AND r.status != 'cancelled'`,
      [user.id]
    )

    if (!registration) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      )
    }

    return NextResponse.json({
      exists: true,
      registration: {
        id: registration.id,
        registration_number: registration.registration_number,
        participant_type: registration.participant_type,
        companions: registration.companions,
        companion_details: registration.companion_details,
        address: registration.address,
        address_detail: registration.address_detail,
        zip_code: registration.zip_code,
        special_requests: registration.special_requests,
        marketing_consent: registration.marketing_consent === 1,
        privacy_consent: registration.privacy_consent === 1,
        status: registration.status,
        created_at: registration.created_at,
        updated_at: registration.updated_at,
        user_name: registration.user_name,
        user_phone: registration.user_phone
      }
    })

  } catch (error) {
    console.error('Registration GET error:', error)
    return NextResponse.json(
      { error: '참가신청 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 새로운 참가신청 등록
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const data: RegistrationFormData = await request.json()

    // 입력 데이터 검증
    if (!data.participant_type || !data.address || !data.zip_code) {
      return NextResponse.json(
        { error: '필수 입력 항목이 누락되었습니다.' },
        { status: 400 }
      )
    }

    if (!data.privacy_consent) {
      return NextResponse.json(
        { error: '개인정보 수집·이용 동의가 필요합니다.' },
        { status: 400 }
      )
    }

    // 이미 신청한 사용자인지 확인 (활성 신청만)
    const existingRegistration = await queryOne(
      'SELECT id, status FROM registrations WHERE user_id = ?',
      [user.id]
    )

    if (existingRegistration && existingRegistration.status !== 'cancelled') {
      return NextResponse.json(
        { error: '이미 참가신청을 완료하셨습니다.' },
        { status: 409 }
      )
    }

    // UUID 생성 (Node.js 18+ 내장)
    const registrationId = crypto.randomUUID()
    
    // 신청번호 생성
    let registrationNumber = generateRegistrationNumber()
    
    // 신청번호 중복 확인 및 재생성
    let attempts = 0
    const maxAttempts = 10
    
    while (attempts < maxAttempts) {
      const existing = await queryOne(
        'SELECT id FROM registrations WHERE registration_number = ?',
        [registrationNumber]
      )
      
      if (!existing) {
        break // 중복되지 않으면 사용
      }
      
      registrationNumber = generateRegistrationNumber()
      attempts++
      
      if (attempts >= maxAttempts) {
        throw new Error('신청번호 생성에 실패했습니다.')
      }
    }

    // 기존 취소된 레코드가 있으면 업데이트, 없으면 새로 삽입
    if (existingRegistration && existingRegistration.status === 'cancelled') {
      // 기존 취소된 레코드를 업데이트
      await query(
        `UPDATE registrations SET 
         registration_number = ?, participant_type = ?, companions = ?, companion_details = ?,
         address = ?, address_detail = ?, zip_code = ?, special_requests = ?,
         marketing_consent = ?, privacy_consent = ?, status = ?, updated_at = NOW()
         WHERE user_id = ?`,
        [
          registrationNumber,
          data.participant_type,
          data.companions || 0,
          data.companion_details || null,
          data.address,
          data.address_detail || null,
          data.zip_code,
          data.special_requests || null,
          data.marketing_consent ? 1 : 0,
          data.privacy_consent ? 1 : 0,
          'confirmed',
          user.id
        ]
      )
      
      // 업데이트된 레코드의 ID는 기존 ID 사용
      const finalRegistrationId = existingRegistration.id
      
      // 업데이트된 신청 정보 조회
      const updatedRegistration = await queryOne(
        `SELECT r.*, u.name as user_name, u.phone as user_phone 
         FROM registrations r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.id = ?`,
        [finalRegistrationId]
      )

      if (!updatedRegistration) {
        throw new Error('업데이트된 등록 정보 조회에 실패했습니다.')
      }

      return NextResponse.json({
        success: true,
        message: '참가신청이 완료되었습니다.',
        registrationId: updatedRegistration.id,
        registrationNumber: updatedRegistration.registration_number,
        registration: {
          id: updatedRegistration.id,
          registration_number: updatedRegistration.registration_number,
          participant_type: updatedRegistration.participant_type,
          companions: updatedRegistration.companions,
          companion_details: updatedRegistration.companion_details,
          address: updatedRegistration.address,
          address_detail: updatedRegistration.address_detail,
          zip_code: updatedRegistration.zip_code,
          special_requests: updatedRegistration.special_requests,
          marketing_consent: updatedRegistration.marketing_consent === 1,
          privacy_consent: updatedRegistration.privacy_consent === 1,
          status: updatedRegistration.status,
          created_at: updatedRegistration.created_at,
          updated_at: updatedRegistration.updated_at,
          user_name: updatedRegistration.user_name,
          user_phone: updatedRegistration.user_phone
        }
      })
    } else {
      // 새로운 레코드 삽입
      await query(
        `INSERT INTO registrations (
          id, user_id, registration_number, participant_type, companions, companion_details,
          address, address_detail, zip_code, special_requests,
          marketing_consent, privacy_consent, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          registrationId,
          user.id,
          registrationNumber,
          data.participant_type,
          data.companions || 0,
          data.companion_details || null,
          data.address,
          data.address_detail || null,
          data.zip_code,
          data.special_requests || null,
          data.marketing_consent ? 1 : 0,
          data.privacy_consent ? 1 : 0,
          'confirmed'
        ]
      )

      // 등록된 신청 정보 조회
      const newRegistration = await queryOne(
        `SELECT r.*, u.name as user_name, u.phone as user_phone 
         FROM registrations r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.id = ?`,
        [registrationId]
      )

      if (!newRegistration) {
        throw new Error('등록 정보 조회에 실패했습니다.')
      }

      return NextResponse.json({
        success: true,
        message: '참가신청이 완료되었습니다.',
        registrationId: newRegistration.id,
        registrationNumber: newRegistration.registration_number,
        registration: {
          id: newRegistration.id,
          registration_number: newRegistration.registration_number,
          participant_type: newRegistration.participant_type,
          companions: newRegistration.companions,
          companion_details: newRegistration.companion_details,
          address: newRegistration.address,
          address_detail: newRegistration.address_detail,
          zip_code: newRegistration.zip_code,
          special_requests: newRegistration.special_requests,
          marketing_consent: newRegistration.marketing_consent === 1,
          privacy_consent: newRegistration.privacy_consent === 1,
          status: newRegistration.status,
          created_at: newRegistration.created_at,
          updated_at: newRegistration.updated_at,
          user_name: newRegistration.user_name,
          user_phone: newRegistration.user_phone
        }
      })
    }

  } catch (error) {
    console.error('Registration POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '참가신청 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 참가신청 취소
export async function DELETE() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    // 현재 참가신청 조회
    const registration = await queryOne(
      'SELECT id, status FROM registrations WHERE user_id = ? AND status != "cancelled"',
      [user.id]
    )

    if (!registration) {
      return NextResponse.json(
        { error: '취소할 참가신청이 없습니다.' },
        { status: 404 }
      )
    }

    // 참가신청 상태를 취소로 변경
    await query(
      'UPDATE registrations SET status = "cancelled", updated_at = NOW() WHERE id = ?',
      [registration.id]
    )

    return NextResponse.json({
      success: true,
      message: '참가신청이 취소되었습니다.'
    })

  } catch (error) {
    console.error('Registration DELETE error:', error)
    return NextResponse.json(
      { error: '참가신청 취소 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}