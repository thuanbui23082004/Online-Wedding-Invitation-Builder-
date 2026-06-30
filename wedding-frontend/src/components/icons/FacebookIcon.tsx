
const FacebookIcon = ({
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
      {/* Sửa d đưa về gốc 24, khử stroke viền thừa làm méo hình */}
      <path 
        fill="#1877F2" 
        stroke="none"
        d="M24 12a10 10 0 1 0-11.56 9.88v-6.99H9.89V12h2.55V9.74c0-2.52 1.49-3.91 3.8-3.91 1.1 0 2.26.2 2.26.2v2.48h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 24 12z"
      />
      <path 
        fill="#FFF" 
        stroke="none"
        d="m16.89 14.89.45-2.89h-2.79V10.1c0-.79.39-1.57 1.64-1.57h1.27V6.05s-1.16-.2-2.26-.2c-2.31 0-3.8 1.39-3.8 3.91V12H8.89v2.89h2.55v6.99a10.1 10.1 0 0 0 1 .05 9.8 9.8 0 0 0 1-.05v-6.99h2.45z"
      />
    </svg>
  );
};

export default FacebookIcon;