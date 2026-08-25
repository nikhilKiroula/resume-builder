import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return <Loader2 className={`animate-spin text-current ${sizes[size]} ${className}`} />;
};

export default Spinner;
