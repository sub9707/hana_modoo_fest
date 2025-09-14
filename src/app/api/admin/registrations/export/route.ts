import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // 실제로는 데이터베이스에서 모든 사전접수 데이터 조회
    // const registrations = await db.registrations.findMany()

    // Excel 파일 생성 (실제로는 xlsx 라이브러리 사용)
    // const workbook = XLSX.utils.book_new()
    // const worksheet = XLSX.utils.json_to_sheet(registrations)
    // XLSX.utils.book_append_sheet(workbook, worksheet, '사전접수목록')
    // const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // 샘플 응답
    return new NextResponse(
      JSON.stringify({ message: '엑셀 파일이 생성되었습니다.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="사전접수목록.xlsx"'
        }
      }
    )
  } catch (error) {
    return NextResponse.json(
      { error: '엑셀 파일 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}