/**
 * Spacing Utility Functions
 * Consistent spacing across the application
 */

export const spacing = {
  none: '0',
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem'    // 128px
} as const

export const containerWidths = {
  sm: 'max-w-screen-sm',    // 640px
  md: 'max-w-screen-md',    // 768px
  lg: 'max-w-screen-lg',    // 1024px
  xl: 'max-w-screen-xl',    // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  '3xl': 'max-w-[1600px]',
  '4xl': 'max-w-[1728px]',
  '5xl': 'max-w-[1920px]',
  '6xl': 'max-w-[2048px]',
  '7xl': 'max-w-[2560px]'
} as const

export const padding = {
  section: {
    mobile: 'px-4 py-8',
    tablet: 'md:px-6 md:py-12',
    desktop: 'lg:px-8 lg:py-16'
  },
  card: {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  },
  button: {
    sm: 'px-4 py-2',
    md: 'px-6 py-3',
    lg: 'px-8 py-4'
  }
} as const

/**
 * Get container width class
 * @param size - Container size
 */
export function getContainerWidth(size: keyof typeof containerWidths): string {
  return containerWidths[size]
}

/**
 * Get responsive section padding
 */
export function getSectionPadding(): string {
  return `${padding.section.mobile} ${padding.section.tablet} ${padding.section.desktop}`
}

/**
 * Get card padding
 * @param size - Padding size
 */
export function getCardPadding(size: keyof typeof padding.card): string {
  return padding.card[size]
}

/**
 * Get button padding
 * @param size - Button size
 */
export function getButtonPadding(size: keyof typeof padding.button): string {
  return padding.button[size]
}

// Type exports
export type SpacingSize = keyof typeof spacing
export type ContainerSize = keyof typeof containerWidths
export type CardPaddingSize = keyof typeof padding.card
export type ButtonPaddingSize = keyof typeof padding.button
