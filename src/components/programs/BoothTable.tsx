import { BoothData } from '@/types/booth'

interface BoothTableProps {
    data: BoothData[]
}

export default function BoothTable({ data }: BoothTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.09M6.343 6.343A8 8 0 1017.657 17.657 8 8 0 006.343 6.343z" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">검색 결과가 없습니다</h3>
                    <p className="mt-2 text-sm text-gray-500">다른 검색어로 시도해보세요</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* 통계 정보 */}
            <div className="mt-8 p-5 bg-gray-50 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-base text-gray-600">
                        총 <span className="font-bold text-gray-900">{data.length}개</span>의 부스가 준비되어 있습니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
                    </p>
                </div>
            </div>
            {/* 부스 카드 리스트 */}
            <div className="space-y-8">
                {data.map((booth) => (
                    <div key={booth.id} className="bg-white border border-gray-200 overflow-hidden">
                        {/* 카드 헤더 */}
                        <div className="orange-gradient px-6 py-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <h3 className="text-xl md:text-2xl font-bold text-white">{booth.banner_title}</h3>
                                <span className="text-white text-sm md:text-base bg-white/20 px-3 py-1 w-fit font-medium">
                                    부스 #{booth.id}
                                </span>
                            </div>
                        </div>

                        {/* 카드 바디 - 데스크톱 flex 레이아웃 */}
                        <div className="hidden md:block">
                            <div className="divide-y divide-gray-200">
                                <div className="flex hover:bg-gray-50 transition-colors">
                                    <div className="px-6 py-5 text-base font-bold text-gray-900 bg-gray-50 w-32 flex items-center">
                                        기관명
                                    </div>
                                    <div className="px-6 py-5 text-base text-gray-700 flex-1">
                                        {booth.organization}
                                    </div>
                                </div>
                                <div className="flex hover:bg-gray-50 transition-colors">
                                    <div className="px-6 py-5 text-base font-bold text-gray-900 bg-gray-50 w-32 flex items-center">
                                        그룹명
                                    </div>
                                    <div className="px-6 py-5 text-base text-gray-700 flex-1">
                                        {booth.group}
                                    </div>
                                </div>
                                <div className="flex hover:bg-gray-50 transition-colors">
                                    <div className="px-6 py-5 text-base font-bold text-gray-900 bg-gray-50 w-32 flex items-center">
                                        구역
                                    </div>
                                    <div className="px-6 py-5 text-base text-gray-700 flex-1">
                                        {booth.zone}
                                    </div>
                                </div>
                                <div className="flex hover:bg-gray-50 transition-colors">
                                    <div className="px-6 py-5 text-base font-bold text-gray-900 bg-gray-50 w-32 flex items-center">
                                        부스 활동
                                    </div>
                                    <div className="px-6 py-5 text-base text-gray-700 font-semibold flex-1">
                                        {booth.booth_activity}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 카드 바디 - 모바일 */}
                        <div className="md:hidden p-6 space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <dt className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">기관명</dt>
                                    <dd className="text-base text-gray-900 font-medium">{booth.organization}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">그룹명</dt>
                                    <dd className="text-base text-gray-900">{booth.group}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">구역</dt>
                                    <dd className="text-base text-gray-900">{booth.zone}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">부스 활동</dt>
                                    <dd className="text-base text-gray-900 font-semibold">{booth.booth_activity}</dd>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}