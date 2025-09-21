'use client';

import { useState } from 'react';
import TimelineItem from './TimelineItem';
import StatsOverview from './StatsOverview';

interface Achievement {
  year: string;
  content: string;
}

interface HistoryAndAchievementsSectionProps {
  achievements: Achievement[];
}

export default function HistoryAndAchievementsSection({ 
  achievements 
}: HistoryAndAchievementsSectionProps) {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  return (
    <section className="py-20 mb-20">
      <div className="mx-auto px-4 container">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            성과 및 <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">연혁</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            한부모가족지원센터의 지속적인 성장과 발전의 발자취를 확인해보세요
          </p>
        </div>

        {/* 통계 개요 섹션 */}
        <div className="mb-20">
          <StatsOverview />
        </div>

        {/* 연혁 타임라인 */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            주요 연혁
          </h3>
          
          <div className="relative">
            {/* 타임라인 중앙선 - 데스크톱 */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-cyan-300 via-purple-300 to-indigo-600"></div>
            
            {/* 타임라인 왼쪽선 - 모바일 */}
            <div className="md:hidden absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-300 via-purple-300 to-indigo-600"></div>

            <div className="space-y-8">
              {achievements.map((achievement, index) => (
                <TimelineItem
                  key={`${achievement.year}-${index}`}
                  achievement={achievement}
                  index={index}
                  isSelected={selectedYear === achievement.year}
                  onSelect={setSelectedYear}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}