import { RNText } from 'components/index';
import React from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const Wallet = ({}) => {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.container}>
      <RNText>Walle</RNText>
    </View>
  );
};

export default Wallet;
