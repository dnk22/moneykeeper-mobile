import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  InputSearch,
  FlatListComponent,
  TouchableHighlightComponent,
  SvgIcon,
  RNText,
} from 'components/index';
import styles from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BankRouteProp } from 'navigation/types';
import { getBanksDataLocal } from 'database/querying';
import { useAppDispatch } from 'store/index';
import { setBankSelected } from 'store/account/account.slice';
import { TBank } from 'database/types';

function BankList() {
  const { params } = useRoute<BankRouteProp>();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const [banks, setBanks] = useState<any>([]);
  const inputSearchPlaceHolder = params?.isWallet ? 'Nhập tên nhà cung cấp' : 'Nhập tên ngân hàng';

  useEffect(() => {
    fetchBanksData();
  }, []);

  const fetchBanksData = async (text?: string) => {
    const res = await getBanksDataLocal({ isWallet: params?.isWallet || false, text });
    setBanks(res);
  };

  const onItemPress = (item: TBank) => {
    dispatch(setBankSelected(item.id));
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: TBank }) => {
    return (
      <TouchableHighlightComponent onPress={() => onItemPress(item)}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <SvgIcon name={item.icon} size={34} preset="transactionType" />
            <View>
              <RNText fontSize={16}>{item.shortName || item.bankName}</RNText>
              {!params?.isWallet && (
                <RNText fontSize={14} style={[styles.subTitle]}>
                  {item.bankName}
                </RNText>
              )}
            </View>
          </View>
        </View>
      </TouchableHighlightComponent>
    );
  };

  const onInputChange = (text: string) => {
    fetchBanksData(text);
  };

  return (
    <View style={styles.body}>
      <InputSearch placeholder={inputSearchPlaceHolder} onChangeText={onInputChange} />
      <View style={styles.list}>
        <FlatListComponent data={banks} renderItem={renderItem} />
      </View>
    </View>
  );
}
export default BankList;
