import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name?: string;
  className?: string;
  size?: number;
}

// Map kebab-case or alias names to Lucide PascalCase icon names
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export const DynamicIcon: React.FC<IconProps> = ({ name, className = 'w-5 h-5', size }) => {
  if (!name) {
    return <Icons.Sparkles className={className} size={size} />;
  }

  // Handle common aliases from Android / DB
  const normalized = name.toLowerCase().trim();
  let iconName = toPascalCase(normalized);

  if (normalized === 'bolt' || normalized === 'flash') iconName = 'Zap';
  if (normalized === 'gamepad-2' || normalized === 'game') iconName = 'Gamepad2';
  if (normalized === 'mic-off') iconName = 'MicOff';
  if (normalized === 'headphones' || normalized === 'audio') iconName = 'Headphones';
  if (normalized === 'columns-2') iconName = 'Columns2';
  if (normalized === 'rotate-cw') iconName = 'RotateCw';
  if (normalized === 'code-2') iconName = 'Code2';
  if (normalized === 'maximize-2') iconName = 'Maximize2';
  if (normalized === 'git-pull-request') iconName = 'GitPullRequest';
  if (normalized === 'git-commit') iconName = 'GitCommit';
  if (normalized === 'skip-back') iconName = 'SkipBack';
  if (normalized === 'skip-forward') iconName = 'SkipForward';
  if (normalized === 'message-square') iconName = 'MessageSquare';
  if (normalized === 'message-circle') iconName = 'MessageCircle';
  if (normalized === 'bell-off') iconName = 'BellOff';
  if (normalized === 'fast-forward') iconName = 'FastForward';
  if (normalized === 'pen-tool') iconName = 'PenTool';

  const IconComponent = (Icons as unknown as Record<string, React.FC<any>>)[iconName];

  if (!IconComponent) {
    return <Icons.Layers className={className} size={size} />;
  }

  return <IconComponent className={className} size={size} />;
};
