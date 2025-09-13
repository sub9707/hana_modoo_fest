"use client"

interface Contact {
  address: string
  phone: string
  fax: string
  email: string
  website: string
  hours: string
}

interface ContactSectionProps {
  contact: Contact
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const contactItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: '주소',
      value: contact.address,
      type: 'address'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: '전화',
      value: contact.phone,
      type: 'tel'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
        </svg>
      ),
      label: '팩스',
      value: contact.fax,
      type: 'fax'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: '이메일',
      value: contact.email,
      type: 'email'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
        </svg>
      ),
      label: '홈페이지',
      value: contact.website,
      type: 'website'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: '운영시간',
      value: contact.hours,
      type: 'hours'
    }
  ]

  const handleClick = (item: typeof contactItems[0]) => {
    switch (item.type) {
      case 'tel':
        window.open(`tel:${item.value}`)
        break
      case 'email':
        window.open(`mailto:${item.value}`)
        break
      case 'website':
        window.open(item.value, '_blank', 'noopener,noreferrer')
        break
      case 'address':
        window.open(`https://maps.google.com/?q=${encodeURIComponent(item.value)}`, '_blank', 'noopener,noreferrer')
        break
      default:
        break
    }
  }

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
              연락처 정보
            </span>
          </h2>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto">
            언제든지 문의하세요. 친절하고 전문적인 상담을 제공해드립니다.
          </p>
        </div>

        {/* 연락처 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {contactItems.map((item, index) => {
            const isClickable = ['tel', 'email', 'website', 'address'].includes(item.type)
            
            return (
              <div
                key={index}
                onClick={() => isClickable && handleClick(item)}
                className={`group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 ${
                  isClickable ? 'hover:bg-white/20 hover:scale-105 cursor-pointer' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-blue-200 mb-2">
                      {item.label}
                    </h3>
                    <p className="text-white break-words">
                      {item.value}
                    </p>
                    {isClickable && (
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="text-sm text-blue-300">
                          {item.type === 'website' ? '웹사이트 방문' :
                           item.type === 'email' ? '이메일 보내기' :
                           item.type === 'tel' ? '전화걸기' :
                           item.type === 'address' ? '지도에서 보기' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                  {isClickable && (
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* 하단 CTA */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              더 자세한 정보가 필요하신가요?
            </h3>
            <p className="text-lg text-blue-100 opacity-90 mb-8 max-w-2xl mx-auto">
              서울특별시한부모가족지원센터 공식 홈페이지에서 더 많은 정보와 서비스를 확인하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
                공식 홈페이지 방문
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                이메일 문의
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}