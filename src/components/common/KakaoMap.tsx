'use client';

import { useEffect, useState } from 'react';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { Map, MapMarker, CustomOverlayMap, ZoomControl } from 'react-kakao-maps-sdk';

interface Coordinates {
  lat: number;
  lng: number;
}

interface KakaoMapProps {
  coordinates: Coordinates;
  venueName: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function KakaoMap({ 
  coordinates, 
  venueName, 
  width = '100%', 
  height = '384px',
  className = ''
}: KakaoMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  
  // 카카오 지도 API 로드
  useKakaoLoader();

  useEffect(() => {
    // 카카오 맵 API가 로드될 때까지 대기
    const checkKakaoMaps = () => {
      if (window.kakao && window.kakao.maps) {
        setIsMapReady(true);
      } else {
        setTimeout(checkKakaoMaps, 100);
      }
    };
    
    checkKakaoMaps();
  }, []);

  // API가 아직 로드되지 않았으면 로딩 표시
  if (!isMapReady) {
    return (
      <div 
        className={`rounded-lg overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg overflow-hidden shadow-lg ${className}`}>
      <Map
        center={{
          lat: coordinates.lat,
          lng: coordinates.lng,
        }}
        style={{
          width: width,
          height: height,
        }}
        level={3}
        zoomable={true}
      >
        {/* 마커 */}
        <MapMarker
          position={{
            lat: coordinates.lat,
            lng: coordinates.lng,
          }}
        />
        
        {/* 커스텀 라벨 오버레이 */}
        <CustomOverlayMap
          position={{
            lat: coordinates.lat,
            lng: coordinates.lng,
          }}
          yAnchor={2.3}
        >
          <div 
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              position: 'relative',
              whiteSpace: 'nowrap',
              border: '2px solid white',
            }}
          >
            🎪 모두하나대축제
            <div 
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid #f7931e',
              }}
            />
          </div>
        </CustomOverlayMap>
        <ZoomControl position={"RIGHT"} />
      </Map>
    </div>
  );
}