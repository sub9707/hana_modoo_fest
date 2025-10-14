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
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Noto Sans KR', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px; }
        .code-box { background: #f5f5f5; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>이메일 인증</h1>
        </div>
        <div class="content">
          <p>안녕하세요,</p>
          <p>모두하나대축제 이메일 인증을 위한 인증번호입니다.</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
            <p style="margin: 10px 0 0 0; color: #666;">위 인증번호를 입력해주세요</p>
          </div>
          
          <div class="warning">
            <strong>⚠️ 주의사항</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>인증번호는 <strong>5분간</strong> 유효합니다</li>
              <li>본인이 요청하지 않았다면 이 메일을 무시하세요</li>
              <li>인증번호는 타인에게 절대 알려주지 마세요</li>
            </ul>
          </div>
          
          <p style="margin-top: 20px;">감사합니다.<br>모두하나대축제 팀</p>
        </div>
        <div class="footer">
          <p>본 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터를 이용해주세요.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[모두하나대축제] 이메일 인증번호',
    htmlContent
  })
}