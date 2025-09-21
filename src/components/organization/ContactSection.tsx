// components/organization/ContactSection.tsx
'use client';

import ContactItem from './ContactItem';

interface ContactInfo {
  address: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  hours: string;
}

interface ContactSectionProps {
  contact: ContactInfo;
}

export default function ContactSection({ contact }: ContactSectionProps) {
  const contactItems = [
    {
      label: '주소',
      value: contact.address,
      type: 'address' as const
    },
    {
      label: '전화번호',
      value: contact.phone,
      type: 'phone' as const,
      action: () => window.open(`tel:${contact.phone}`)
    },
    {
      label: '이메일',
      value: contact.email,
      type: 'email' as const,
      action: () => window.open(`mailto:${contact.email}`)
    },
    {
      label: '웹사이트',
      value: contact.website,
      type: 'website' as const,
      action: () => window.open(contact.website, '_blank')
    },
    {
      label: '팩스',
      value: contact.fax,
      type: 'fax' as const
    },
    {
      label: '운영시간',
      value: contact.hours,
      type: 'hours' as const
    }
  ];

  return (
    <section className="py-20 mb-20">
      <div className="mx-auto px-4 container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">연락처</span> 안내
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            언제든지 편안하게 문의해 주세요. 한부모가족을 위해 항상 열려있습니다
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 연락처 리스트 */}
          <div className="space-y-4 mb-12">
            {contactItems.map((item, index) => (
              <ContactItem 
                key={item.label}
                item={item}
                index={index}
              />
            ))}
          </div>


          {/* 하단 안내 */}
          <div className="mt-12 text-center">
            <div className="relative overflow-hidden bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-300 via-purple-300 to-indigo-600"></div>
              <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                한부모가족을 위한 따뜻한 지원
              </h4>
              <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
                서울특별시한부모가족지원센터는<br/> 한부모가족의 자립과 복지 향상을 위해
                다양한 서비스와 프로그램을 제공하고 있습니다. <br/>
                궁금한 사항이 있으시면 언제든지 연락해 주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}