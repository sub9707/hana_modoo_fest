"use client"
import Image from "next/image";
import { useState } from "react";
import campaigns from "@/data/Campaigns.json";
import Link from "next/link";

function CampaignSection() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <section className="pt-10 py-40 px-4">
            <div className="mx-auto w-[90vw] sm:w-[85vw] md:w-[75vw] lg:w-[65vw] xl:w-[70vw] 2xl:w-[75vw] max-w-screen-2xl">
                <div className="flex flex-col sm:flex-row gap-4">
                    {campaigns.map((item, index) => {
                        const flexGrow = hoveredIndex === index ? 5 : hoveredIndex === null ? 1 : 1.5;

                        return (
                            <Link
                                href={item.href}
                                key={item.id}
                                className="group relative h-64 sm:h-90 bg-gray-200 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer sm:[flex:var(--flex-grow)]"
                                style={{ '--flex-grow': flexGrow } as React.CSSProperties}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <Image
                                    src={item.img}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/50 sm:group-hover:bg-black/10 transition-colors" />

                                <div className="block sm:hidden absolute top-3 left-3 text-white text-lg font-semibold">
                                    {item.title}
                                </div>

                                <div className="hidden sm:block absolute bottom-3 left-3 right-3 text-white text-lg font-semibold transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-5">
                                    {item.title}
                                </div>

                                <div className="hidden sm:block absolute top-3 left-3 text-white text-lg font-semibold opacity-0 -translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                                    {item.title}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white text-sm px-4 py-3 sm:opacity-0 sm:translate-y-full sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-500">
                                    {item.desc}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default CampaignSection;
