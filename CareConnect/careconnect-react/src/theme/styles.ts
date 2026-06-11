import type { CSSProperties } from 'react'

export const C = {
  primary: '#1A3FB0',
  primaryLight: '#E8EEFF',
  accent: '#2D7DD2',
  success: '#1A7A4A',
  successBg: '#E6F5EE',
  warning: '#B85C00',
  warningBg: '#FFF3E0',
  infoBg: '#E8EEFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceVariant: '#F0F2F7',
  border: '#CDD2E0',
  textPrimary: '#111827',
  textSecondary: '#374151',
  textMuted: '#6B7280',
  textOnPrimary: '#FFFFFF',
  alertBg: '#FFF8E1',
  alertBorder: '#E6A817',
  red: '#DC2626',
  redBg: '#FEF2F2',
  purple: '#7B3FA0',
} as const

export const T: Record<string, CSSProperties> = {
  displayLarge: { fontSize: 28, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3, letterSpacing: -0.3 },
  headlineMedium: { fontSize: 22, fontWeight: 700, color: C.textPrimary, lineHeight: 1.3 },
  titleLarge: { fontSize: 18, fontWeight: 600, color: C.textPrimary, lineHeight: 1.4 },
  bodyLarge: { fontSize: 17, fontWeight: 400, color: C.textPrimary, lineHeight: 1.5 },
  bodyMedium: { fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: 1.5 },
  labelLarge: { fontSize: 16, fontWeight: 600, color: C.textPrimary, lineHeight: 1.4 },
  labelMedium: { fontSize: 14, fontWeight: 500, color: C.textSecondary, lineHeight: 1.4 },
  caption: { fontSize: 13, fontWeight: 400, color: C.textMuted, lineHeight: 1.4 },
}

export const card: CSSProperties = {
  background: C.surface,
  borderRadius: 16,
  border: `1px solid ${C.border}`,
  padding: 16,
}

export const inputBase: CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: `1.5px solid ${C.border}`,
  background: C.surfaceVariant,
  fontSize: 17,
  color: C.textPrimary,
  outline: 'none',
  transition: 'border-color 0.15s',
}

export const btnPrimary: CSSProperties = {
  width: '100%',
  padding: '16px 24px',
  borderRadius: 12,
  background: C.primary,
  color: C.textOnPrimary,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  transition: 'opacity 0.15s',
}

export const btnOutlined: CSSProperties = {
  width: '100%',
  padding: '14px 24px',
  borderRadius: 12,
  background: 'transparent',
  color: C.textPrimary,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  border: `1.5px solid ${C.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  transition: 'border-color 0.15s',
}
