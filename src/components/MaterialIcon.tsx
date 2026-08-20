import React from 'react';

/**
 * Converts a PascalCase / camelCase Material icon name (the convention used
 * throughout Growlauncher module JSON, e.g. "PlayArrow", "SwapHoriz") into
 * the snake_case ligature name expected by the Material Symbols web font
 * (e.g. "play_arrow", "swap_horiz").
 */
export function toMaterialLigature(name: string): string {
  if (!name) return '';
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

interface MaterialIconProps {
  name?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a Material Symbols icon by name (as sourced from
 * https://fonts.google.com/icons). Falls back to a generic placeholder
 * glyph if no name is provided.
 */
export default function MaterialIcon({ name, size = 18, className = '', style }: MaterialIconProps) {
  const ligature = toMaterialLigature(name || 'help');
  return (
    <span
      className={`material-symbols-outlined leading-none select-none inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{ fontSize: size, width: size, height: size, letterSpacing: 0, ...style }}
      title={name}
    >
      {ligature}
    </span>
  );
}
