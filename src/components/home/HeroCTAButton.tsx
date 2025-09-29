'use client'

import Link from "next/link";
import { useGA4Tracking } from '@/hooks/useGA4Tracking';

type HeroCTAButtonProps = {
    text: string;
    href: string;
};

export default function HeroCTAButton({
    text,
    href,
}: HeroCTAButtonProps) {
    const { trackButtonClick } = useGA4Tracking();

    const handleClick = () => {
        const buttonName = text.replace(/\s+/g, '_').toLowerCase();
        trackButtonClick(`${buttonName}_hero_cta`, 'hero_section');
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className={`bg-gradient-to-r from-pink-300 via-purple-300 to-sky-300 
             text-white font-extrabold text-center text-shadow-md py-3 px-6  text-2xl
             rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md
             shadow-md transition-transform hover:scale-105 w-full`}
        >
            {text}
        </Link>
    );
}