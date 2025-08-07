import React, { useContext } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TTransactionsCategory } from 'database/types';
import { ROUTES, TransactionCategoryContext } from 'navigation/constants/routes';
import get from 'lodash/get';
import size from 'lodash/size';
import ShakeAnimation from 'resources/animations/Shake';
import { ITEM_WIDTH } from '../../constants.config';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import ImageComponent from 'components/ImageComponent';
import RNText from 'components/Text';
import styles from './styles';

type ParentItemProps = {
  disabled?: boolean;
  data: TTransactionsCategory & { children: TTransactionsCategory[] };
};

function ParentItem({ data, disabled }: ParentItemProps) {
  const { colors } = useCustomTheme();
  const { isUpdate } = useContext<any>(TransactionCategoryContext);
  const navigation = useNavigation<any>();
  const { params } = useRoute();

  const onItemCategoryPress = (category: TTransactionsCategory) => {
    if (isUpdate && !disabled) {
      navigation.navigate(ROUTES.UPDATE_TRANSACTION_CATEGORY, {
        transactionCategoryId: category.id,
      });
      return;
    }

    navigation.popTo(params?.returnScreen, { categoryId: category.id });
  };

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <TouchableHighlightComponent onPress={() => onItemCategoryPress(data)}>
        <View style={styles.itemHeader}>
          <ShakeAnimation isActiveAnim={isUpdate && !disabled}>
            <View style={styles.iconView}>
              <ImageComponent name={data.icon} size={22} />
            </View>
          </ShakeAnimation>
          <RNText numberOfLines={1} style={styles.headerTitle} fontSize={18}>
            {data.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>
      {Boolean(size(get(data, 'children', []))) && (
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      )}
      <View style={styles.childView}>
        {get(data, 'children', []).map((children) => (
          <TouchableHighlightComponent
            style={{ padding: 2 }}
            onPress={() => onItemCategoryPress(children)}
            key={children.id}
          >
            <View style={[styles.itemChild, { width: ITEM_WIDTH }]}>
              <ShakeAnimation isActiveAnim={isUpdate && !disabled}>
                <View style={styles.iconView}>
                  <ImageComponent name={children.icon} size={22} />
                </View>
              </ShakeAnimation>
              <RNText numberOfLines={1} fontSize={12} style={{ opacity: 0.8 }}>
                {children.categoryName}
              </RNText>
            </View>
          </TouchableHighlightComponent>
        ))}
      </View>
    </View>
  );
}

export default ParentItem;
