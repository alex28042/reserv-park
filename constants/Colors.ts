/**
 * ReservPark Color Palette
 * Modern and elegant colors for the parking reservation app
 */

// Brand Colors
const brandTeal = '#3A7A6B';      // Primary teal/green
const brandGreen = '#6CB89A';     // Secondary green
const brandBeige = '#F0DBA8';     // Accent beige/gold
const brandDark = '#1B3A3F';      // Dark background

const tintColorLight = brandTeal;
const tintColorDark = brandBeige;

export const Colors = {
  light: {
    text: '#1B3A3F',
    background: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6CB89A',
    tabIconDefault: '#8A9BA8',
    tabIconSelected: tintColorLight,
    primary: brandTeal,
    secondary: brandGreen,
    accent: brandBeige,
    surface: '#F8F9FA',
    border: '#E2E8F0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    text: '#F0DBA8',
    background: brandDark,
    tint: tintColorDark,
    icon: '#6CB89A',
    tabIconDefault: '#8A9BA8',
    tabIconSelected: tintColorDark,
    primary: brandGreen,
    secondary: brandTeal,
    accent: brandBeige,
    surface: '#2D4A50',
    border: '#3A5A62',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
};
