import React from 'react';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import RNText from 'components/Text';
import styles from './styles';

const Savings = ({}) => {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.container}>
      <View style={styles.totalBalance}>
        <RNText style={styles.title}>Tổng tiền: 10000000Đ</RNText>
      </View>
      <ScrollView>{/* <Card /> */}</ScrollView>
    </View>
  );
};

export default Savings;
