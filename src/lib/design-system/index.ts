/**
 * Design System
 * Central export for all design system utilities
 */

export * from './colors'
export * from './spacing'
export * from './typography'

/**
 * Commonly used utility function to combine classes
 * Works well with Tailwind's arbitrary values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Animation utilities
 */
export const animations = {
  fadeIn: 'animate-fade-in-up',
  pulse: 'festival-pulse',
  float: 'float-animation',
  scroll: 'animate-scroll',
  bounce: 'animate-bounce',
  gradientAnimate: 'gradient-animate'
} as const

export type AnimationName = keyof typeof animations

/**
 * Get animation class
 * @param animation - Animation name
 */
export function getAnimation(animation: AnimationName): string {
  return animations[animation]
}

/**
 * Border radius utilities
 */
export const borderRadius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
  full: 'rounded-full'
} as const

export type BorderRadiusSize = keyof typeof borderRadius

/**
 * Get border radius class
 * @param size - Border radius size
 */
export function getBorderRadius(size: BorderRadiusSize): string {
  return borderRadius[size]
}

/**
 * Shadow utilities
 */
export const shadows = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  'blue-glow': 'hover:shadow-blue-100',
  'purple-glow': 'hover:shadow-purple-100',
  'green-glow': 'hover:shadow-green-100',
  rainbow: 'rainbow-shadow'
} as const

export type ShadowSize = keyof typeof shadows

/**
 * Get shadow class
 * @param size - Shadow size
 */
export function getShadow(size: ShadowSize): string {
  return shadows[size]
}

/**
 * Transition utilities
 */
export const transitions = {
  none: 'transition-none',
  all: 'transition-all duration-300',
  fast: 'transition-all duration-150',
  slow: 'transition-all duration-500',
  colors: 'transition-colors duration-300',
  transform: 'transition-transform duration-300'
} as const

export type TransitionType = keyof typeof transitions

/**
 * Get transition class
 * @param type - Transition type
 */
export function getTransition(type: TransitionType): string {
  return transitions[type]
}
