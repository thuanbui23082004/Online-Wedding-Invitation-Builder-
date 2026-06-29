import React from 'react';

const InstagramIcon = ({
  size = 24,
  color = '#000000',
  strokeWidth = 2,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <g>
        {/* Khung nền chứa dải màu chuyển sắc chuẩn hóa sang hệ trục 24x24 */}
        <rect width="24" height="24" fill="url(#InstaGrad)" rx="5.5" stroke="none" />
        <path 
          fill="#FFF" 
          stroke="none"
          d="M12 5.8c2 0 2.2 0 3 .1.7.0 1.2.2 1.5.3.4.2.8.4 1.1.8.3.3.6.7.8 1.1.1.3.3.8.3 1.5.1.8.1 1 .1 3s0 2.2-.1 3c0 .7-.2 1.2-.3 1.5-.2.4-.4.8-.8 1.1-.3.3-.7.6-1.1.8-.3.1-.8.3-1.5.3-.8.1-1 .1-3 .1s-2.2 0-3-.1c-.7 0-1.2-.2-1.5-.3-.4-.2-.8-.4-1.1-.8-.3-.3-.6-.7-.8-1.1-.1-.3-.3-.8-.3-.1.5-.1-.8-.1-1-.1-3s0-2.2.1-3c0-.7.2-1.2.3-1.5.2-.4.4-.8.8-1.1.3-.3.7-.6 1.1-.8.3-.1.8-.3 1.5-.3.8-.1 1-.1 3-.1m0-1.6c-2 0-2.3 0-3.1.1-.8.0-1.4.2-2 .4-.5.2-1 .6-1.4 1s-.8.9-1 1.4c-.2.6-.4 1.2-.4 2-.1.8-.1 1-.1 3.1s0 2.3.1 3.1c0 .8.2 1.4.4 2 .2.5.6 1 1 1.4s.9.8 1.4 1c.6.2 1.2.4 2 .4.8.1 1 .1 3.1.1s2.3 0 3.1-.1c.8 0 1.4-.2 2-.4.5-.2 1-.6 1.4-1s.8-.9 1-1.4c.2-.6.4-1.2.4-2 .1-.8.1-1 .1-3.1s0-2.3-.1-3.1c0-.8-.2-1.4-.4-2-.2-.5-.6-1-1-1.4s-.9-.8-1.4-1c-.6-.2-1.2-.4-2-.4-.8-.1-1-.1-3.1-.1z"
        />
        <path 
          fill="#FFF" 
          stroke="none"
          d="M12 8.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm0 5a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4z"
        />
        <circle cx="17.3" cy="6.7" r="0.8" fill="#FFF" stroke="none" />
      </g>
      <defs>
        <linearGradient id="InstaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FED373" />
          <stop offset="25%" stopColor="#F15245" />
          <stop offset="60%" stopColor="#D92E7F" />
          <stop offset="100%" stopColor="#9B36B7" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default InstagramIcon;