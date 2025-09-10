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
        <div className="group relative w-full">
            <div className={`absolute h-full -inset-0.5 sm:-inset-1 bg-gradient-to-r ${gradient} rounded-2xl sm:rounded-3xl blur-sm sm:blur-lg opacity-20 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700 group-hover:duration-300`}></div>

            {/* 메인 카드 */}
            <div className="relative flex flex-col justify-between h-[360px] sm:h-165 w-full sm:w-85 bg-white/90 backdrop-blur-sm text-center rounded-xl sm:rounded-2xl py-6 sm:py-25 px-4 sm:px-10 border border-white/20 transition-all duration-300 group-hover:scale-105 rounded-tl-[25px] sm:rounded-tl-[60px] rounded-tr-[8px] rounded-br-[25px] sm:rounded-br-[60px] rounded-bl-[8px]">
                {/* 상단 타이틀 */}
                <h3 className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight`}>
                    {title}
                </h3>
                <p className="text-gray-800 font-bold text-sm sm:text-lg leading-relaxed mb-5 sm:mb-4">
                    {description}
                </p>

                {/* 특징 리스트 */}
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex flex-col items-center flex-1">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center gap-1 text-sm sm:text-md text-gray-600">
                            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r ${gradient} flex-shrink-0`}></div>
                            <span className="text-center leading-tight">{feature}</span>
                        </div>
                    ))}
                </div>

                {/* 하단 버튼 */}
                <div className="text-center">
                    <button
                        onClick={onButtonClick}
                        className={`bg-gradient-to-r ${gradient} text-white font-semibold py-2 sm:py-3 px-5 sm:px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    )
}