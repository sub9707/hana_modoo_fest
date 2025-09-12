interface FestivalPurposeProps {
  purpose: {
    main: string
    description: string
  }
}

export default function FestivalPurpose({ purpose }: FestivalPurposeProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            축제의 목적과 의의
          </h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
              {purpose.main}
            </h3>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              {purpose.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold">온라인에서 시작</h4>
                </div>
                <p className="text-blue-100">
                  9월부터 시작되는 온라인 캠페인으로 시민들의 참여와 관심을 모으고, 
                  가족다양성에 대한 인식을 확산합니다.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold">현장에서 완성</h4>
                </div>
                <p className="text-purple-100">
                  축제 당일 여의도공원에서 시민들이 직접 만나 소통하고 공감하며, 
                  실천적 연대를 경험하는 장을 마련합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}