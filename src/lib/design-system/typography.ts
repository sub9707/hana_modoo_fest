/**
 * Typography Utility Functions
 * Consistent typography across the application
 */

export const fontSizes = {
  xs: 'text-xs',      // 12px
  sm: 'text-sm',      // 14px
  base: 'text-base',  // 16px
  lg: 'text-lg',      // 18px
  xl: 'text-xl',      // 20px
  '2xl': 'text-2xl',  // 24px
  '3xl': 'text-3xl',  // 30px
  '4xl': 'text-4xl',  // 36px
  '5xl': 'text-5xl',  // 48px
  '6xl': 'text-6xl',  // 60px
  '7xl': 'text-7xl',  // 72px
  '8xl': 'text-8xl',  // 96px
  '9xl': 'text-9xl'   // 128px
} as const

export const fontWeights = {
  thin: 'font-thin',          // 100
  light: 'font-light',        // 300
  normal: 'font-normal',      // 400
  medium: 'font-medium',      // 500
  semibold: 'font-semibold',  // 600
  bold: 'font-bold',          // 700
  extrabold: 'font-extrabold', // 800
  black: 'font-black'         // 900
} as const

export const lineHeights = {
  none: 'leading-none',       // 1
  tight: 'leading-tight',     // 1.25
  snug: 'leading-snug',       // 1.375
  normal: 'leading-normal',   // 1.5
  relaxed: 'leading-relaxed', // 1.625
  loose: 'leading-loose'      // 2
} as const

export const textStyles = {
  h1: 'text-5xl md:text-6xl lg:text-7xl font-bold leading-tight',
  h2: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight',
  h3: 'text-3xl md:text-4xl lg:text-5xl font-semibold leading-snug',
  h4: 'text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug',
  h5: 'text-xl md:text-2xl lg:text-3xl font-semibold leading-normal',
  h6: 'text-lg md:text-xl lg:text-2xl font-semibold leading-normal',
  body: 'text-base leading-relaxed',
  bodyLarge: 'text-lg leading-relaxed',
  bodySmall: 'text-sm leading-normal',
  caption: 'text-xs leading-normal',
  label: 'text-sm font-medium',
  button: 'text-base font-semibold'
} as const

/**
 * Get font size class
 * @param size - Font size
 */
export function getFontSize(size: keyof typeof fontSizes): string {
  return fontSizes[size]
}

/**
 * Get font weight class
 * @param weight - Font weight
 */
export function getFontWeight(weight: keyof typeof fontWeights): string {
  return fontWeights[weight]
}

/**
 * Get line height class
 * @param height - Line height
 */
export function getLineHeight(height: keyof typeof lineHeights): string {
  return lineHeights[height]
}

/**
 * Get text style class
 * @param style - Text style preset
 */
export function getTextStyle(style: keyof typeof textStyles): string {
  return textStyles[style]
}

/**
 * Combine typography classes
 * @param size - Font size
 * @param weight - Font weight
 * @param height - Line height
 */
export function combineTypography(
  size: keyof typeof fontSizes,
  weight?: keyof typeof fontWeights,
  height?: keyof typeof lineHeights
): string {
  const classes = [fontSizes[size]]
  if (weight) classes.push(fontWeights[weight])
  if (height) classes.push(lineHeights[height])
  return classes.join(' ')
}

// Type exports
export type FontSize = keyof typeof fontSizes
export type FontWeight = keyof typeof fontWeights
export type LineHeight = keyof typeof lineHeights
export type TextStyle = keyof typeof textStyles
