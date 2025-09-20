interface OverviewCardProps {
    title: string;
    engTitle?: string;
    description: string;
    color?: string; // 추가: 테마 색상
}

function OverviewCard({ title, engTitle, description, color = '#ffffff' }: OverviewCardProps) {
    return (
        <div className="relative group flex">
            <div
                className="shadow-lg py-12 px-8 md:px-15 rounded-bl-[3rem] rounded-tr-[3rem] transition-all duration-300 relative z-10 h-full"
                style={{ backgroundColor: 'white', color: color }}
            >
                <h3 className="text-xl md:text-4xl font-bold mb-2" style={{ color }}>{title}</h3>
                {engTitle && (
                    <h4 className="text-lg md:text-xl mb-8 text-gray-600 font-normal">{engTitle}</h4>
                )}
                <p className="text-base md:text-lg font-medium" style={{ color }}>
                    {description}
                </p>
            </div>

            <div
                className="absolute inset-0 rounded-bl-[3rem] rounded-tr-[3rem] blur-xl opacity-50 scale-95 transition-all duration-500 group-hover:opacity-80 group-hover:scale-105 group-hover:blur-2xl"
                style={{ backgroundColor: color + '40' }}
            ></div>
        </div>
    );
}

export default OverviewCard;
