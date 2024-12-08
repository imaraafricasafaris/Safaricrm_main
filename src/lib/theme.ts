// Theme configuration
export const theme = {
  light: {
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      overlay: 'bg-white/95',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      tertiary: 'text-gray-500',
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-100',
    },
    hover: {
      primary: 'hover:bg-gray-50',
      secondary: 'hover:bg-gray-100',
    }
  },
  dark: {
    background: {
      primary: 'dark:bg-gray-900',
      secondary: 'dark:bg-gray-800',
      tertiary: 'dark:bg-gray-700',
      overlay: 'dark:bg-gray-900/95',
    },
    text: {
      primary: 'dark:text-white',
      secondary: 'dark:text-gray-300',
      tertiary: 'dark:text-gray-400',
    },
    border: {
      primary: 'dark:border-gray-800',
      secondary: 'dark:border-gray-700',
    },
    hover: {
      primary: 'dark:hover:bg-gray-800/50',
      secondary: 'dark:hover:bg-gray-700/50',
    }
  }
} as const;