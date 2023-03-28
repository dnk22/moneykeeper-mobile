import { Image, ScrollView, View } from 'react-native';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import { transactionCategoryIcon } from 'assets/images/transactionCategory';
import { useNavigation } from '@react-navigation/native';
import { UPDATE_TRANSACTION_CATEGORY } from 'navigation/constants';
import { TransactionCategoryParamProps } from 'navigation/types';
import styles from './styles';

const images = Object.entries(transactionCategoryIcon);
function IconSelect() {
  const navigation = useNavigation<TransactionCategoryParamProps<'icon_select'>['navigation']>();
  const onIconPress = (iconName: string) => {
    navigation.navigate({
      name: UPDATE_TRANSACTION_CATEGORY,
      params: { icon: iconName },
      merge: true,
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {images.map(([key, value]) => {
          const DEFAULT_IMAGE = Image.resolveAssetSource(value).uri;
          return (
            <View style={styles.icon}>
              <TouchableHighlightComponent onPress={() => onIconPress(key)}>
                <Image style={{ width: 50, height: 50 }} source={{ uri: DEFAULT_IMAGE }} />
              </TouchableHighlightComponent>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

export default IconSelect;
