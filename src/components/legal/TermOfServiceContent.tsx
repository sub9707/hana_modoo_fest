import { FileText, UserCheck, AlertTriangle, Shield } from 'lucide-react'

export default function TermsOfServiceContent() {
  return (
    <div className="space-y-8 text-gray-700 leading-relaxed">

      <h1 className="text-3xl font-bold text-gray-900 mb-6">모두하나대축제 2025 이용약관</h1>
      {/* 면책 경고 배너 */}
      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <p className="text-red-900 font-bold mb-2">
              본 이용약관은 법무 검토 전 임시 버전입니다
            </p>
            <p className="text-red-800 text-sm">
              시행일: 2025년 9월 29일
              <br />
              본 약관은 법률 전문가의 검토를 거치지 않은 임시 버전이며,
              추후 전문가 자문을 받아 수정될 수 있습니다. 변경 시 사전 공지하겠습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 목차 */}
      <nav className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          목차
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li><a href="#section1" className="hover:underline">총칙</a></li>
          <li><a href="#section2" className="hover:underline">서비스 이용</a></li>
          <li><a href="#section3" className="hover:underline">회원가입 및 관리</a></li>
          <li><a href="#section4" className="hover:underline">회원의 의무</a></li>
          <li><a href="#section5" className="hover:underline">서비스 제공</a></li>
          <li><a href="#section6" className="hover:underline">개인정보 보호</a></li>
          <li><a href="#section7" className="hover:underline">책임 제한</a></li>
          <li><a href="#section8" className="hover:underline">분쟁 해결</a></li>
        </ol>
      </nav>


      {/* 제1조: 목적 */}
      <section id="section1" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제1조 (목적)
        </h2>
        <p className="text-gray-700 mb-4">
          본 약관은 서울특별시가 주최하고 서울특별시한부모가족지원센터(이하 ‘센터’) 가 주관하는
          ‘모두하나대축제 2025’ 웹사이트(이하 “사이트”)의 이용에 관한 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      {/* 제2조: 정의 */}
      <section id="section2" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제2조 (정의)
        </h2>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>1. "서비스"</strong>란 모두하나대축제 2025의 사전참가 신청, 온라인 축제 참여, 소식 확인 등
              사이트를 통해 제공되는 모든 서비스를 의미합니다.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>2. "회원"</strong>이란 사이트에 개인정보를 제공하여 회원가입을 한 자로서,
              센터의 정보를 지속적으로 제공받으며 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700">
              <strong>3. "법정대리인"</strong>이란 만 14세 미만 아동의 친권자 또는 후견인을 말합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 제3조: 약관의 효력 및 변경 */}
      <section id="section3" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제3조 (약관의 효력 및 변경)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
          </p>
          <p>
            <strong>2.</strong> 센터는 필요한 경우 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수 있으며,
            변경된 약관은 제1항과 같은 방법으로 공지함으로써 효력이 발생합니다.
          </p>
          <p>
            <strong>3.</strong> 회원은 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 제4조: 회원가입 */}
      <section id="section4" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제4조 (회원가입)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 회원가입은 이용자가 약관의 내용에 동의를 하고 회원가입 신청을 한 후
            센터가 이러한 신청에 대하여 승낙함으로써 체결됩니다.
          </p>

          <p>
            <strong>2.</strong> 본 서비스는 연령 제한 없이 누구나 이용 가능합니다.
            다만, 만 14세 미만 아동의 경우 법정대리인(부모 또는 보호자)의 동의를 받아야 회원가입이 가능합니다.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-3">
            <p className="font-semibold text-blue-900 mb-2">가족 단위 참여 환영</p>
            <p className="text-sm text-blue-800">
              본 행사는 다문화가정을 위한 축제로, 가족 모두의 참여를 환영합니다.
              만 14세 미만 아동도 법정대리인의 동의 하에 회원가입 및 참가신청이 가능하며,
              회원가입 시 법정대리인 동의 항목에 체크해주시기 바랍니다.
            </p>
          </div>

          <p>
            <strong>3.</strong> 법정대리인의 동의는 회원가입 시 법정대리인 동의 항목에 체크함으로써
            이루어지며, 이는 법정대리인이 직접 동의한 것으로 간주합니다.
          </p>

          <p>
            <strong>4.</strong> 센터는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않거나
            사후에 이용계약을 해지할 수 있습니다:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
            <li>허위의 정보를 기재하거나, 센터가 제시하는 내용을 기재하지 않은 경우</li>
            <li>만 14세 미만 아동이 법정대리인의 동의 없이 가입한 경우</li>
            <li>부정한 용도 또는 영리를 추구할 목적으로 서비스를 이용하고자 하는 경우</li>
          </ul>

          <p>
            <strong>5.</strong> 법정대리인은 아동이 본인의 동의 없이 서비스를 이용하고 있음을
            발견한 경우, 즉시 센터에 연락하여 계정 삭제를 요청할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 제5조: 회원정보의 변경 */}
      <section id="section5" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제5조 (회원정보의 변경)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 회원은 개인정보관리화면을 통하여 언제든지 본인의 개인정보를 열람하고 수정할 수 있습니다.
          </p>
          <p>
            <strong>2.</strong> 회원은 회원가입 신청 시 기재한 사항이 변경되었을 경우 온라인으로 수정을 하거나
            전자우편 기타 방법으로 센터에 대하여 그 변경사항을 알려야 합니다.
          </p>
          <p>
            <strong>3.</strong> 제2항의 변경사항을 센터에 알리지 않아 발생한 불이익에 대하여 센터는 책임지지 않습니다.
          </p>
        </div>
      </section>

      {/* 제6조: 회원 탈퇴 및 자격 상실 */}
      <section id="section6" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제6조 (회원 탈퇴 및 자격 상실)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 회원은 센터에 언제든지 탈퇴를 요청할 수 있으며 센터는 즉시 회원탈퇴를 처리합니다.
          </p>
          <p>
            <strong>2.</strong> 회원이 다음 각호의 사유에 해당하는 경우, 센터는 회원자격을 제한 및 정지시킬 수 있습니다:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>가입 신청 시에 허위 내용을 등록한 경우</li>
            <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 질서를 위협하는 경우</li>
            <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
          </ul>
        </div>
      </section>

      {/* 제7조: 서비스의 제공 */}
      <section id="section7" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제7조 (서비스의 제공)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>센터는 다음과 같은 서비스를 제공합니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>모두하나대축제 2025 사전참가 신청 서비스</li>
            <li>온라인 축제 참여 서비스</li>
            <li>축제 관련 정보 제공</li>
            <li>경품 추첨 및 배송 서비스</li>
            <li>기타 센터가 정하는 서비스</li>
          </ul>
        </div>
      </section>

      {/* 제8조: 회원의 의무 */}
      <section id="section8" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제8조 (회원의 의무)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>신청 또는 변경 시 허위 내용의 등록</li>
            <li>타인의 정보 도용</li>
            <li>센터에 게시된 정보의 무단 변경</li>
            <li>센터 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
            <li>센터 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
            <li>외설 또는 폭력적인 정보를 공개 또는 게시하는 행위</li>
          </ul>
        </div>
      </section>

      {/* 제9조: 개인정보 보호 */}
      <section id="section9" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제9조 (개인정보 보호)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 센터는 이용자의 개인정보 수집 시 서비스 제공에 필요한 최소한의 개인정보를 수집합니다.
          </p>
          <p>
            <strong>2.</strong> 센터는 이용자의 개인정보를 수집·이용하는 때에는 당해 이용자에게 그 목적을 고지하고 동의를 받습니다.
          </p>
          <p>
            <strong>3.</strong> 만 14세 미만 아동의 개인정보 수집 시에는 법정대리인의 동의를 받습니다.
          </p>
          <p>
            <strong>4.</strong> 수집된 개인정보는 별도로 공지한{' '}
            <a href="/privacy-policy" className="text-blue-600 hover:underline font-medium">
              개인정보처리방침
            </a>
            에 따라 관리됩니다.
          </p>
        </div>
      </section>

      {/* 제10조: 경품 제공 */}
      <section id="section10" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제10조 (경품 제공)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 센터는 행사 참여자에게 추첨을 통해 경품을 제공할 수 있습니다.
          </p>
          <p>
            <strong>2.</strong> 경품의 가액이 5만원을 초과하는 경우,
            관련 세법에 따라 제세공과금이 발생할 수 있으며, 이는 당첨자가 부담합니다.
          </p>
          <p>
            <strong>3.</strong> 경품은 타인에게 양도하거나 현금으로 교환할 수 없습니다.
          </p>
        </div>
      </section>

      {/* 제11조: 책임 제한 */}
      <section id="section11" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제11조 (책임 제한)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 센터는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는
            서비스 제공에 관한 책임이 면제됩니다.
          </p>
          <p>
            <strong>2.</strong> 센터는 회원의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.
          </p>
          <p>
            <strong>3.</strong> 센터는 회원이 서비스를 이용하여 기대하는 이익을 얻지 못하거나 상실한 것에 대하여 책임을 지지 않습니다.
          </p>
          <p>단, 센터의 고의 또는 중대한 과실에 의한 손해에 대해서는 관련 법령에 따라 책임을 집니다.</p>
        </div>
      </section>

      {/* 제12조: 분쟁 해결 */}
      <section id="section12" className="pt-10 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          제12조 (분쟁 해결)
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>1.</strong> 센터는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
            피해보상처리기구를 설치·운영할 수 있습니다.
          </p>
          <p>
            <strong>2.</strong> 본 약관에 명시되지 않은 사항은 관계법령 및 상관례에 따릅니다.
          </p>
          <p>
            <strong>3.</strong> 이용자는 개인정보 침해 및 서비스 이용 관련 분쟁 발생 시
            개인정보분쟁조정위원회 또는 한국인터넷진흥원(KISA) 등에 분쟁조정을 신청할 수 있습니다.
          </p>
        </div>
      </section>

      {/* 연락처 */}
      <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          문의 및 연락처
        </h2>
        <div className="space-y-2 text-gray-700">
          <p><strong>기관명:</strong> 서울특별시한부모가족지원센터</p>
          <p><strong>주소:</strong> 서울특별시 동작구 여의대방로54길 18</p>
          <p><strong>전화:</strong> 02-861-3020</p>
          <p><strong>이메일:</strong> hanbumo1@seoul.go.kr</p>
        </div>
      </section>

      {/* 부칙 */}
      <section className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          부칙
        </h2>
        <p className="text-gray-700">
          <strong>시행일:</strong> 본 약관은 2025년 9월 29일부터 시행됩니다.
        </p>
      </section>
    </div>
  )
}