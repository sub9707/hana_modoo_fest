import Link from "next/link";

type HeroCTAButtonProps = {
    text: string;
    href: string;
};

export default function HeroCTAButton({
    text,
    href,
}: HeroCTAButtonProps) {
    return (
        <Link
            href={href}
            className={`bg-gradient-to-r from-pink-300 via-purple-300 to-sky-300 
             text-white font-extrabold text-center text-shadow-md py-3 px-6  text-2xl
             rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md
             shadow-md transition-transform hover:scale-105`}
        >
            {text}
        </Link>
    );
}
