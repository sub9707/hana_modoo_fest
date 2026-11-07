import { CoreValue } from "@/types/festival";

interface CoreValueCardProps {
    coreValue: CoreValue;
    index: number;
}

export default function CoreValueCard({ coreValue, index }: CoreValueCardProps) {
  return (
    <article className="h-full bg-white rounded-lg border border-gray-200 p-8 md:p-10 transition-colors duration-300 hover:border-orange-300">
      <p className="text-sm font-semibold text-orange-600 tabular-nums mb-4">
        {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
        {coreValue.title}
      </h3>
      <p className="text-sm tracking-wide text-gray-500 mb-6">
        {coreValue.subtitle}
      </p>
      <p className="text-base md:text-lg leading-relaxed text-gray-600 whitespace-pre-line">
        {coreValue.description}
      </p>
    </article>
  );
}
