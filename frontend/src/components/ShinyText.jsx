
import React from 'react';

const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}) => {
  const style = disabled
    ? {}
    : { '--shine-duration': `${speed}s` };

  return (
    <span
      style={style}
      className={[
        'inline-block',
        'text-[#b5b5b5a4]',
        'bg-clip-text',
        'text-transparent',
        'bg-gradient-to-r',
        'from-white/0',
        'via-white/80',
        'to-white/0',
        'bg-[length:200%_100%]',
        disabled ? '' : 'animate-shine',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {text}
    </span>
  );
};

export default ShinyText;
