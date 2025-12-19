// Enhanced Design Tokens for Modern UI
export const designTokens = {
  // Color Palette
  colors: {
    primary: {
      50: '#eff6ff',   // Very light blue
      100: '#dbeafe',  // Light blue
      200: '#bfdbfe',  // Lighter blue
      300: '#93c5fd',  // Light medium blue
      400: '#60a5fa',  // Medium blue
      500: '#3b82f6',  // Main blue
      600: '#2563eb',  // Darker blue
      700: '#1d4ed8',  // Dark blue
      800: '#1e40af',  // Very dark blue
      900: '#1e3a8a'   // Darkest blue
    },
    secondary: {
      50: '#fdf4ff',   // Very light purple
      500: '#a855f7',  // Main purple
      600: '#9333ea',  // Dark purple
      900: '#581c87'   // Darkest purple
    },
    success: {
      50: '#f0fdf4',   // Very light green
      500: '#22c55e',  // Main green
      600: '#16a34a',  // Dark green
      900: '#14532d'   // Darkest green
    },
    warning: {
      50: '#fffbeb',   // Very light yellow
      500: '#f59e0b',  // Main orange
      600: '#d97706',  // Dark orange
    },
    error: {
      50: '#fef2f2',   // Very light red
      500: '#ef4444',  // Main red
      600: '#dc2626',  // Dark red
    },
    neutral: {
      50: '#fafafa',   // Very light gray
      100: '#f5f5f5',  // Light gray
      200: '#e5e5e5',  // Lighter gray
      300: '#d4d4d4',  // Light medium gray
      400: '#a3a3a3',  // Medium gray
      500: '#737373',  // Main gray
      600: '#525252',  // Dark gray
      700: '#404040',  // Darker gray
      800: '#262626',  // Very dark gray
      900: '#171717'   // Darkest gray
    }
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%)',
    secondary: 'linear-gradient(135deg, #a855f7 0%, #581c87 100%)',
    success: 'linear-gradient(135deg, #22c55e 0%, #14532d 100%)',
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    premium: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    sunset: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)'
  },

  // Typography
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', 'sans-serif'],
      headline: ['Poppins', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
      '5xl': ['3rem', { lineHeight: '1' }],         // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }],      // 60px
      '7xl': ['4.5rem', { lineHeight: '1' }]        // 72px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    }
  },

  // Spacing
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem'     // 256px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none'
  },

  // Animations
  animations: {
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
    easing: {
      linear: 'linear',
      in: 'ease-in',
      out: 'ease-out',
      'in-out': 'ease-in-out',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-index scale
  zIndex: {
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    60: '60',
    70: '70',
    80: '80',
    90: '90',
    100: '100',
    auto: 'auto'
  }
} as const

// Type definitions for design tokens
export type DesignTokens = typeof designTokens
export type ColorPalette = keyof typeof designTokens.colors
export type GradientType = keyof typeof designTokens.gradients
export type FontSize = keyof typeof designTokens.typography.fontSize
export type FontWeight = keyof typeof designTokens.typography.fontWeight
export type Spacing = keyof typeof designTokens.spacing
export type BorderRadius = keyof typeof designTokens.borderRadius
export type Shadow = keyof typeof designTokens.shadows
export type ZIndex = keyof typeof designTokens.zIndex

// Utility functions for design tokens
export const getColor = (color: ColorPalette, shade: number = 500) => {
  return designTokens.colors[color][shade as keyof typeof designTokens.colors[typeof color]]
}

export const getGradient = (gradient: GradientType) => {
  return designTokens.gradients[gradient]
}

export const getFontSize = (size: FontSize) => {
  return designTokens.typography.fontSize[size]
}

export const getSpacing = (space: Spacing) => {
  return designTokens.spacing[space]
}

export const getShadow = (shadow: Shadow) => {
  return designTokens.shadows[shadow]
}

// CSS custom properties for runtime usage
export const cssCustomProperties = {
  // Primary colors
  '--color-primary-50': designTokens.colors.primary[50],
  '--color-primary-500': designTokens.colors.primary[500],
  '--color-primary-600': designTokens.colors.primary[600],
  '--color-primary-900': designTokens.colors.primary[900],

  // Gradients
  '--gradient-primary': designTokens.gradients.primary,
  '--gradient-hero': designTokens.gradients.hero,
  '--gradient-premium': designTokens.gradients.premium,

  // Typography
  '--font-primary': designTokens.typography.fontFamily.primary.join(', '),
  '--font-headline': designTokens.typography.fontFamily.headline.join(', '),

  // Spacing
  '--space-4': designTokens.spacing[4],
  '--space-6': designTokens.spacing[6],
  '--space-8': designTokens.spacing[8],

  // Shadows
  '--shadow-md': designTokens.shadows.md,
  '--shadow-lg': designTokens.shadows.lg,
  '--shadow-xl': designTokens.shadows.xl
} as const