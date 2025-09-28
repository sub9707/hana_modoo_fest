"use client"

import { useState, useEffect } from "react"

export default function LanguageSelect() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="relative hidden lg:flex justify-center items-center">
      <select
        className=" text-center
          pl-1 pr-1 py-2.5
          appearance-none rounded-md border border-gray-300
          text-gray-700 text-sm font-medium
          bg-white shadow-sm
          focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-300
          hover:border-gray-400 transition-colors
        "
      >
        <option value="ko">한국어 (ko)</option>
        <option value="en">English (en)</option>
      </select>
    </div>
  )
}
