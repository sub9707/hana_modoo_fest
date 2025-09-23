'use client'

import { useEffect, useRef } from 'react'
import { KakaoAddress } from '@/types/registration'

interface KakaoAddressSearchProps {
  onAddressSelect: (address: KakaoAddress) => void
  placeholder?: string
  value?: string
  className?: string
  disabled?: boolean
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: any) => {
        open: () => void
      }
    }
  }
}

export default function KakaoAddressSearch({ 
  onAddressSelect, 
  placeholder = "주소를 검색해주세요",
  value = "",
  className = "",
  disabled = false
}: KakaoAddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 카카오 우편번호 서비스 스크립트 로드
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const handleAddressSearch = () => {
    if (disabled) return

    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    new window.daum.Postcode({
      oncomplete: function(data: any) {
        // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
        
        // 각 주소의 노출 규칙에 따라 주소를 조합한다.
        let addr = '' // 주소 변수
        let extraAddr = '' // 참고항목 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
        if (data.userSelectedType === 'R') { // 도로명 주소 선택
          addr = data.roadAddress
        } else { // 지번 주소 선택 - J
          addr = data.jibunAddress
        }

        // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
        if(data.userSelectedType === 'R'){
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
            extraAddr += data.bname
          }
          // 건물명이 있고, 공동주택일 경우 추가한다.
          if(data.buildingName !== '' && data.apartment === 'Y'){
            extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName)
          }
          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if(extraAddr !== ''){
            extraAddr = ' (' + extraAddr + ')'
          }
        }

        const fullAddress = addr + extraAddr

        // 선택된 주소 정보를 부모 컴포넌트로 전달
        onAddressSelect({
          address: fullAddress,
          address_detail: '',
          zip_code: data.zonecode
        })
      },
      theme: {
        bgColor: "#FFFFFF",
        searchBgColor: "#0B65C8",
        contentBgColor: "#FFFFFF",
        pageBgColor: "#FAFAFA",
        textColor: "#333333",
        queryTextColor: "#FFFFFF",
        postcodeTextColor: "#FA4256",
        emphTextColor: "#008BD3",
        outlineColor: "#E0E0E0"
      },
      maxSuggestItems: 5
    }).open()
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        onClick={handleAddressSearch}
        readOnly
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
      <button
        type="button"
        onClick={handleAddressSearch}
        disabled={disabled}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm rounded-md hover:from-orange-500 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        검색
      </button>
    </div>
  )
}