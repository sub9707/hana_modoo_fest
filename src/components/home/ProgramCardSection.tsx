import React from 'react'
import ProgramCard from '@/components/home/ProgramCard'
import cardData from "@/data/ProgramCardData.json"

function ProgramCardSection() {
    return (
        <section className='w-full h-screen flex items-center justify-center gap-16'>
            {
                cardData.map((data, idx) =>
                    <ProgramCard {...data} key={idx} />
                )
            }
        </section>
    )
}

export default ProgramCardSection