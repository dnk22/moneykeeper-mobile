import React from 'react';
import { RNText } from 'components/index';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';

const AddWallet = ({}) => {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.container}>
      <View style={styles.totalBalance}>
        <RNText style={styles.title}>Tổng tiền: 10000000Đ</RNText>
      </View>
    </View>
  );
};

export default AddWallet;
