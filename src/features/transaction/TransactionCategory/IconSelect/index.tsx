import { ScrollView, View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import * as transactionCategoryIcon from 'assets/images/transactionCategory';
import { useNavigation } from '@react-navigation/native';
import { TransactionCategoryParamProps } from 'navigation/types';
import { ROUTES } from 'navigation/constants/routes';
import ImageComponent from 'components/ImageComponent';
import styles from './styles';

const IMAGES = Object.entries(transactionCategoryIcon);

function IconSelect() {
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();

  const handleItemSelect = (iconName: string) => {
    navigation.popTo(ROUTES.UPDATE_TRANSACTION_CATEGORY, { icon: iconName });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {IMAGES.map(([key, value]) => {
          return (
            <View style={styles.icon} key={key}>
              <TouchableHighlightComponent onPress={() => handleItemSelect(key)}>
                <ImageComponent style={{ width: 50, height: 50 }} name={value} />
              </TouchableHighlightComponent>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default IconSelect;
