"use client"
import { useState, useEffect } from "react";

export default function LanguageSelect() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <select className="hidden lg:flex">
      <option>한국어</option>
      <option>중국어</option>
      <option>일본어</option>
    </select>
  );
}
