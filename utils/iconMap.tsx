
import React from 'react';
import * as Icons from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  // @ts-ignore
  const Icon = Icons[iconName];
  return Icon ? Icon : Icons.HelpCircle;
};

export const availableIcons = [
  'Activity', 'Shield', 'Zap', 'Globe', 'Heart', 'BarChart3', 
  'CloudRain', 'Lock', 'Smartphone', 'Music', 'Camera', 'Map',
  'MessageCircle', 'Bell', 'Calendar', 'Clock', 'Search', 'Settings'
];
