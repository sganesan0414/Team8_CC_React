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

export const T = {
  displayLarge:   { fontSize: 28, fontWeight: '700' as const, color: C.textPrimary,   lineHeight: 36, letterSpacing: -0.3 },
  headlineMedium: { fontSize: 22, fontWeight: '700' as const, color: C.textPrimary,   lineHeight: 29 },
  titleLarge:     { fontSize: 18, fontWeight: '600' as const, color: C.textPrimary,   lineHeight: 25 },
  bodyLarge:      { fontSize: 17, fontWeight: '400' as const, color: C.textPrimary,   lineHeight: 26 },
  bodyMedium:     { fontSize: 15, fontWeight: '400' as const, color: C.textSecondary, lineHeight: 23 },
  labelLarge:     { fontSize: 16, fontWeight: '600' as const, color: C.textPrimary,   lineHeight: 22 },
  labelMedium:    { fontSize: 14, fontWeight: '500' as const, color: C.textSecondary, lineHeight: 20 },
  caption:        { fontSize: 13, fontWeight: '400' as const, color: C.textMuted,     lineHeight: 18 },
}

export const card = {
  backgroundColor: C.surface,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: C.border,
  padding: 16,
}

export const inputBase = {
  width: '100%' as const,
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: C.border,
  backgroundColor: C.surfaceVariant,
  fontSize: 17,
  color: C.textPrimary,
}

export const btnPrimary = {
  width: '100%' as const,
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 12,
  backgroundColor: C.primary,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 8,
}

export const btnOutlined = {
  width: '100%' as const,
  paddingVertical: 14,
  paddingHorizontal: 24,
  borderRadius: 12,
  backgroundColor: 'transparent' as const,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 8,
  borderWidth: 1.5,
  borderColor: C.border,
}
