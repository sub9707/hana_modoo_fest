declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

export const analytics = {
  pageView: (page: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_TRACKING_ID', {
        page_path: page,
      })
    }
  },

  ctaClick: (type: 'register' | 'participate' | 'location', location: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: type,
        custom_parameter: location
      })
    }
  },

  formSubmit: (type: 'registration' | 'volunteer' | 'organization') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'form_submit', {
        event_category: 'conversion',
        event_label: type
      })
    }
  },

  campaignJoin: (type: 'hashtag' | 'photo' | 'quiz') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'campaign_join', {
        event_category: 'engagement',
        event_label: type
      })
    }
  },

  programFavorite: (programId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'program_favorite', {
        event_category: 'engagement',
        event_label: programId
      })
    }
  },

  mapOpen: (transportType: 'subway' | 'bus' | 'car') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'map_open', {
        event_category: 'navigation',
        event_label: transportType
      })
    }
  }
}