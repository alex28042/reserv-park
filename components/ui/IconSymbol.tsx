// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'car.fill': 'directions-car',
  'arrow.2.circlepath': 'refresh',
  'magnifyingglass': 'search',
  'megaphone.fill': 'campaign',
  'location.fill': 'location-on',
  'checkmark.circle.fill': 'check-circle',
  'message.fill': 'message',
  'building.2.fill': 'business',
  'clock.fill': 'schedule',
  'creditcard.fill': 'credit-card',
  'calendar': 'event',
  'person.fill': 'person',
  'star.fill': 'star',
  'car': 'directions-car',
  'eurosign.circle': 'euro-symbol',
  'eurosign.circle.fill': 'euro-symbol',
  'list.bullet': 'format-list-bulleted',
  'gear': 'settings',
  'bell.fill': 'notifications',
  'shield.fill': 'security',
  'questionmark.circle': 'help',
  'calendar.badge.exclamationmark': 'event-busy',
  'plus': 'add',
  'map.fill': 'map',
  'funnel.fill': 'filter-list',
  'arrow.up.arrow.down': 'swap-vert',
  'gearshape.fill': 'settings',
  'questionmark.circle.fill': 'help',
  'info.circle.fill': 'info',
  'arrow.right.square.fill': 'logout',
} as any;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
