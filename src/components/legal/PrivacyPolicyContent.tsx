import { Shield, Lock, Eye, Trash2, UserCheck, Phone, Mail, AlertTriangle } from 'lucide-react'

// NextJS 15 Server Component로 구현
export default function PrivacyPolicyContent() {
    return (
        <div className="space-y-8 text-gray-700 leading-relaxed">
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-start">
                    <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-red-900 font-bold mb-2">
                            본 개인정보처리방침은 법무 검토 전 임시 버전입니다
                        </p>
                        <p className="text-red-800 text-sm">
                            시행일: 2025년 9월 29일
                            <br />
                            본 방침은 법률 전문가의 검토를 거치지 않은 임시 버전이며, 
                            추후 전문가 자문을 받아 수정될 수 있습니다. 변경 시 사전 공지하겠습니다.
                        </p>
                    </div>
                </div>
            </div>
            {/* 목차 */}
            <nav className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                    <Shield className="w-6 h-6 mr-2" />
                    목차
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-orange-700">
                    <li><a href="#section1" className="hover:underline">개인정보의 수집 및 이용목적</a></li>
                    <li><a href="#section2" className="hover:underline">수집하는 개인정보 항목</a></li>
                    <li><a href="#section3" className="hover:underline">개인정보의 보유 및 이용기간</a></li>
                    <li><a href="#section4" className="hover:underline">개인정보의 제3자 제공</a></li>
                    <li><a href="#section5" className="hover:underline">개인정보처리 위탁</a></li>
                    <li><a href="#section6" className="hover:underline">개인정보의 파기절차 및 방법</a></li>
                    <li><a href="#section7" className="hover:underline">정보주체의 권리·의무 및 행사방법</a></li>
                    <li><a href="#section8" className="hover:underline">개인정보 보호책임자</a></li>
                    <li><a href="#section9" className="hover:underline">개인정보 처리방침 변경</a></li>
                </ol>
            </nav>

            {/* 1. 개인정보의 수집 및 이용목적 */}
            <section id="section1" className="border-l-4 border-orange-500 pl-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <UserCheck className="w-7 h-7 mr-3 text-orange-600" />
                    1. 개인정보의 수집 및 이용목적
                </h2>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">가. 회원가입 및 관리</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>회원 식별 및 본인확인</li>
                            <li>중복가입 확인 및 부정이용 방지</li>
                            <li>회원탈퇴 의사 확인</li>
                            <li>분쟁 조정을 위한 기록보존</li>
                            <li>불만처리 등 민원처리</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">나. 모두하나대축제 2025 서비스 제공</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>축제 사전참가신청 접수 및 관리</li>
                            <li>행사 안내 및 알림 발송</li>
                            <li>경품 추첨 및 배송</li>
                            <li>온라인 축제 컨텐츠 참여</li>
                            <li>서비스 이용내역 관리</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">다. 마케팅 및 광고 활용 (선택)</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                            <li>신규 서비스 및 이벤트 정보 제공</li>
                            <li>맞춤형 서비스 제공</li>
                            <li>통계작성 및 만족도 조사</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 2. 수집하는 개인정보 항목 */}
            <section id="section2" className="border-l-4 border-green-500 pl-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Eye className="w-7 h-7 mr-3 text-green-600" />
                    2. 수집하는 개인정보 항목
                </h2>

                <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">가. 직접 수집 항목 (회원가입 시)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">필수항목</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                                    <li>이름, 성별, 생년월일</li>
                                    <li>휴대폰번호</li>
                                    <li>주소 (우편번호, 기본주소, 상세주소)</li>
                                    <li>아이디 (전화번호 가입 시)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">선택항목</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                                    <li>이메일 주소</li>
                                    <li>소속명(행사관계자)</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                            <Phone className="w-5 h-5 mr-2 text-yellow-600" />
                            나. SNS 로그인 시 수집 항목
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">카카오 로그인</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                                    <li>카카오 계정 정보 (ID)</li>
                                    <li>프로필 정보 (닉네임, 프로필 사진)</li>
                                    <li>카카오계정 이메일</li>
                                    <li>성별, 연령대, 생일</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-700 mb-2">네이버 로그인</h4>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                                    <li>네이버 아이디</li>
                                    <li>프로필 정보 (이름, 닉네임)</li>
                                    <li>이메일 주소</li>
                                    <li>성별, 연령대, 생일</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-yellow-100 rounded-md">
                            <p className="text-sm text-yellow-800">
                                <strong>참고:</strong> SNS 로그인 시에는 해당 플랫폼에서 제공하는 정보만 수집되며,
                                추가 정보는 서비스 이용을 위해 별도로 입력받습니다.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">다. 자동 수집 항목</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                            <li>서비스 이용기록, 접속 로그, 쿠키</li>
                            <li>접속 IP 주소, 브라우저 정보</li>
                            <li>기기정보 (모바일 기기식별번호, OS버전)</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. 개인정보의 보유 및 이용기간 */}
            <section id="section3" className="border-l-4 border-purple-500 pl-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Lock className="w-7 h-7 mr-3 text-purple-600" />
                    3. 개인정보의 보유 및 이용기간
                </h2>

                <div className="space-y-4">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">원칙</h3>
                        <p className="text-gray-700">
                            개인정보는 <strong>수집 및 이용목적이 달성된 후 90일 이내에 지체없이 파기</strong>합니다.
                            단, 관련 법령에 따라 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보관합니다.
                        </p>
                    </div>
                </div>
            </section>
            {/* 4. 개인정보의 제3자 제공 */}
            <section id="section4" className="border-l-4 border-red-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    4. 개인정보의 제3자 제공
                </h2>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <p className="text-gray-700">
                        회사는 <strong>원칙적으로 개인정보를 외부에 제공하지 않습니다.</strong>
                        다만, 다음의 경우에는 예외로 합니다.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 mt-3 ml-4">
                        <li>정보주체가 사전에 동의한 경우</li>
                        <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                        <li>경품 배송을 위한 택배업체 제공 (수령인 정보에 한함)</li>
                    </ul>
                </div>
            </section >

            {/* 5. 개인정보처리 위탁 */}
            <section id="section5" className="border-l-4 border-orange-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    5. 개인정보처리 위탁
                </h2>
                <div className="space-y-4">
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">현재 위탁업체</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-orange-100">
                                    <tr>
                                        <th className="text-left p-3 font-semibold">수탁업체</th>
                                        <th className="text-left p-3 font-semibold">위탁업무</th>
                                        <th className="text-left p-3 font-semibold">개인정보 보유기간</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-orange-200">
                                    <tr>
                                        <td className="p-3">카카오</td>
                                        <td className="p-3">소셜 로그인 서비스</td>
                                        <td className="p-3">이용자 탈퇴시까지</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section >

            {/* 6. 개인정보의 파기절차 및 방법 */}
            <section id="section6" className="border-l-4 border-gray-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <Trash2 className="w-7 h-7 mr-3 text-gray-600" />
                    6. 개인정보의 파기절차 및 방법
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">파기절차</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                            <li>보유기간 만료 또는 처리목적 달성시 지체없이 파기</li>
                            <li>개인정보보호책임자의 승인 후 파기</li>
                            <li>파기 대상 개인정보의 목록 작성</li>
                            <li>파기 작업 완료 후 파기 증명서 작성</li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">파기방법</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                            <li><strong>전자적 파일:</strong> 복구 불가능한 방법으로 영구 삭제</li>
                            <li><strong>종이 문서:</strong> 분쇄기로 분쇄하거나 소각</li>
                            <li><strong>데이터베이스:</strong> 완전 삭제 및 복구 불가 처리</li>
                        </ul>
                    </div>
                </div>
            </section >

            {/* 7. 정보주체의 권리·의무 및 행사방법 */}
            <section id="section7" className="border-l-4 border-indigo-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    7. 정보주체의 권리·의무 및 행사방법
                </h2>

                <div className="space-y-4">
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">개인정보 관련 권리</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                            <li><strong>열람권:</strong> 개인정보 처리현황을 확인할 권리</li>
                            <li><strong>정정·삭제권:</strong> 잘못된 정보의 수정이나 삭제를 요구할 권리</li>
                            <li><strong>처리정지권:</strong> 개인정보 처리를 중단하도록 요구할 권리</li>
                            <li><strong>손해배상청구권:</strong> 개인정보 침해로 인한 손해배상을 청구할 권리</li>
                        </ul>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">권리 행사 방법</h3>
                        <p className="text-gray-700 mb-3">
                            아래 연락처로 서면, 전화, 이메일을 통해 요청하실 수 있습니다.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-indigo-600" />
                                <span>hanbumo1@seoul.go.kr</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-indigo-600" />
                                <span>02-861-3020</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 8. 개인정보 보호책임자 */}
            <section id="section8" className="border-l-4 border-teal-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    8. 개인정보 보호책임자
                </h2>

                <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">개인정보보호책임자</h3>
                            <div className="space-y-2 text-gray-700">
                                <p><strong>성명:</strong> 신성익</p>
                                <p><strong>소속:</strong> (주)하우두유두</p>
                                <p><strong>연락처:</strong> 02-322-9775</p>
                                <p><strong>이메일:</strong> how9775@naver.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* 9. 개인정보 처리방침 변경 */}
            <section id="section9" className="border-l-4 border-pink-500 pl-6" >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    9. 개인정보 처리방침 변경
                </h2>

                <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                    <p className="text-gray-700 mb-3">
                        이 개인정보 처리방침은 <strong>2025년 9월 29일</strong>부터 적용됩니다.
                    </p>
                    <p className="text-gray-700">
                        법령이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보 처리방침을 수정할 수 있습니다.
                        개인정보 처리방침이 변경되는 경우 최소 7일 전에 공지사항을 통해 사전 공지해 드립니다.
                    </p>
                </div>
            </section >
        </div >
    )
}