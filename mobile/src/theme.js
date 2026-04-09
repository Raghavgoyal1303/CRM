/**
 * LeadFlow CRM — Mobile Build Protocol Design System
 * 
 * Synchronized with the reference app skeleton + website skin.
 * Focuses on Indigo headers (#4F46E5) and 16px card radii.
 */

export const theme = {
  colors: {
    primary: '#4F46E5',        // Solid Indigo Header/Primary
    primaryHover: '#4338CA',
    background: '#F9F7F4',     // Page Background
    surface: '#FFFFFF',        // Card Background
    border: '#F0EEF8',         // Border Color

    text: '#1A1A2E',           // Text Primary
    textSecondary: '#6B7280',  // Text Secondary
    textMuted: '#9CA3AF',      // Text Muted

    success: '#10B981',        // Success
    warning: '#F59E0B',        // Warning
    danger: '#EF4444',         // Danger

    accentLight: '#EEF2FF',    // Light Indigo Tint

    status: {
      new: { bg: '#EFF6FF', text: '#1D4ED8' },
      contacted: { bg: '#F5F3FF', text: '#6D28D9' },
      interested: { bg: '#FFFBEB', text: '#B45309' },
      site_visit: { bg: '#EEF2FF', text: '#4338CA' },
      closed: { bg: '#F0FDF4', text: '#15803D' },
      lost: { bg: '#FFF1F2', text: '#BE123C' },
    }
  },

  shadows: {
    card: {
      shadowColor: '#1A1A2E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },
    premium: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    }
  },

  borderRadius: {
    sm: 8,
    md: 12,       // Button radius
    lg: 16,       // Card radius (reference spec)
    xl: 24,       // Header bottom radius
    full: 9999,   // Badge radius (pill)
  },

  fonts: {
    heading: 'Sora',
    body: 'Inter',
    mono: 'JetBrains Mono',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};
