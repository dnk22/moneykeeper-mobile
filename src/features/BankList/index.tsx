import { useEffect, useState } from 'react';
import { View } from 'react-native';
import {
  InputSearch,
  FlatListComponent,
  TouchableHighlightComponent,
  RNText,
} from 'components/index';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TBank } from 'database/types';
import { BANK_TYPE } from 'utils/constant';
import { ADD_ACCOUNT, BANK_HOME_LIST } from 'navigation/constants';
import { fetchBankData } from 'services/api/banks';
import { BankParamsProps } from 'navigation/types';
import FastImage from 'react-native-fast-image';
import * as BankIcon from 'assets/images/banks';
import styles from './styles';
import IconComponent from 'components/IconComponent';

function BankList() {
  const { params } = useRoute<BankParamsProps<typeof BANK_HOME_LIST>['route']>();
  const navigation = useNavigation<any>();

  const [banks, setBanks] = useState<any>([]);
  const inputSearchPlaceHolder =
    params?.type === BANK_TYPE.WALLET ? 'Nhập tên nhà cung cấp' : 'Nhập tên ngân hàng';

  useEffect(() => {
    fetchBanksData();
  }, []);

  const fetchBanksData = async (text?: string) => {
    const res = await fetchBankData({ type: params?.type, text });
    setBanks(res);
  };

  const onItemPress = (item: TBank) => {
    navigation.navigate({
      name: ADD_ACCOUNT,
      params: { bankId: item.id },
      merge: true,
    });
  };

  const renderItem = ({ item }: { item: TBank }) => {
    return (
      <TouchableHighlightComponent onPress={() => onItemPress(item)}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <IconComponent name={item.icon} size={40} />
            <View>
              <RNText fontSize={16}>{item.shortName || item.bankName}</RNText>
              {params?.type === BANK_TYPE.BANK && (
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
