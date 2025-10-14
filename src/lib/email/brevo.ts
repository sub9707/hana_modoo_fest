// src/lib/email/brevo.ts

interface BrevoEmailParams {
  to: string
  subject: string
  htmlContent: string
  textContent?: string
}

interface BrevoResponse {
  success: boolean
  messageId?: string
  error?: string
}

export async function sendEmail(params: BrevoEmailParams): Promise<BrevoResponse> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME

  if (!apiKey || !senderEmail || !senderName) {
    console.error('Brevo 환경 변수가 설정되지 않았습니다')
    return {
      success: false,
      error: '이메일 서비스 설정이 완료되지 않았습니다'
    }
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [{ email: params.to }],
        subject: params.subject,
        htmlContent: params.htmlContent,
        textContent: params.textContent || params.htmlContent.replace(/<[^>]*>/g, '')
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Brevo API 오류:', errorData)
      return {
        success: false,
        error: '이메일 전송에 실패했습니다'
      }
    }

    const data = await response.json()
    return {
      success: true,
      messageId: data.messageId
    }
  } catch (error) {
    console.error('이메일 전송 오류:', error)
    return {
      success: false,
      error: '이메일 전송 중 오류가 발생했습니다'
    }
  }
}

export async function sendVerificationEmail(email: string, code: string): Promise<BrevoResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const heroImageUrl = `${baseUrl}/images/main/main_hero.webp`

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>이메일 인증</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', Arial, sans-serif; background-color: #f5f5f5;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <!-- Main Container -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
              
              <!-- Hero Section -->
<tr>
  <td style="padding: 0; position: relative; height: 180px; background: linear-gradient(135deg, #ff9a3c 0%, #ff4e8b 100%);">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding: 50px 20px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
            모두하나대축제
          </h1>
          <p style="margin: 8px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.95);">
            2025 모두하나대축제에 여러분을 환영합니다.
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>

              
              <!-- Content Section -->
              <tr>
                <td style="padding: 40px 32px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <!-- Message -->
                    <tr>
                      <td style="padding-bottom: 32px;">
                        <p style="margin: 0; font-size: 15px; color: #555555; line-height: 1.7;">
                          모두하나대축제 이메일 인증을 위한 인증번호를 보내드립니다.<br>
                          아래 인증번호를 입력하여 인증을 완료해주세요.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Verification Code Box -->
                    <tr>
                      <td style="padding: 32px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f9ff; border: 3px solid #667eea; border-radius: 12px;">
                          <tr>
                            <td style="padding: 32px 24px; text-align: center;">
                              <p style="margin: 0 0 12px 0; font-size: 14px; color: #666666; font-weight: 500;">인증번호</p>
                              <p style="margin: 8px 0; font-size: 42px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">${code}</p>
                              <p style="margin: 12px 0 0 0; font-size: 13px; color: #888888;">위 6자리 숫자를 입력해주세요</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Information Box -->
                    <tr>
                      <td style="padding: 24px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff8e1; border-left: 4px solid #ffc107; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 12px 0; font-size: 15px; font-weight: bold; color: #856404;">안내사항</p>
                              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                  <td style="padding: 6px 0; font-size: 14px; color: #856404; line-height: 1.6;">
                                    • 인증번호는 발송 시점으로부터 <strong>5분간</strong> 유효합니다
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 6px 0; font-size: 14px; color: #856404; line-height: 1.6;">
                                    • 시간이 만료된 경우 인증번호를 다시 요청해주세요
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding: 6px 0; font-size: 14px; color: #856404; line-height: 1.6;">
                                    • 인증번호가 도착하지 않으면 스팸함을 확인해주세요
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                      <td style="padding: 24px 0;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffe6e6; border-left: 4px solid #dc3545; border-radius: 8px;">
                          <tr>
                            <td style="padding: 20px;">
                              <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: bold; color: #721c24;">보안 주의사항</p>
                              <p style="margin: 0; font-size: 14px; color: #721c24; line-height: 1.6;">
                                본인이 요청하지 않은 인증번호라면 즉시 무시하고 삭제해주세요.
                                인증번호는 타인에게 절대 알려주지 마시고, 의심스러운 경우 고객센터로 문의해주세요.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                      <td style="padding: 24px 0;">
                        <div style="height: 1px; background-color: #e0e0e0;"></div>
                      </td>
                    </tr>
                    
                    <!-- Closing -->
                    <tr>
                      <td>
                        <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.7;">
                          감사합니다.<br>
                          <strong style="color: #667eea;">모두하나대축제 팀</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Timestamp -->
                    <tr>
                      <td style="padding-top: 16px;">
                        <p style="margin: 0; font-size: 12px; color: #999999;">
                          발송시간: ${new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Seoul'
  })}
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
              
              <!-- Footer Section -->
              <tr>
                <td style="padding: 24px 32px; background-color: #f8f9fa; border-top: 1px solid #e0e0e0; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #667eea;">모두하나대축제 2025</p>
                  <p style="margin: 0; font-size: 13px; color: #6c757d; line-height: 1.6;">
                    본 메일은 발신 전용입니다.<br>
                    문의사항이 있으시면 웹사이트의 고객센터를 이용해주세요.
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[모두하나대축제] 이메일 인증번호',
    htmlContent,
    textContent: `
모두하나대축제 이메일 인증

인증번호: ${code}

안내사항:
- 인증번호는 5분간 유효합니다
- 시간이 만료된 경우 인증번호를 다시 요청해주세요
- 인증번호가 도착하지 않으면 스팸함을 확인해주세요

보안 주의사항:
본인이 요청하지 않은 인증번호라면 즉시 무시하고 삭제해주세요.
인증번호는 타인에게 절대 알려주지 마세요.

감사합니다.
모두하나대축제 팀

발송시간: ${new Date().toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Seoul'
    })}
    `.trim()
  })
}