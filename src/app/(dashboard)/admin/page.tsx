import Link from 'next/link'
import { menuItems } from '@/config/menuConfig'

export default function AdminPage() {
  const shortcuts = menuItems.flatMap((item) =>
    item.submenu
      ? item.submenu.map((sub) => ({ id: sub.id, title: sub.title, group: item.title }))
      : [{ id: item.id, title: item.title, group: '' }]
  ).filter((item) => item.id !== 'admin')

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="mb-10 border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold text-orange-600 mb-1">모두하나대축제</p>
        <h1 className="text-2xl font-bold text-gray-900">관리자 홈</h1>
        <p className="mt-2 text-sm text-gray-600">
          왼쪽 메뉴 또는 아래 바로가기에서 관리할 항목을 선택하세요.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-sm font-bold text-gray-900 mb-3">바로가기</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {shortcuts.map((item) => (
            <li key={item.id}>
              <Link
                href={`/admin/${item.id}`}
                className="block rounded-lg border border-gray-200 bg-white px-5 py-4 transition-colors hover:border-orange-300 group"
              >
                {item.group && <span className="block text-xs text-gray-500 mb-0.5">{item.group}</span>}
                <span className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600">
        <h2 className="font-bold text-gray-900 mb-2">문의</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
          <dt className="text-gray-500">(주)하우두유두</dt>
          <dd className="tabular-nums">02-322-9775</dd>
          <dt className="text-gray-500">개발 담당</dt>
          <dd className="tabular-nums">010-9404-3714</dd>
        </dl>
      </section>
    </div>
  )
}
