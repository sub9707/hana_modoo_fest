/**
 * Design Tokens for 모두하나대축제
 *
 * This file contains all design tokens used across the application.
 * Use these tokens to maintain consistency and enable easy theme changes.
 */

export const designTokens = {
  /**
   * Brand Colors - Primary festival brand colors
   */
  colors: {
    brand: {
      blue: {
        DEFAULT: '#2563eb',
        light: '#3b82f6',
        dark: '#1d4ed8'
      },
      purple: {
        DEFAULT: '#7c3aed',
        light: '#8b5cf6',
        dark: '#6d28d9'
      },
      orange: {
        DEFAULT: '#ea580c',
        light: '#fb923c',
        dark: '#c2410c'
      },
      pink: {
        DEFAULT: '#db2777',
        light: '#f472b6',
        dark: '#be185d'
      },
      green: {
        DEFAULT: '#059669',
        light: '#10b981',
        dark: '#047857'
      }
    },

    /**
     * Semantic Colors - Purpose-based colors
     */
    semantic: {
      success: {
        DEFAULT: '#059669',
        light: '#d1fae5',
        dark: '#047857',
        text: '#065f46'
      },
      error: {
        DEFAULT: '#dc2626',
        light: '#fee2e2',
        dark: '#b91c1c',
        text: '#991b1b'
      },
      warning: {
        DEFAULT: '#f59e0b',
        light: '#fef3c7',
        dark: '#d97706',
        text: '#92400e'
      },
      info: {
        DEFAULT: '#3b82f6',
        light: '#dbeafe',
        dark: '#2563eb',
        text: '#1e40af'
      }
    },

    /**
     * Neutral Colors - Grayscale palette
     */
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
      950: '#030712'
    }
  },

  /**
   * Gradient Presets - Commonly used gradients
   */
  gradients: {
    'orange-pink': 'linear-gradient(to right, #fb923c, #f472b6)',
    'purple-pink': 'linear-gradient(to right, #7c3aed, #db2777)',
    'blue-purple': 'linear-gradient(to right, #2563eb, #7c3aed)',
    'orange-pink-full': 'linear-gradient(135deg, #fb923c 0%, #f472b6 100%)',
    'festival-rainbow': 'linear-gradient(-45deg, #2563eb, #7c3aed, #db2777, #ea580c)',
    'partners': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },

  /**
   * Typography - Font sizes, weights, and line heights
   */
  typography: {
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
      '9xl': '8rem'       // 128px
    },
    fontWeight: {
      thin: '100',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  /**
   * Spacing - Consistent spacing scale
   */
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem'       // 384px
  },

  /**
   * Border Radius - Rounded corner sizes
   */
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  /**
   * Shadows - Box shadow presets
   */
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    none: '0 0 #0000',

    // Custom festival shadows
    'blue-glow': '0 20px 50px rgba(59, 130, 246, 0.1)',
    'purple-glow': '0 20px 50px rgba(124, 58, 237, 0.1)',
    'green-glow': '0 20px 50px rgba(5, 150, 105, 0.1)',
    'rainbow': '0 0 20px rgba(37, 99, 235, 0.3), 0 0 40px rgba(124, 58, 237, 0.2), 0 0 60px rgba(219, 39, 119, 0.1)',
    'rainbow-hover': '0 0 30px rgba(37, 99, 235, 0.4), 0 0 60px rgba(124, 58, 237, 0.3), 0 0 90px rgba(219, 39, 119, 0.2)'
  },

  /**
   * Transitions - Animation durations and easing
   */
  transitions: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    timing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },

  /**
   * Z-Index - Layering scale
   */
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070'
  },

  /**
   * Breakpoints - Responsive design breakpoints
   */
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  /**
   * Container - Max width containers
   */
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    '3xl': '1536px',
    '4xl': '1600px',
    '5xl': '1728px',
    '6xl': '1920px',
    '7xl': '2048px'
  }
} as const

/**
 * Type-safe design token access
 */
export type DesignTokens = typeof designTokens
export type BrandColor = keyof typeof designTokens.colors.brand
export type SemanticColor = keyof typeof designTokens.colors.semantic
export type Gradient = keyof typeof designTokens.gradients
