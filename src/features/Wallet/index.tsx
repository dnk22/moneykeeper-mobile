import React from 'react';
import { Card, PressableHaptic, RNText, SvgIcon } from 'components/index';
import { ScrollView, View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { ADDWALLET } from 'navigation/constants';

function Wallet() {
  const { colors } = useCustomTheme();
  const navigation = useNavigation();

  const onCreateWallet = () => {
    navigation.navigate(ADDWALLET);
  };

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
      <PressableHaptic
        style={[styles.createButton, { backgroundColor: colors.primary }]}
        onPress={onCreateWallet}
      >
        <SvgIcon name="add" size={30} color="white" />
      </PressableHaptic>
    </View>
  );
}

export default Wallet;
