import React, { useMemo } from 'react';
import type { CanvasElement } from '../../../features/editor/types/editor.types';
import { CalendarTemplate1 } from '../../../features/editor/components/Widgets/calendar/CalendarTemplate1';
import { CalendarTemplate2 } from '../../../features/editor/components/Widgets/calendar/CalendarTemplate2';
import { CalendarTemplate3 } from '../../../features/editor/components/Widgets/calendar/CalendarTemplate3';
import { parseDate } from '../../../features/editor/components/Widgets/calendar/calendarUtils';
import { HeartMarker } from '../../../features/editor/components/Widgets/calendar/HeartMarker';

interface CalendarPublicProps {
  block: CanvasElement;
  scaleFactor?: number;
}

export function CalendarPublic({ block, scaleFactor = 1 }: CalendarPublicProps) {
  const props = block.calendarProps;

  const currentMonth = useMemo(() => {
    return props?.primaryDate ? parseDate(props.primaryDate) : new Date();
  }, [props?.primaryDate]);

  if (!props) return null;
  
  const scaledProps = {
    ...props,
    fontSize: props.fontSize * scaleFactor,
    padding: {
      top: props.padding.top * scaleFactor,
      right: props.padding.right * scaleFactor,
      bottom: props.padding.bottom * scaleFactor,
      left: props.padding.left * scaleFactor,
    },
    border: {
      ...props.border,
      width: props.border.width * scaleFactor,
      radius: props.border.radius * scaleFactor,
    },
    shadow: {
      ...props.shadow,
      x: props.shadow.x * scaleFactor,
      y: props.shadow.y * scaleFactor,
      blur: props.shadow.blur * scaleFactor,
      spread: props.shadow.spread * scaleFactor,
    }
  };

  const renderTemplate = () => {
    switch (props.templateId) {
      case 2:
        return <CalendarTemplate2 content={scaledProps} currentMonth={currentMonth} />;
      case 3:
        return <CalendarTemplate3 content={scaledProps} currentMonth={currentMonth} />;
      case 1:
      default:
        return <CalendarTemplate1 content={scaledProps} currentMonth={currentMonth} />;
    }
  };

  return (
    <div style={{
      position: 'absolute',
      left: block.x * scaleFactor,
      top: block.y * scaleFactor,
      width: block.width * scaleFactor,
      height: block.height * scaleFactor,
      zIndex: block.zIndex,
      transform: `rotate(${block.rotation || 0}deg)`,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Calendar body */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {renderTemplate()}
      </div>

      {/* Two dates legend */}
      {props.showTwoDates && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24 * scaleFactor,
          marginTop: 8 * scaleFactor,
          fontSize: 12 * scaleFactor,
          fontFamily: props.font
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 * scaleFactor }}>
            <HeartMarker color={props.primaryColor} size={14 * scaleFactor} dayNumber={0} showDayNumber={false} />
            <span style={{ color: props.textColor }}>{props.groomSideLabel}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 * scaleFactor }}>
            <HeartMarker color={props.secondaryColor} size={14 * scaleFactor} dayNumber={0} showDayNumber={false} />
            <span style={{ color: props.textColor }}>{props.brideSideLabel}</span>
          </div>
        </div>
      )}
    </div>
  );
}
