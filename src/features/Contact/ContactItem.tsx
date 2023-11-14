import React from 'react';
import { View } from 'react-native';
import { RNText, TouchableHighlightComponent } from 'components/index';
import styles from './styles';

function ContactItem({
  item,
  colors,
  onItemPress,
}: {
  item: any;
  colors: any;
  onItemPress: (item: string) => void;
}) {
  return (
    <TouchableHighlightComponent
      style={{ backgroundColor: colors.surface }}
      onPress={() => onItemPress(item.contactName)}
    >
      <View style={[styles.contactItem, { borderBottomColor: colors.divider }]}>
        <View style={[styles.contactAvt, { backgroundColor: colors.background }]}>
          <RNText>{item.contactName.charAt(0).toLocaleUpperCase()}</RNText>
        </View>
        <RNText style={{ flex: 1 }}>{item.contactName}</RNText>
      </View>
    </TouchableHighlightComponent>
  );
}
export default ContactItem;
