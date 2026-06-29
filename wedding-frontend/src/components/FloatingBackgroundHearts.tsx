import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export const FloatingBackgroundHearts: React.FC = () => {
    const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; duration: number; size: number }[]>([]);

    useEffect(() => {
        const items = Array.from({ length: 8 }, (_, i) => ({
            id: i,
            left: 5 + Math.random() * 90, 
            delay: Math.random() * 6,
            duration: 20 + Math.random() * 20, 
            size: 10 + Math.random() * 16 
        }));
        setHearts(items);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((h) => (
                <motion.div
                    key={h.id}
                    initial={{ y: '110vh', opacity: 0 }}
                    animate={{ 
                        y: '-10vh', 
                        opacity: [0, 0.12, 0.12, 0], 
                        x: [0, Math.sin(h.id) * 40, -Math.sin(h.id) * 40, 0] 
                    }}
                    transition={{
                        duration: h.duration,
                        repeat: Infinity,
                        delay: h.delay,
                        ease: "linear"
                    }}
                    style={{
                        position: 'absolute',
                        left: `${h.left}%`,
                        fontSize: `${h.size}px`,
                    }}
                    className="text-rose-300/40 select-none filter blur-[0.5px]"
                >
                    💖
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingBackgroundHearts;
