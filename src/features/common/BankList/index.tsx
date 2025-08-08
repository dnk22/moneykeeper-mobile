import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TBank } from 'database/types';
import { fetchBankList } from 'services/api/banks';
import { ROUTES } from 'navigation/constants/routes';
import { BankStackRouteProps } from 'navigation/types';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import InputSearch from 'components/InputSearch';
import FlatListComponent from 'components/FlatList';
import RNText from 'components/Text';
import { BANK_TYPE } from 'utils/constants/account';
import ImageComponent from 'components/ImageComponent';
import styles from './styles';

function BankList() {
  const { params } = useRoute<BankStackRouteProps<typeof ROUTES.BANK_HOME_LIST>>();
  const navigation = useNavigation<any>();
  const [banks, setBanks] = useState<any>([]);

  const inputSearchPlaceHolder =
    params?.type === BANK_TYPE.WALLET ? 'Nhập tên nhà cung cấp' : 'Nhập tên ngân hàng';

  const fetchBanksData = async (text?: string) => {
    const { data = [] } = await fetchBankList({ type: params?.type, text });
    setBanks(data);
  };

  useEffect(() => {
    fetchBanksData();
  }, [params]);

  const onItemPress = (item: TBank) => {
    navigation.popTo(params.returnScreen, {
      bankId: item.id,
      merge: true,
    });
  };

  const renderItem = ({ item }: { item: TBank }) => {
    return (
      <TouchableHighlightComponent onPress={() => onItemPress(item)}>
        <View style={styles.item}>
          <View style={styles.itemContent}>
            <ImageComponent name={item.icon} size={28} />
            <View>
              <RNText fontSize={18}>{item.shortName || item.bankName}</RNText>
              {params?.type === BANK_TYPE.BANK && (
                <RNText preset="subTitle">{item.bankName}</RNText>
              )}
            </View>
          </View>
        </View>
      </TouchableHighlightComponent>
    );
  };

  return (
    <View style={styles.body}>
      <InputSearch placeholder={inputSearchPlaceHolder} onChangeText={fetchBanksData} />
      <View style={styles.list}>
        <FlatListComponent data={banks} renderItem={renderItem} />
      </View>
    </View>
  );
}
export default BankList;
