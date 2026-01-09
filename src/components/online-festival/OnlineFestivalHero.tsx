import PageHero from "../common/PageHero"

interface NewsHeroProps {
  totalNews: number
  todayNews?: number
  totalViews?: number
  latestNews?: string | null
}

export default function OnelineFestivalHero() {
  return (
    <PageHero
      title="함께 만드는 온라인 축제"
      subtitle={
        <>
          집에서도, 어디서든 모두하나대축제에 참여하세요.<br />
          다양한 온라인 이벤트로 축제의 즐거움을 함께 나눠요!
        </>
      }
      variant="orange"
    />
  )
}