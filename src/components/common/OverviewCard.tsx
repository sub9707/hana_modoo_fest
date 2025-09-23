interface OverviewCardProps {
    title: string;
    engTitle?: string;
    description: string;
    color?: string;
    needKeyword?: boolean;
}

function OverviewCard({ 
    title, 
    engTitle, 
    description, 
    color = '#ffffff', 
    needKeyword = false 
}: OverviewCardProps) {
    
    // 제목별 아이콘 매핑
    const getIcon = (title: string) => {
        switch(title) {
            case '비전': return '🎯'
            case '사명': return '🤝'
            case '가치': return '💎'
            default: return '✨'
        }
    }

    // 제목별 패턴 요소
    const getPattern = (title: string) => {
        switch(title) {
            case '비전': return (
                <div className="absolute top-4 right-4 opacity-10">
                    <div className="w-16 h-16 border-4 border-current rounded-full"></div>
                    <div className="absolute top-2 left-2 w-12 h-12 border-2 border-current rounded-full"></div>
                    <div className="absolute top-6 left-6 w-4 h-4 bg-current rounded-full"></div>
                </div>
            )
            case '사명': return (
                <div className="absolute top-4 right-4 opacity-10">
                    <div className="flex space-x-1">
                        <div className="w-3 h-12 bg-current rounded-full"></div>
                        <div className="w-3 h-8 bg-current rounded-full mt-4"></div>
                        <div className="w-3 h-10 bg-current rounded-full mt-2"></div>
                    </div>
                </div>
            )
            case '가치': return (
                <div className="absolute top-4 right-4 opacity-10">
                    <div className="w-12 h-12 border-4 border-current transform rotate-45"></div>
                    <div className="absolute top-2 left-2 w-8 h-8 border-2 border-current transform rotate-45"></div>
                </div>
            )
            default: return null
        }
    }

    // needKeyword가 true일 때 각 줄의 마지막 단어 전체를 강조하는 함수
    const renderDescription = () => {
        if (!needKeyword) {
            return (
                <p className="text-base md:text-lg font-medium whitespace-pre-line text-center" style={{ color }}>
                    {description}
                </p>
            );
        }

        // 줄바꿈으로 나누기
        const lines = description.split('\n');
        
        return (
            <div className="text-base md:text-lg font-medium text-center" style={{ color }}>
                {lines.map((line, index) => {
                    if (!line.trim()) return <br key={index} />;
                    
                    const trimmedLine = line.trim();
                    const words = trimmedLine.split(' ');
                    const lastWord = words[words.length - 1];
                    const restOfLine = words.slice(0, -1).join(' ');
                    
                    return (
                        <div key={index} className="block mb-2">
                            {restOfLine}{restOfLine ? ' ' : ''}
                            <span 
                                className="font-bold text-lg md:text-xl inline-block transform group-hover:scale-105 transition-transform duration-300" 
                                style={{ color }}
                            >
                                {lastWord}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="relative group flex h-full min-w-sm">
            <div
                className="relative overflow-hidden shadow-lg hover:shadow-2xl py-12 px-8 md:px-12 rounded-bl-[3rem] rounded-tr-[3rem] transition-all duration-500 z-10 flex flex-col justify-between w-full transform hover:-translate-y-2 hover:scale-[1.02]"
                style={{ backgroundColor: 'white', color: color }}
            >
                {/* 배경 장식 패턴 */}
                <div className="absolute inset-0 opacity-5" style={{ color }}>
                    {getPattern(title)}
                </div>

                {/* 상단 글로우 효과 */}
                <div 
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundColor: color }}
                ></div>

                {/* 헤더 영역 */}
                <div className="relative z-10 text-center">
                    {/* 아이콘 */}
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-50 transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                        <span className="text-2xl">{getIcon(title)}</span>
                    </div>
                    
                    {/* 제목 */}
                    <h3 className="text-xl md:text-4xl font-bold mb-2 transform group-hover:scale-105 transition-transform duration-300" style={{ color }}>
                        {title}
                    </h3>
                    
                    {/* 영문 제목 */}
                    {engTitle && (
                        <div className="relative">
                            <h4 className="text-lg md:text-xl mb-8 text-gray-600 font-normal tracking-wider">
                                {engTitle}
                            </h4>
                        </div>
                    )}
                </div>
                
                {/* 설명 영역 - 가운데 정렬 */}
                <div className="flex-grow flex items-center justify-center relative z-10 py-4">
                    <div className="max-w-xs md:max-w-sm">
                        {renderDescription()}
                    </div>
                </div>

                {/* 하단 장식 */}
                <div className="relative z-10 text-center">
                    <div className="inline-flex space-x-1">
                        <div 
                            className="w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                            style={{ backgroundColor: color }}
                        ></div>
                        <div 
                            className="w-3 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 delay-75"
                            style={{ backgroundColor: color }}
                        ></div>
                        <div 
                            className="w-2 h-2 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300 delay-150"
                            style={{ backgroundColor: color }}
                        ></div>
                    </div>
                </div>

                {/* 코너 장식 */}
                <div className="absolute bottom-4 left-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div 
                        className="w-8 h-8 border-l-2 border-b-2 rounded-bl-lg"
                        style={{ borderColor: color }}
                    ></div>
                </div>
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <div 
                        className="w-8 h-8 border-r-2 border-t-2 rounded-tr-lg"
                        style={{ borderColor: color }}
                    ></div>
                </div>
            </div>

            {/* 배경 그림자 */}
            <div
                className="absolute inset-0 rounded-bl-[3rem] rounded-tr-[3rem] blur-xl opacity-50 scale-95 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105 group-hover:blur-2xl"
                style={{ backgroundColor: color + '40' }}
            ></div>

            {/* 추가 글로우 효과 */}
            <div
                className="absolute inset-0 rounded-bl-[3rem] rounded-tr-[3rem] opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl"
                style={{ backgroundColor: color }}
            ></div>
        </div>
    );
}

export default OverviewCard;