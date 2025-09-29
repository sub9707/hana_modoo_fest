'use client'

import Link from "next/link";
import { useGA4Tracking } from '@/hooks/useGA4Tracking';
import { useRouter } from "next/navigation";

interface HeaderCTAButtonProps {
  title: string;
  type?: "primary" | "secondary";
  href: string;
}

function HeaderCTAButton({ title, type = "primary", href }: HeaderCTAButtonProps) {
  // ✅ GA4 트래킹 훅 추가
  const { trackButtonClick } = useGA4Tracking();
  const router = useRouter();

  // ✅ 클릭 트래킹 함수
  const handleClick = (e: React.MouseEvent) => {
    // GA4 트래킹
    const buttonName = title.replace(/\s+/g, '_').toLowerCase();
    trackButtonClick(`${buttonName}_cta`, 'header');
    
    // 네비게이션이 작동하지 않는 경우를 대비한 fallback
    // Link의 기본 동작을 방해하지 않으면서 추가 보장
    setTimeout(() => {
      // Link가 정상 작동하면 이 코드는 실행되지 않음 (페이지 전환됨)
      // 문제가 있을 때만 강제 네비게이션
      console.info('fallback 이동');
      router.push(href);
    }, 200);
  };

  if (type === "primary") {
    const primaryStyle = " inline-block text-sm sm:text-lg px-2 sm:px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200 text-center bg-gradient-to-r from-purple-200 via-blue-200 to-green-100 text-white border border-white hover:brightness-105";
    const primaryTextShadow = { textShadow: "2px 2px 4px rgba(0,0,0,0.7)" };
    
    return (
      <Link 
        href={href} 
        onClick={handleClick} // ✅ 트래킹 추가
        className={primaryStyle} 
        style={primaryTextShadow}
        prefetch={true}
      >
        {title}
      </Link>
    );
  }

  // secondary type with gradient border
  return (
    <div className="inline-block bg-gradient-to-r from-purple-200 via-blue-200 to-green-100 p-[2px] rounded-lg shadow-md">
      <Link 
        href={href} 
        onClick={handleClick} // ✅ 트래킹 추가
        className="block px-6 py-2 rounded-lg font-semibold transition-all duration-200 text-center bg-white text-gray-600 hover:bg-blue-50"
        prefetch={true}
      >
        {title}
      </Link>
    </div>
  );
}

export default HeaderCTAButton;