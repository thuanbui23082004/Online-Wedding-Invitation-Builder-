import React, { useEffect, useState } from 'react';
import type { CanvasElement } from '../../types/editor.types';

interface CountdownEditorElementProps {
    element: CanvasElement;
    zoom: number;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountdownEditorElement({ element, zoom }: CountdownEditorElementProps) {
    const props = element.countdownProps;
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!props) return;
        const calculateTimeLeft = () => {
            const target = new Date(`${props.targetDate}T${props.targetTime}`);
            const now = new Date();
            const difference = target.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [props?.targetDate, props?.targetTime]);

    if (!props) return null;

    const scale = zoom / 100;

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: props.direction === 'horizontal' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${props.spacing}px`,
        fontFamily: props.font,
    };

    const itemStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: props.backgroundColor,
        opacity: props.opacity,
        paddingTop: `${props.paddingTop}px`,
        paddingRight: `${props.paddingRight}px`,
        paddingBottom: `${props.paddingBottom}px`,
        paddingLeft: `${props.paddingLeft}px`,
        borderWidth: `${props.borderWidth}px`,
        borderColor: props.borderColor,
        borderRadius: `${props.borderRadius}px`,
        borderStyle: props.borderStyle as React.CSSProperties['borderStyle'],
        boxShadow: `${props.shadowX}px ${props.shadowY}px ${props.shadowBlur}px ${props.shadowSpread}px ${props.shadowColor}`,
        boxSizing: 'border-box',
        overflow: 'hidden',
    };

    const numberStyle: React.CSSProperties = {
        fontSize: `${props.fontSize}px`,
        fontWeight: 'bold',
        color: props.textColor,
        lineHeight: 1.2,
    };

    const labelStyle: React.CSSProperties = {
        fontSize: `${Math.max(10, props.fontSize * 0.4)}px`,
        color: props.textColor,
        textTransform: 'uppercase',
        marginTop: '4px',
        opacity: 0.8,
    };

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <div style={containerStyle}>
            {props.showDays && (
                <div style={itemStyle}>
                    <span style={numberStyle}>{formatNumber(timeLeft.days)}</span>
                    <span style={labelStyle}>{props.language === 'en' ? 'Days' : props.label.days}</span>
                </div>
            )}
            {props.showHours && (
                <div style={itemStyle}>
                    <span style={numberStyle}>{formatNumber(timeLeft.hours)}</span>
                    <span style={labelStyle}>{props.language === 'en' ? 'Hours' : props.label.hours}</span>
                </div>
            )}
            {props.showMinutes && (
                <div style={itemStyle}>
                    <span style={numberStyle}>{formatNumber(timeLeft.minutes)}</span>
                    <span style={labelStyle}>{props.language === 'en' ? 'Minutes' : props.label.minutes}</span>
                </div>
            )}
            {props.showSeconds && (
                <div style={itemStyle}>
                    <span style={numberStyle}>{formatNumber(timeLeft.seconds)}</span>
                    <span style={labelStyle}>{props.language === 'en' ? 'Seconds' : props.label.seconds}</span>
                </div>
            )}
        </div>
    );
}
