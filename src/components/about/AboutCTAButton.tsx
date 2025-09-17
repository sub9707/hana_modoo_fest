import Link from "next/link";

type AboutCTAButtonProps = {
    text: string;
    href: string;
    reversed?:boolean
};

export default function AboutCTAButton({
    text,
    href,
    reversed=false
}: AboutCTAButtonProps) {
    return (
        <Link
            href={href}
            className={`w-70 h-18 ${reversed ? "bg-gradient-to-l": "bg-gradient-to-r"}  from-pink-300 to-orange-300 
            flex justify-center items-center
             text-white font-extrabold text-center text-shadow-md py-3 px-6  text-3xl
             rounded-tl-4xl rounded-br-4xl rounded-tr-md rounded-bl-md
             shadow-md transition-transform hover:scale-105`}
        >
            {text}
        </Link>
    );
}
