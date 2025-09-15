export const scrollUtils = {
  // 부드러운 스크롤로 특정 위치로 이동
  smoothScrollTo: (target: number, offset: number = 0) => {
    window.scrollTo({
      top: target - offset,
      behavior: 'smooth'
    })
  },

  // 요소로 부드럽게 스크롤
  smoothScrollToElement: (element: HTMLElement, offset: number = 20) => {
    const elementTop = element.offsetTop
    scrollUtils.smoothScrollTo(elementTop, offset)
  },

  // 현재 스크롤 위치 가져오기
  getCurrentScrollPosition: (): number => {
    return window.pageYOffset || document.documentElement.scrollTop
  },

  // 페이지 최상단으로 스크롤
  scrollToTop: () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },

  // 스크롤 위치 저장/복원을 위한 세션 스토리지 활용
  saveScrollPosition: (key: string) => {
    const position = scrollUtils.getCurrentScrollPosition()
    sessionStorage.setItem(`scroll_${key}`, position.toString())
  },

  restoreScrollPosition: (key: string) => {
    const saved = sessionStorage.getItem(`scroll_${key}`)
    if (saved) {
      const position = parseInt(saved, 10)
      scrollUtils.smoothScrollTo(position)
      sessionStorage.removeItem(`scroll_${key}`)
    }
  }
}