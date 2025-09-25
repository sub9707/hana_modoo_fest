import { KakaoPostcodeOptions } from "@/types/auth";

export { };

declare global {
  interface Window {
    // 카카오맵 API
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        Map: new (container: HTMLElement, options: any) => any;
        LatLng: new (lat: number, lng: number) => any;
        Marker: new (options: any) => any;
        CustomOverlay: new (options: any) => any;
        ZoomControl: new () => any;
        ControlPosition: {
          TOP: any;
          TOPLEFT: any;
          TOPRIGHT: any;
          LEFT: any;
          RIGHT: any;
          BOTTOMLEFT: any;
          BOTTOM: any;
          BOTTOMRIGHT: any;
        };
        MapTypeId: {
          ROADMAP: any;
          SKYVIEW: any;
          HYBRID: any;
        };
        event: {
          addListener: (target: any, type: string, handler: () => void) => void;
        };
      };
    };
    
    // 카카오 우편번호 API (Daum Postcode)
    daum?: {
      Postcode: new (options: KakaoPostcodeOptions) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_KAKAO_MAP_KEY: string;
      NEXT_PUBLIC_KAKAO_JS_KEY: string;
    }
  }
}