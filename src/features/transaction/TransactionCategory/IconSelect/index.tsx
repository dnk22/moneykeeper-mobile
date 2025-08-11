import { View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import * as transactionCategoryIcon from 'assets/images/transactionCategory';
import { useNavigation } from '@react-navigation/native';
import { TransactionCategoryParamProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import ImageComponent from 'components/ImageComponent';
import FlatListComponent from 'components/FlatList';
import styles from './styles';

const IMAGES = Object.entries(transactionCategoryIcon);

function IconSelect() {
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();

  const handleItemSelect = (iconName: string) => {
    navigation.popTo(ROUTES.UPDATE_TRANSACTION_CATEGORY, { icon: iconName });
  };

  const renderItem = ({ item }: { item: [string, any] }) => {
    const [key, value] = item;
    return (
      <View style={styles.icon}>
        <TouchableHighlightComponent onPress={() => handleItemSelect(key)}>
          <ImageComponent style={{ width: 50, height: 50 }} name={value} />
        </TouchableHighlightComponent>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatListComponent
        data={IMAGES}
        renderItem={renderItem}
        numColumns={4}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={{ padding: 8, paddingVertical: 20 }}
      />
    </View>
  );
}

export default IconSelect;
