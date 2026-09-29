export type ButtonType = 'STANDARD' | 'HOLD' | 'CIRCULAR' | 'IMAGE' | 'SLIDER' | 'TOGGLE' | 'MACRO' | 'HOTKEY';

export type GlassIntensity = 'None' | 'Subtle' | 'Regular' | 'Heavy' | 'UltraLiquid';

export interface RyperButton {
  id: string;
  pageId: string;
  type: ButtonType;
  row: number;
  col: number;
  spanRows: number;
  spanCols: number;
  sortOrder?: number;
  label: string;
  sublabel?: string;
  iconKey?: string;
  imageUri?: string;
  isToggledOn?: boolean | number;
  sliderValue?: number;
  sliderMin?: number;
  sliderMax?: number;
  targetFolderPageId?: string | null;
  assignedMacroId?: string | null;
  backgroundColorArgb?: number | string | null;
  gradientStartArgb?: number | string | null;
  gradientEndArgb?: number | string | null;
  cornerRadiusDp?: number;
  isCircleShape?: boolean | number;
  glassIntensityKey?: string;
  opacity?: number;
  blurDp?: number;
  borderColorArgb?: number | string | null;
  borderWidthDp?: number;
  rotationDegrees?: number;
  fontKey?: string | null;
  animationKey?: string | null;
  shapeKey?: string;
  hotkeyDisplay?: string;
}

export interface RyperPage {
  id: string;
  name: string;
  isFavorite?: boolean | number;
  isLocked?: boolean | number;
  sortOrder: number;
  gridColumns: number;
  gridRows: number;
  iconKey?: string;
  parentFolderPageId?: string | null;
  orientationLock?: 'LANDSCAPE' | 'PORTRAIT' | 'AUTO';
  layoutPreset: 'CUSTOM' | 'PHONE_STANDARD' | 'PHONE_LARGE' | 'TABLET_STANDARD' | 'TABLET_LARGE';
  buttons: RyperButton[];
}

export interface RyperMacro {
  id: string;
  name: string;
  category: string;
  tagsJson?: string;
  blocksJson?: string;
}

export interface RyperPresetPackage {
  id: string;
  version: string;
  appName: 'RyperDeck';
  exportTimestamp: number;
  author: string;
  presetName: string;
  description: string;
  category: 'Streaming' | 'Developer' | 'Creative' | 'Audio' | 'Gaming' | 'Productivity';
  deviceTarget: 'Phone & Tablet' | 'Phone (Landscape)' | 'Tablet (Macro Deck)' | 'Any Device';
  accentColor: string;
  isOfficial?: boolean;
  pages: RyperPage[];
  macros?: RyperMacro[];
}
