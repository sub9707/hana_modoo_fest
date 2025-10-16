import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/mysql/server'
import { query, queryOne } from '@/lib/mysql/connection'
import type { RegistrationFormData } from '@/types/registration'
import { getFormattedDeadline, isRegistrationClosed } from '@/lib/utils/registration-deadline'

// 신청번호 생성 함수 - 순차적 인덱스 기반
async function generateRegistrationNumber(): Promise<string> {
  try {
    // 현재 가장 큰 registration_number 조회 (숫자만)
    const result = await queryOne(
      `SELECT registration_number 
       FROM registrations 
       WHERE registration_number REGEXP '^[0-9]+$'
       ORDER BY CAST(registration_number AS UNSIGNED) DESC 
       LIMIT 1`
    )

    let nextNumber = 1
    
    if (result && result.registration_number) {
      const currentMax = parseInt(result.registration_number, 10)
      nextNumber = currentMax + 1
    }

    // 자리수에 따라 포맷팅
    // 0-9999: 4자리 (0000-9999)
    // 10000 이상: 그대로 (10000, 10001, ...)
    if (nextNumber <= 9999) {
      return nextNumber.toString().padStart(4, '0')
    } else {
      return nextNumber.toString()
    }
  } catch (error) {
    console.error('Registration number generation error:', error)
    throw new Error('신청번호 생성 중 오류가 발생했습니다.')
  }
}

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
        { registration: null }
      )
    }

    return NextResponse.json({
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

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user || !user.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    if (isRegistrationClosed()) {
      return NextResponse.json(
        { 
          error: '사전 접수가 마감되었습니다.',
          deadline: getFormattedDeadline(),
          closed: true
        },
        { status: 403 }
      )
    }

    const data: RegistrationFormData = await request.json()

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

    const existingRegistration = await queryOne(
      'SELECT id, status FROM registrations WHERE user_id = ? AND status != "cancelled"',
      [user.id]
    )

    if (existingRegistration) {
      return NextResponse.json(
        { error: '이미 참가신청을 완료하셨습니다.' },
        { status: 409 }
      )
    }

    const registrationNumber = await generateRegistrationNumber()
    const registrationId = crypto.randomUUID()

    const cancelledRegistration = await queryOne(
      'SELECT id FROM registrations WHERE user_id = ? AND status = "cancelled"',
      [user.id]
    )

    if (cancelledRegistration) {
      await query(
        `UPDATE registrations SET
          registration_number = ?,
          participant_type = ?,
          companions = ?,
          companion_details = ?,
          address = ?,
          address_detail = ?,
          zip_code = ?,
          special_requests = ?,
          marketing_consent = ?,
          privacy_consent = ?,
          status = 'confirmed',
          updated_at = NOW()
        WHERE id = ?`,
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
          cancelledRegistration.id
        ]
      )

      const updatedRegistration = await queryOne(
        `SELECT r.*, u.name as user_name, u.phone as user_phone 
         FROM registrations r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.id = ?`,
        [cancelledRegistration.id]
      )

      if (!updatedRegistration) {
        throw new Error('등록 정보 조회에 실패했습니다.')
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

export async function DELETE() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

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