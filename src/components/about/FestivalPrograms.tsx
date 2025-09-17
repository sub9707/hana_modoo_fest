import ProgramsGrid from "./ProgramsGrid"
import SectionHeader from "./SectionHeader"

function FestivalPrograms() {
    return (
        <div className="py-16 container mx-auto px-4 mb-12 flex flex-col items-center min-h-screen">
            <SectionHeader title="주요 프로그램" mb={6} />
            <p className="text-xl text-gray-600 mb-12">
                다양한 프로그램으로 구성된 풍성한 축제를 경험하세요
            </p>
            <ProgramsGrid/>
        </div>
    )
}

export default FestivalPrograms