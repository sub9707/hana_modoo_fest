import Link from 'next/link'
import { MapPin, Train, Bus, Car, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LocationPreview() {
  return (
    <div className="max-w-7xl mx-auto container-padding">
      {/* 섹션 헤더 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-4">
          <MapPin className="w-4 h-4 mr-2" />
          찾아오시는 길
        </div>
        <h2 className="text-responsive-xl font-bold text-foreground mb-4">
          여의도공원에서 만나요
        </h2>
        <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
          대중교통과 자가용 모두 편리한 여의도공원 문화의마당에서<br className="hidden sm:block" />
          모두하나대축제가 열립니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 지도 영역 */}
        <div className="relative">
          <div className="aspect-video bg-muted rounded-2xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">여의도공원 문화의마당</h3>
                <p className="text-muted-foreground">서울특별시 영등포구 여의공원로 68</p>
              </div>
            </div>
          </div>
          
          <div className="absolute top-4 right-4">
            <Button asChild size="sm" className="bg-card text-card-foreground hover:bg-muted shadow-lg">
              <Link href="/location">
                상세 지도 보기
              </Link>
            </Button>
          </div>
        </div>

        {/* 교통 정보 */}
        <div className="space-y-6">
          <h3 className="text-responsive-lg font-bold text-foreground mb-6">
            교통 안내
          </h3>

          <div className="space-y-4">
            {/* 지하철 */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Train className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">지하철</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      5호선 여의나루역 2번 출구 도보 5분<br />
                      9호선 여의도역 4번 출구 도보 10분
                    </p>
                    <p className="text-xs text-blue-600">추천 이용 방법</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 버스 */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">버스</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      여의도공원 정류장: 162, 261, 461, 753<br />
                      국회의사당 정류장: 150, 160, 162, 260
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 자가용 */}
            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">자가용</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      여의도공원 주차장 이용 가능<br />
                      주차 요금: 기본 30분 1,000원
                    </p>
                    <p className="text-xs text-orange-600">주차공간 한정으로 대중교통 이용 권장</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA 버튼 */}
          <div className="pt-6">
            <Button asChild className="w-full">
              <Link href="/location">
                상세 교통정보 및 현장 안내도 보기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}