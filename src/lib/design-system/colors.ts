/**
 * Color Utility Functions
 * Provides type-safe access to design system colors
 */

export const brandColors = {
  blue: {
    DEFAULT: 'blue-600',
    light: 'blue-500',
    dark: 'blue-700'
  },
  purple: {
    DEFAULT: 'purple-600',
    light: 'purple-500',
    dark: 'purple-700'
  },
  orange: {
    DEFAULT: 'orange-600',
    light: 'orange-400',
    dark: 'orange-700'
  },
  pink: {
    DEFAULT: 'pink-600',
    light: 'pink-400',
    dark: 'pink-700'
  },
  green: {
    DEFAULT: 'green-600',
    light: 'green-500',
    dark: 'green-700'
  }
} as const

export const semanticColors = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-600'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-600'
  }
} as const

export const gradients = {
  'orange-pink': 'bg-gradient-to-r from-orange-400 to-pink-400',
  'purple-pink': 'bg-gradient-to-r from-purple-600 to-pink-600',
  'blue-purple': 'bg-gradient-to-r from-blue-600 to-purple-600',
  'orange-pink-full': 'bg-gradient-to-br from-orange-400 to-pink-400',
  'festival-rainbow': 'bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-orange-600',
  'partners': 'bg-gradient-to-br from-indigo-500 to-purple-600'
} as const

/**
 * Get Tailwind class for brand color
 * @param color - Brand color name
 * @param variant - Color variant (DEFAULT, light, dark)
 * @param type - CSS property type (bg, text, border)
 */
export function getBrandColor(
  color: keyof typeof brandColors,
  variant: 'DEFAULT' | 'light' | 'dark' = 'DEFAULT',
  type: 'bg' | 'text' | 'border' = 'bg'
): string {
  const colorValue = brandColors[color][variant]
  return `${type}-${colorValue}`
}

/**
 * Get semantic color classes for alerts/notifications
 * @param type - Semantic type (success, error, warning, info)
 */
export function getSemanticColorClasses(type: keyof typeof semanticColors) {
  return semanticColors[type]
}

/**
 * Get gradient class
 * @param gradient - Gradient name
 */
export function getGradient(gradient: keyof typeof gradients): string {
  return gradients[gradient]
}

// Type exports
export type BrandColorName = keyof typeof brandColors
export type BrandColorVariant = 'DEFAULT' | 'light' | 'dark'
export type SemanticColorType = keyof typeof semanticColors
export type GradientName = keyof typeof gradients
