export type ActiveTool =
  | 'select'
  | 'text'
  | 'image'
  | 'shape'
  | 'bg'
  | 'elements'
  | 'music'
  | 'map';

export interface EditorState {
  cardTitle: string;
  bgColor: string;
  selectedObjectId: string | null;
  activeTool: ActiveTool;
  isSaving: boolean;
}

export interface SelectedObjectProps {
  type: string;
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  textAlign?: string;
  opacity?: number;
  fontWeight?: string;
  fontStyle?: string;
}