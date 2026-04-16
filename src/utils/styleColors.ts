// Centralized color constants for form styles
export const FORM_COLORS = {
  // Background colors
  BG_WHITE: '#ffffff',
  BG_LIGHT_GRAY: '#fafbfc',

  // Border colors
  BORDER_GRAY: '#b0b8c1',
  BORDER_GRAY_HOVER: '#8b95a5',
  BORDER_FOCUS: '#3b82f6',
  BORDER_LIGHT: '#cbd5e1',

  // Text colors
  TEXT_DARK: '#111827',
  TEXT_LABEL: '#111827',
  TEXT_PLACEHOLDER: '#9ca3af',
  TEXT_LIGHT: '#4b5563',

  // Button & Accent colors
  ACCENT_BLUE: '#3b82f6',
  ACCENT_BLUE_DARK: '#2563eb',
  ACCENT_BLUE_LIGHT: '#eff6ff',
  BUTTON_HOVER_BG: '#f8fafc',

  // Utility
  BUTTON_HOVER_SHADOW: 'rgba(59, 130, 246, 0.1)',
  BORDER_DEFAULT: '2px',
} as const;

// Inline style helpers
export const formInputStyle = {
  border: `${FORM_COLORS.BORDER_DEFAULT} solid ${FORM_COLORS.BORDER_GRAY}`,
  backgroundColor: FORM_COLORS.BG_LIGHT_GRAY,
  color: FORM_COLORS.TEXT_DARK,
};

export const formInputHoverStyle = {
  borderColor: FORM_COLORS.BORDER_GRAY_HOVER,
  backgroundColor: FORM_COLORS.BG_WHITE,
};

export const formInputFocusStyle = {
  borderColor: FORM_COLORS.BORDER_FOCUS,
  boxShadow: `0 0 0 3px ${FORM_COLORS.BUTTON_HOVER_SHADOW}`,
  backgroundColor: FORM_COLORS.BG_WHITE,
};
