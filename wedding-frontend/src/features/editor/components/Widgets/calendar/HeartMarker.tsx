import { motion } from 'framer-motion';

interface HeartMarkerProps {
  color: string;           // primaryColor hoặc secondaryColor
  size?: number;           // kích thước trái tim
  dayNumber: number;       // số ngày hiển thị bên dưới (hoặc đè lên)
  showDayNumber?: boolean; // có hiện số ngày bên trong không
}

export function HeartMarker({ color, size = 28, dayNumber, showDayNumber = true }: HeartMarkerProps) {
  return (
    <motion.div
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </motion.div>
      {showDayNumber && (
        <span style={{ 
          fontSize: size * 0.45, 
          color: 'white',
          position: 'absolute', 
          top: '44%',
          transform: 'translateY(-50%)', 
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          {dayNumber}
        </span>
      )}
    </motion.div>
  );
}
