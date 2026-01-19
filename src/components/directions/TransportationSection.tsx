'use client';

import { useState } from 'react';
import TransportationCard from './TransportationCard';
import { TRANSPORTATION_DATA, TRANSPORTATION_GUIDE } from '@/constants';

export default function TransportationSection() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 섹션 헤더 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="header-orange">교통편 안내</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              대중교통과 자가용 이용 방법을 안내드립니다
            </p>
          </div>

          {/* 교통편 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRANSPORTATION_DATA.map((transport, index) => (
              <TransportationCard
                key={transport.type}
                data={transport}
                index={index}
                isSelected={selectedType === transport.type}
                onSelect={setSelectedType}
              />
            ))}
          </div>

          {/* 추가 안내사항 */}
          <div className="mt-16 bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold header-orange">
                교통편 이용 안내
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">{TRANSPORTATION_GUIDE.subway.title}</h4>
                {TRANSPORTATION_GUIDE.subway.items.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">{TRANSPORTATION_GUIDE.bus.title}</h4>
                {TRANSPORTATION_GUIDE.bus.items.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
