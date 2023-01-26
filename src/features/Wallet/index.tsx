import React from 'react';
import { RNText } from 'components/index';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import Card from './Card';

const Wallet = ({}) => {
  const { colors } = useCustomTheme();
  return (
    <View style={styles.container}>
      <View style={styles.totalBalance}>
        <RNText style={styles.title}>Tổng tiền: 10000000Đ</RNText>
      </View>
      <ScrollView>
        <Card>
          <View>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
            <RNText>Content</RNText>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default Wallet;
