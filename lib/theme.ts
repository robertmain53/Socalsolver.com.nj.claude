export const theme = {
  colors: {
    primary: '#FFD166',    // Sunset Yellow
    secondary: '#FF8C42',  // Orange
    accent: '#FFA69E',     // Coral Pink
    warm: '#F9C74F',       // Golden
    cool: '#4D9FEC',       // Ocean Blue
    mint: '#76C7C0',       // Coastal Mint
    coral: '#FF5E5B',      // Bright Coral
    navy: '#073B4C',       // Deep Navy
  },
  gradients: {
    sunset: 'linear-gradient(135deg, #FFD166 0%, #FF8C42 50%, #FFA69E 100%)',
    ocean: 'linear-gradient(135deg, #4D9FEC 0%, #76C7C0 100%)',
    warm: 'linear-gradient(135deg, #F9C74F 0%, #FFD166 100%)',
    coral: 'linear-gradient(135deg, #FF5E5B 0%, #FFA69E 100%)',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  }
};

export type Theme = typeof theme;
