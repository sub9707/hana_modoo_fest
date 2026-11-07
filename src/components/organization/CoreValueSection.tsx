import { CoreValue } from '@/types/festival';
import CoreValueCard from './CoreValueCard';

export default function VisionSection() {
  // 핵심가치 데이터
  const coreValues = [
    {
      title: '돌봄',
      subtitle: 'Care',
      description: '한부모가족의 어려움을 이해하고\n 따뜻한 돌봄을 제공합니다',
    },
    {
      title: '소통',
      subtitle: 'Communication', 
      description: '가족 간, 지역사회와의 원활한 소통을 지원합니다',
    },
    {
      title: '혁신',
      subtitle: 'Innovation',
      description: '변화하는 사회에 맞는 새로운 서비스를 개발합니다',
    }
  ];

  return (
    <div className="py-20 mb-20">
      <div className="mx-auto px-4 container">
        {/* 핵심 가치 영역 */}
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-5xl font-bold text-gray-900">
               한부모가족지원센터의 <span className="header-orange">핵심 가치</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {coreValues.map((value, index) => (
              <CoreValueCard key={value.title} coreValue={value} index={index} />
            ))}
          </div>
      </div>
    </div>
  )
}