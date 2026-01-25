export default function UploadGuide() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <h2 className="text-2xl font-bold mb-2">사진 업로드 가이드</h2>
        <p className="opacity-90">축제의 소중한 순간을 함께 공유해주세요</p>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* 업로드 방법 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">업로드 방법</h3>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold">온라인 축제 페이지 방문</div>
                  <div className="text-gray-600 text-sm">홈페이지 - 온라인 축제 - 포토 업로드</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold">SNS 해시태그 업로드</div>
                  <div className="text-gray-600 text-sm">#모두하나대축제2025 #가족다양성</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold">이메일 전송</div>
                  <div className="text-gray-600 text-sm">photo@moduhana2025.seoul.kr</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 업로드 가이드라인 */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800">업로드 가이드라인</h3>
            
            <div className="space-y-3 text-sm">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="font-semibold text-green-800 mb-1">  권장사항</div>
                <ul className="space-y-1 text-green-700">
                  <li>• 고화질 이미지 (최소 1920x1080)</li>
                  <li>• JPG, PNG 형식</li>
                  <li>• 밝고 선명한 사진</li>
                  <li>• 축제 분위기가 잘 담긴 사진</li>
                </ul>
              </div>
              
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="font-semibold text-red-800 mb-1">❌ 주의사항</div>
                <ul className="space-y-1 text-red-700">
                  <li>• 개인정보가 노출된 사진</li>
                  <li>• 블러 처리되지 않은 아동 사진</li>
                  <li>• 상업적 광고가 포함된 사진</li>
                  <li>• 저작권 문제가 있는 사진</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* 저작권 및 초상권 안내 */}
        <div className="mt-8 p-6 bg-yellow-50 border-l-4 border-yellow-400">
          <h4 className="font-bold text-yellow-800 mb-3">📋 저작권 및 초상권 안내</h4>
          <div className="text-yellow-700 space-y-2 text-sm">
            <p>• 업로드된 사진은 모두하나대축제 홍보 및 아카이브 목적으로 활용됩니다.</p>
            <p>• 사진 속 인물의 초상권 동의를 받고 업로드해주세요.</p>
            <p>• 아동이 포함된 사진은 얼굴 모자이크 처리를 권장합니다.</p>
            <p>• 업로드 시 저작권 및 초상권 사용에 동의한 것으로 간주됩니다.</p>
            <p>• 문제가 있는 사진은 관리자 검토 후 삭제될 수 있습니다.</p>
          </div>
        </div>
        
        {/* 업로드 버튼 */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300">
            지금 사진 업로드하기
          </button>
        </div>
      </div>
    </div>
  )
}