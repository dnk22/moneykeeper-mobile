import { View } from 'react-native';
import {
  InputSearch,
  FlatListComponent,
  TouchableHighlightComponent,
  SvgIcon,
  RNText,
} from 'components/index';
import styles from './styles';
import { useCustomTheme } from 'resources/theme';
import { useRoute } from '@react-navigation/native';
import { BankRouteProp } from 'navigation/types';

function BankList() {
  const { colors } = useCustomTheme();
  const { params } = useRoute<BankRouteProp>();
  const renderItem = ({ item }: { item: any }) => {
    const onPress = () => {};

    return (
      <TouchableHighlightComponent onPress={onPress}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} preset="transactionType" />
            <View>
              <RNText style={[styles.title, { color: colors.text }]}>{item.shortName}</RNText>
              <RNText fontSize={12} style={[styles.subTitle, { color: colors.text }]}>
                {item.bankName || item.name}
              </RNText>
            </View>
          </View>
        </View>
      </TouchableHighlightComponent>
    );
  };
  const onInputChange = (text: string) => {};

  return (
    <View>
      <View style={styles.header}>
        <RNText>{params?.isWallet ? 'Chọn nhà cung cấp' : 'Chọn ngân hàng'}</RNText>
      </View>
      <View style={styles.body}>
        <InputSearch
          placeholder="Nhập tên ngân hàng"
          onChangeText={onInputChange}
          backgroundColor={colors.surface}
        />
        <FlatListComponent data={[]} renderItem={renderItem} />
      </View>
    </View>
  );
}
export default BankList;
