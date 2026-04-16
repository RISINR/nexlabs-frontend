import ModernCreativeTemplate from '../components/templates/ModernCreativeTemplate';
import BlackWhiteProfessionalTemplate from '../components/templates/BlackWhiteProfessionalTemplate';
import ElegantProfessionalTemplate from '../components/templates/ElegantProfessionalTemplate';
import MinimalSleekTemplate from '../components/templates/MinimalSleekTemplate';
import BlackYellowSidebarTemplate from '../components/templates/BlackYellowSidebarTemplate';
import ProfessionalCompactTemplate from '../components/templates/ProfessionalCompactTemplate';

import React from 'react';

export type TemplateItem = {
  id: string;
  name: string;
  category: string;
  Preview?: React.ComponentType<any>;
  colors: string[];
  description: string;
};


export const templates: TemplateItem[] = [
  {
    id: 'minimal-sleek',
    name: 'Minimal Sleek',
    category: 'minimal',
    Preview: MinimalSleekTemplate,
    colors: ['#1e40af', '#059669', '#dc2626', '#7c3aed'],
    description: 'Clean, minimal design with focus on content'
  },
  {
    id: 'modern-creative',
    name: 'Modern Creative',
    category: 'creative',
    Preview: ModernCreativeTemplate,
    colors: ['#7c3aed', '#1e40af', '#059669', '#dc2626'],
    description: 'Modern creative resume based on Minimal Sleek.'
  },
  {
    id: 'elegant-professional',
    name: 'Elegant Professional',
    category: 'professional',
    Preview: ElegantProfessionalTemplate,
    colors: ['#7c8b7e', '#2d3a2e'],
    description: 'Elegant, professional layout with sidebar and modern look.'
  },
  {
    id: 'black-white-professional',
    name: 'Monochrome Professional',
    category: 'professional',
    Preview: BlackWhiteProfessionalTemplate,
    colors: ['#232323', '#444'],
    description: 'Clean, two-column professional resume with a classic monochrome style.'
  },
  {
    id: 'black-yellow-sidebar',
    name: 'Professional Sidebar',
    category: 'creative',
    Preview: BlackYellowSidebarTemplate,
    colors: ['#dc2626', '#f7c948', '#3b82f6'],
    description: 'Professional resume with a bold sidebar and strong accent, suitable for designers.'
  }
  ,
  {
    id: 'professional-compact',
    name: 'Professional Compact',
    category: 'minimal',
    Preview: ProfessionalCompactTemplate,
    colors: ['#1e40af', '#059669', '#7c3aed'],
    description: 'Compact professional layout derived from Minimal Sleek.'
  }
];

export const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'minimal', label: 'Minimal / ATS' },
  { id: 'creative', label: 'Creative' },
  { id: 'professional', label: 'Professional' },
];
