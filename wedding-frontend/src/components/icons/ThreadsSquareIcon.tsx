
const ThreadsSquareIcon = ({
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
      <path 
        fill="currentColor" 
        stroke="none"
        d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5M7.52 14.53A5 5 0 0 0 8.24 16a4 4 0 0 0 1.81 1.39c.45.17.92.27 1.39.32.47.05.94.02 1.4 0a4.6 4.6 0 0 0 1.57-.41 3.6 3.6 0 0 0 1.39-1.2 2.42 2.42 0 0 0 .33-2.1 2 2 0 0 0-.8-1.09l-.2-.14c0 .09 0 .17-.05.25-.07.45-.22.88-.44 1.28a2.63 2.63 0 0 1-1.92 1.34 3.3 3.3 0 0 1-1.59-.08A2.55 2.55 0 0 1 10 14.9a2.17 2.17 0 0 1-.61-1.29 2.2 2.2 0 0 1 1-2.12 3.3 3.3 0 0 1 1.2-.49c.42-.08.85-.11 1.28-.09.34 0 .67.03 1 .09h.06a2.4 2.4 0 0 0-.27-.78 1.38 1.38 0 0 0-.89-.64 2.3 2.3 0 0 0-1.35 0 1.66 1.66 0 0 0-.79.59v.07l-1-.69v-.07a2.84 2.84 0 0 1 1.77-1.17 3.63 3.63 0 0 1 1.85.08 2.55 2.55 0 0 1 1.55 1.33c.18.36.3.74.35 1.14a4 4 0 0 1 .05.52l.3.14a4 4 0 0 1 1.22 1c.35.43.57.94.66 1.48.07.33.1.67.07 1a3.75 3.75 0 0 1-.93 2.25 4.93 4.93 0 0 1-2.7 1.63 8 8 0 0 1-1.41.17 8 8 0 0 1-1.29-.05 6.3 6.3 0 0 1-2-.58 5.2 5.2 0 0 1-2-1.79 6.8 6.8 0 0 1-.83-1.86c-.13-.49-.23-1-.29-1.51V12c0-.42 0-.84.07-1.26a9.5 9.5 0 0 1 .23-1.41A6.3 6.3 0 0 1 7 7.67a5.1 5.1 0 0 1 2.86-2.35A7.4 7.4 0 0 1 11.2 5a7.6 7.6 0 0 1 1.72 0a6.4 6.4 0 0 1 2 .52 5.17 5.17 0 0 1 2.24 1.9A6.6 6.6 0 0 1 18 9.38l-1.18.32v-.08a5.6 5.6 0 0 0-.58-1.35A4.08 4.08 0 0 0 14 6.52a5.6 5.6 0 0 0-1.52-.29 7 7 0 0 0-1.15 0 5 5 0 0 0-1.7.48A3.93 3.93 0 0 0 8 8.31a5.8 5.8 0 0 0-.57 1.49c-.11.42-.18.86-.21 1.29a10 10 0 0 0 0 1.25c.04.74.14 1.47.3 2.19"
      />
      <path 
        fill="currentColor" 
        stroke="none"
        d="M14 12.31c-.02.42-.12.83-.28 1.22a1.6 1.6 0 0 1-.63.71c-.19.1-.39.17-.6.19a2.4 2.4 0 0 1-.92 0 1.6 1.6 0 0 1-.55-.27 1 1 0 0 1-.08-1.42 1.5 1.5 0 0 1 .67-.38c.27-.09.56-.13.84-.12.26 0 .52 0 .78 0 .24 0 .48.03.72.1z"
      />
    </svg>
  );
};

export default ThreadsSquareIcon;