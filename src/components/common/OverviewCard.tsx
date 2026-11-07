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
    color = '#111827',
    needKeyword = false
}: OverviewCardProps) {

    // needKeyword가 true일 때 각 줄의 마지막 단어를 굵게 표시
    const renderDescription = () => {
        if (!needKeyword) {
            return (
                <p className="text-base md:text-lg text-gray-700 whitespace-pre-line leading-relaxed">
                    {description}
                </p>
            );
        }

        const lines = description.split('\n').filter(line => line.trim());

        return (
            <ul className="space-y-2.5 text-base md:text-lg text-gray-700">
                {lines.map((line, index) => {
                    const words = line.trim().split(' ');
                    const lastWord = words[words.length - 1];
                    const restOfLine = words.slice(0, -1).join(' ');

                    return (
                        <li key={index}>
                            {restOfLine}{restOfLine ? ' ' : ''}
                            <strong className="font-bold" style={{ color }}>{lastWord}</strong>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <article className="flex h-full w-full flex-col bg-white rounded-lg border border-gray-200 px-8 py-10 transition-colors duration-300 hover:border-gray-300">
            <header className="mb-8 pb-6 border-b border-gray-100">
                {engTitle && (
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color }}>
                        {engTitle}
                    </p>
                )}
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {title}
                </h3>
            </header>

            <div className="flex-grow">
                {renderDescription()}
            </div>
        </article>
    );
}

export default OverviewCard;
