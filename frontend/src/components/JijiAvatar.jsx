import { Sparkles } from 'lucide-react';

const JijiAvatar = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-lg',
    lg: 'w-14 h-14 text-2xl'
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30`}>
      <Sparkles className="text-white w-1/2 h-1/2" />
    </div>
  );
};

export default JijiAvatar;
