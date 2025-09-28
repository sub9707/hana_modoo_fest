import Link from 'next/link'
import { User } from '@/types/auth'
import { 
  getSignupMethodText, 
  getGenderText, 
  getRoleText
} from '@/lib/utils/user'
import { 
  formatDate
} from '@/lib/utils'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Clock, 
  Settings, 
  Trash2,
  RefreshCw,
  Building,
  Activity
} from 'lucide-react'

interface MyPageContentProps {
  user: User & {
    address?: string
    address_detail?: string
    zip_code?: string
  }
}

export function MyPageContent({ user }: MyPageContentProps) {


  // 가입 방법별 배지 색상
  const getSignupMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'phone':
        return 'bg-blue-100 text-blue-800'
      case 'naver':
        return 'bg-green-100 text-green-800'
      case 'kakao':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // 역할별 배지 색상
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800'
      case 'editor':
        return 'bg-purple-100 text-purple-800'
      case 'user':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6 space-y-8 font-paper">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
        <div className="flex space-x-3">
          <Link
            href="/my-page/delete-account"
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            회원탈퇴
          </Link>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">프로필 정보</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 기본 정보 */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt={`${user.name} 프로필`}
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-gray-600" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
                <p className="text-gray-600">@{user.username}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                    <Shield className="h-3 w-3 mr-1" />
                    {getRoleText(user.role)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSignupMethodBadgeColor(user.signup_method)}`}>
                    {getSignupMethodText(user.signup_method)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">전화번호</p>
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </div>
              </div>

              {user.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">이메일</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">생년월일</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(user.birth_date, 'long')} ({getGenderText(user.gender)})
                  </p>
                </div>
              </div>

              {user.company && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">회사/소속</p>
                    <p className="text-sm text-gray-600">{user.company}</p>
                  </div>
                </div>
              )}

              {(user.address || user.zip_code) && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">주소</p>
                    <p className="text-sm text-gray-600">
                      {user.zip_code && `(${user.zip_code}) `}
                      {user.address}
                      {user.address_detail && ` ${user.address_detail}`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='border border-gray-100 mt-5'/>
          <div className='mt-6 text-sm text-gray-500 text-center'>
            본 페이지는 회원 정보 열람용입니다. <br/>정보 수정을 위해서는 02-861-3020으로 연락바랍니다.
          </div>
      </section>
    </div>
  )
}