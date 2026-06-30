
export const MailSendEmailMessageFlatIcon = ({
  size = undefined,
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
      <path fill="#8fbffa" d="M5.664 1.998C3.367 1.2 1.253 3.363 2.131 5.64c2.108 5.467 4.672 10.89 5.881 13.376a4.42 4.42 0 0 0 2.445 2.205L17.96 24l-7.503 2.78a4.42 4.42 0 0 0-2.445 2.204C6.803 31.47 4.24 36.893 2.131 42.36c-.878 2.277 1.236 4.439 3.533 3.642c7.718-2.676 24.001-8.999 38.018-18.917a3.764 3.764 0 0 0 0-6.17c-14.017-9.918-30.3-16.24-38.018-18.917"/>
    </svg>
  );
};

