import React from 'react'
import ProgramCard from '@/components/home/ProgramCard'
import cardData from "@/data/ProgramCardData.json"

function ProgramCardSection() {
    return (
        <section className='w-full h-screen min-[2560px]:h-[75vh] flex items-center justify-center gap-16'>
            {
                cardData.map((data, idx) =>
                    <ProgramCard {...data} key={idx} />
                )
            }
        </section>
    )
}

export default ProgramCardSection