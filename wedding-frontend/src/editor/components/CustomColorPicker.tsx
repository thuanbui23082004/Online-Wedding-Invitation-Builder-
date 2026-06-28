import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useEditorStore } from '../store/editorStore';
import '../styles/CustomColorPicker.css';

export interface ColorData {
  type: 'solid' | 'gradient';
  color: string;
  gradientFrom: string;
  gradientTo: string;
  gradientAngle: number;
}

interface CustomColorPickerProps {
  onClose: () => void;
  initialType?: 'solid' | 'gradient' | 'image';
  initialColor?: string;
  initialGradientFrom?: string;
  initialGradientTo?: string;
  initialGradientAngle?: number;
  forceSolid?: boolean;
  onChange?: (data: ColorData) => void;
  alignRight?: boolean;
}

// Helper to convert hex to rgba
function hexToRgba(hex: string, opacity: number) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length >= 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
}

export function CustomColorPicker({ 
  onClose, 
  initialType = 'solid', 
  initialColor = '#ffffff', 
  initialGradientFrom = '#ffffff',
  initialGradientTo = '#000000',
  initialGradientAngle = 90,
  forceSolid, 
  onChange, 
  alignRight 
}: CustomColorPickerProps) {
  const { recentColors, addRecentColor } = useEditorStore();
  const [tab, setTab] = useState<'solid' | 'gradient' | 'image'>(forceSolid ? 'solid' : initialType);
  
  // States for Solid
  const [solidHex, setSolidHex] = useState(initialColor.startsWith('#') ? initialColor.slice(0, 7) : '#ffffff');
  const [solidOpacity, setSolidOpacity] = useState(100);

  // States for Gradient
  const [gradStop, setGradStop] = useState<'from' | 'to'>('from');
  const [gradFromHex, setGradFromHex] = useState(initialGradientFrom);
  const [gradToHex, setGradToHex] = useState(initialGradientTo);
  const [gradAngle, setGradAngle] = useState(initialGradientAngle);

  // Whenever local states change, emit onChange
  useEffect(() => {
    if (onChange) {
      onChange({
        type: tab === 'image' ? 'solid' : tab, // fallback
        color: hexToRgba(solidHex, solidOpacity),
        gradientFrom: gradFromHex,
        gradientTo: gradToHex,
        gradientAngle: gradAngle,
      });
    }
  }, [solidHex, solidOpacity, gradFromHex, gradToHex, gradAngle, tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSolidChange = (newHex: string) => {
    setSolidHex(newHex);
  };

  const handleOpacityChange = (newOpacity: number) => {
    setSolidOpacity(newOpacity);
  };

  const handleGradientChange = (newHex: string) => {
    if (gradStop === 'from') setGradFromHex(newHex);
    else setGradToHex(newHex);
  };

  const handleClose = () => {
    if (tab === 'solid') {
      addRecentColor(hexToRgba(solidHex, solidOpacity));
    } else {
      addRecentColor(gradFromHex);
      addRecentColor(gradToHex);
    }
    onClose();
  };

  return (
    <div className={`custom-color-picker-wrapper ${alignRight ? 'ccp-align-right' : ''}`}>
      <div className="ccp-header">
        {!forceSolid && (
        <div className="ccp-tabs">
          <button className={`ccp-tab ${tab === 'solid' ? 'active' : ''}`} onClick={() => setTab('solid')}>Màu</button>
          <button className={`ccp-tab ${tab === 'gradient' ? 'active' : ''}`} onClick={() => setTab('gradient')}>Gradient</button>
          <button className={`ccp-tab ${tab === 'image' ? 'active' : ''}`} onClick={() => setTab('image')}>Ảnh</button>
        </div>
        )}
        <button className="ccp-close" onClick={handleClose}>&times;</button>
      </div>

      <div className="ccp-body">
        {tab === 'solid' ? (
          <div className="ccp-content">
            <HexColorPicker color={solidHex} onChange={handleSolidChange} />
            <div className="ccp-inputs">
              <div className="ccp-input-group">
                <label>Hex</label>
                <input type="text" value={solidHex} onChange={(e) => setSolidHex(e.target.value)} />
              </div>
              <div className="ccp-input-group">
                <label>Độ trong suốt (%)</label>
                <input type="number" min="0" max="100" value={solidOpacity} onChange={(e) => handleOpacityChange(Number(e.target.value))} />
              </div>
            </div>
          </div>
        ) : (
          <div className="ccp-content">
            <div className="ccp-gradient-stops">
              <button 
                className={`ccp-stop-btn ${gradStop === 'from' ? 'active' : ''}`}
                style={{ backgroundColor: gradFromHex }}
                onClick={() => setGradStop('from')}
              ></button>
              <div className="ccp-gradient-preview" style={{ background: `linear-gradient(90deg, ${gradFromHex}, ${gradToHex})` }}></div>
              <button 
                className={`ccp-stop-btn ${gradStop === 'to' ? 'active' : ''}`}
                style={{ backgroundColor: gradToHex }}
                onClick={() => setGradStop('to')}
              ></button>
            </div>
            
            <HexColorPicker 
              color={gradStop === 'from' ? gradFromHex : gradToHex} 
              onChange={handleGradientChange} 
            />

            <div className="ccp-inputs">
              <div className="ccp-input-group">
                <label>Hex</label>
                <input 
                  type="text" 
                  value={gradStop === 'from' ? gradFromHex : gradToHex} 
                  onChange={(e) => handleGradientChange(e.target.value)} 
                />
              </div>
              <div className="ccp-input-group">
                <label>Góc xoay (độ)</label>
                <input 
                  type="number" 
                  min="0" max="360" 
                  value={gradAngle} 
                  onChange={(e) => setGradAngle(Number(e.target.value))} 
                />
              </div>
            </div>
          </div>
        )}

        <div className="ccp-recent">
          <p>Màu trong thiết kế</p>
          <div className="ccp-recent-list">
            {recentColors.map((c, i) => (
              <button 
                key={i} 
                className="ccp-recent-item" 
                style={{ backgroundColor: c }}
                onClick={() => {
                  if (tab === 'solid') {
                    setSolidHex(c.slice(0, 7));
                  } else {
                    if (gradStop === 'from') setGradFromHex(c.slice(0, 7));
                    else setGradToHex(c.slice(0, 7));
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
