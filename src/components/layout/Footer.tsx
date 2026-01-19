import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Youtube, Globe } from 'lucide-react'
import Image from 'next/image'
import {
  SITE,
  FESTIVAL,
  CONTACT,
  ROUTES,
  FOOTER_QUICK_LINKS,
  FOOTER_LEGAL_LINKS,
} from '@/constants'

export default function Footer() {
  return (
    <footer className="font-paper bg-gradient-to-b from-purple-50 to-purple-100 text-gray-700 pb-20 lg:pb-0 z-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* 로고 및 기본 정보 */}
            <div className="lg:col-span-1">
              <div className="mb-4 flex items-center justify-center sm:justify-start">
                <div className="relative w-80 h-15 flex items-center justify-center">
                  <Image src={'/icons/logo.png'} fill alt={`${SITE.name} 로고`} />
                </div>
              </div>

              <p className="text-center text-gray-600 mb-4 text-sm leading-relaxed">
                {SITE.description}
              </p>

              {/* 축제 정보 */}
              <div className="bg-white rounded-lg p-3 border border-purple-200">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">{FESTIVAL.dateShort} {FESTIVAL.time}</p>
                    <p className="text-gray-600">{FESTIVAL.location.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 연락처 & 바로가기 통합 */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 연락처 */}
                <div>
                  <h4 className="text-base font-semibold mb-3 text-gray-800">연락처</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <a href={`tel:${CONTACT.phone}`} className="text-sm hover:text-purple-600 transition-colors">
                        {CONTACT.phone}
                      </a>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <a
                        href={`mailto:${CONTACT.email}`}
                        className="text-sm hover:text-purple-600 transition-colors"
                      >
                        {CONTACT.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 바로가기 링크 */}
                <div>
                  <h4 className="text-base font-semibold mb-3 text-gray-800">바로가기</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {FOOTER_QUICK_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-sm hover:text-purple-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SNS & 하단 정보 통합 */}
        <div className="border-t border-purple-200 py-6">
          <div className="flex flex-col space-y-4">
            {/* SNS 링크 */}
            <div className="flex justify-center space-x-4">
              <a
                href={CONTACT.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label={CONTACT.social.instagram.label}
              >
                <Instagram className="w-5 h-5 text-purple-600" />
              </a>

              <a
                href={CONTACT.social.youtube.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label={CONTACT.social.youtube.label}
              >
                <Youtube className="w-5 h-5 text-purple-600" />
              </a>

              <a
                href={CONTACT.social.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white rounded-lg shadow-sm border border-purple-200 hover:border-purple-300 transition-colors"
                aria-label={CONTACT.social.website.label}
              >
                <Globe className="w-5 h-5 text-purple-600" />
              </a>
            </div>

            {/* 주최/주관 정보 */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-600 mb-2">
                <span>주최: {SITE.organizer}</span>
                <span className="hidden sm:block">|</span>
                <span>주관: {SITE.host}</span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-gray-500 mb-3">
                {FOOTER_LEGAL_LINKS.map((link, index) => (
                  <span key={link.href} className="contents">
                    <Link
                      href={link.href}
                      className="flex items-center text-gray-700 hover:text-purple-600 transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                    {index < FOOTER_LEGAL_LINKS.length - 1 && (
                      <span className="hidden sm:block text-gray-400">|</span>
                    )}
                  </span>
                ))}
              </div>

              <p className="text-xs text-gray-500">
                {SITE.copyright} | 개발 및 운영: {SITE.developer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
