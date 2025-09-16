interface HeroTitleBadgeProps{
    title:string;
    descMain:string;
    descSub:string;
}

function HeroTitleBadge({title, descMain, descSub}:HeroTitleBadgeProps) {
    return (
        <div className="bg-white rounded-lg p-6 h-full">
            <div className="text-center">
                <div className="bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-200 text-3xl font-bold mb-6 text-white py-4 rounded-tl-4xl rounded-br-4xl">
                    {title}
                </div>
                <p className="text-gray-800 font-bold text-2xl mb-1">
                    {descMain}
                </p>
                <p className="text-gray-600 text-xl">
                    {descSub}
                </p>
            </div>
        </div>
    )
}

export default HeroTitleBadge