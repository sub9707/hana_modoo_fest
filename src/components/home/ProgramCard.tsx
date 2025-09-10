interface ProgramCardProps {
    title: string
    description: string
    features: string[]
    buttonText?: string
    gradient?: string
    onButtonClick?: () => void
}

export default function ProgramCard({
    title,
    description,
    features,
    buttonText = "자세히 보기",
    gradient = "from-purple-400 via-blue-400 to-cyan-400",
    onButtonClick
}: ProgramCardProps) {
    return (
        <div className="group relative">
            <div className={`absolute h-170 -inset-1 bg-gradient-to-r ${gradient} rounded-3xl blur-lg opacity-20 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 group-hover:duration-300`}></div>

            {/* 메인 카드 */}
            <div className="w-85 relative flex flex-col justify-between h-165 bg-white/90 backdrop-blur-sm text-center rounded-2xl py-25 px-10 border border-white/20 transition-all duration-300 group-hover:scale-105 rounded-tl-[60px] rounded-tr-[8px] rounded-br-[60px] rounded-bl-[8px]">
                {/* 상단 타이틀 */}
                <h3 className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-4`}>
                    {title}
                </h3>
                <p className="text-gray-800 font-bold text-lg leading-relaxed">
                    {description}
                </p>

                {/* 특징 리스트 */}
                <div className="space-y-4 mb-8 flex flex-col items-center">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center gap-1 text-md text-gray-600">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradient} mr-3 flex-shrink-0`}></div>
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                {/* 하단 버튼 */}
                <div className="text-center">
                    <button
                        onClick={onButtonClick}
                        className={`bg-gradient-to-r ${gradient} text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}