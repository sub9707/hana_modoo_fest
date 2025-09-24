interface HeroTitleBadgeProps{
    title:string;
    descMain:string;
    descSub:string;
    className?:string;
}

function HeroTitleBadge({title, descMain, descSub, className}:HeroTitleBadgeProps) {
    return (
        <div className={`bg-white rounded-lg p-2 sm:p-6 h-full ${className}`}>
            <div className="text-center">
                <div className="bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-200 text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-white py-2 sm:py-4 rounded-tl-4xl rounded-br-4xl">
                    {title}
                </div>
                <p className="text-gray-800 font-bold text-lg sm:text-2xl mb-1">
                    {descMain}
                </p>
                <p className="text-gray-600 text-md sm:text-xl">
                    {descSub}
                </p>
            </div>
        </div>
    )
}

export default HeroTitleBadge