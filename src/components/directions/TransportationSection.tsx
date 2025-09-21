'use client';

import { useState } from 'react';
import TransportationCard from './TransportationCard';

const transportationData = [
  {
    type: '지하철',
    routes: [
      {
        line: '5호선',
        station: '여의도역',
        exit: '3번 출구',
        walkTime: '도보 5분',
        color: 'purple'
      },
      {
        line: '9호선',
        station: '여의도역',
        exit: '3번 출구', 
        walkTime: '도보 5분',
        color: 'amber'
      }
    ]
  },
  {
    type: '버스',
    routes: [
      {
        line: '간선버스',
        station: '162, 261, 362, 461',
        exit: '여의도공원 정류장',
        walkTime: '도보 2분',
        color: 'blue'
      },
      {
        line: '지선버스',
        station: '5623, 5633',
        exit: '여의도공원 정류장',
        walkTime: '도보 2분',
        color: 'green'
      }
    ]
  },
  {
    type: '자가용',
    routes: [
      {
        line: '강변북로',
        station: '여의도 IC 이용',
        exit: '여의도공원 방향',
        walkTime: '주차 후 도보 3분',
        color: 'gray'
      },
      {
        line: '올림픽대로',
        station: '여의도 나들목',
        exit: '여의도공원 방향',
        walkTime: '주차 후 도보 3분',
        color: 'gray'
      }
    ]
  }
];

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
            {transportationData.map((transport, index) => (
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
                <h4 className="font-semibold text-gray-800">🚇 지하철 이용시</h4>
                <p>• 5호선, 9호선 여의도역 3번 출구 이용</p>
                <p>• 출구에서 여의도공원 방향으로 직진</p>
                <p>• 문화의마당은 공원 중앙에 위치</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">🚌 버스 이용시</h4>
                <p>• 여의도공원 정류장 하차</p>
                <p>• 공원 입구에서 문화의마당까지 도보 2분</p>
                <p>• 행사 당일 임시 정류장 운영 예정</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}