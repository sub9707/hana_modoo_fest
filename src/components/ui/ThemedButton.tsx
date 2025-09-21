'use client';

type Theme = 'purple' | 'orange';
type Variant = 'primary' | 'secondary';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  theme: Theme;
  variant: Variant;
  size: Size;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const ThemedButton = ({ 
  title, 
  theme, 
  variant, 
  size, 
  onClick, 
  disabled = false, 
  className = '' 
}: ButtonProps) => {

  const baseStyles = 'w-full rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const getThemeStyles = () => {
    if (theme === 'purple') {
      if (variant === 'primary') {
        return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700 focus:ring-purple-500 md:hover:scale-105';
      } else {
        return 'bg-white border-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-400 focus:ring-purple-500 md:hover:scale-105';
      }
    } else {
      if (variant === 'primary') {
        return 'bg-gradient-to-r from-orange-300 to-pink-400 text-white hover:shadow-lg hover:from-orange-400 hover:to-pink-500 focus:ring-orange-500 md:hover:scale-105';
      } else {
        return 'bg-white border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400 focus:ring-orange-500 md:hover:scale-105';
      }
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${themeStyles} ${className}`}
    >
      {title}
    </button>
  );
};

export default ThemedButton;