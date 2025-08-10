import React, { useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useCustomTheme } from 'resources/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TTransactionsCategory } from 'database/types';
import { ROUTES } from 'navigation/constants/routes';
import ShakeAnimation from 'resources/animations/Shake';
import TouchableHighlightComponent from 'components/TouchableHighlight';
import ImageComponent from 'components/ImageComponent';
import RNText from 'components/Text';
import { CategoryContext } from 'navigation/tabs/TransactionCategoryTabs';
import { TransactionCategoryParamProps } from 'navigation/types';
import { ITEM_WIDTH } from '../../constants.config';
import styles from './styles';

type ParentItemProps = {
  data: TTransactionsCategory & { children?: TTransactionsCategory[] };
};

function ParentItem({ data }: ParentItemProps) {
  const { colors } = useCustomTheme();
  const { isEditable } = useContext(CategoryContext) as { isEditable: boolean };
  const navigation = useNavigation<TransactionCategoryParamProps['navigation']>();
  const { params } = useRoute<any>();

  const onItemCategoryPress = useCallback(
    (category: TTransactionsCategory) => {
      if (isEditable) {
        navigation.navigate(ROUTES.UPDATE_TRANSACTION_CATEGORY, {
          transactionCategoryId: category.id,
        });
      } else {
        if (params?.returnScreen) {
          navigation.popTo(params.returnScreen, { categoryId: category.id });
        }
      }
    },
    [isEditable, navigation, params],
  );

  const children = data?.children || [];

  return (
    <View style={[styles.group, { backgroundColor: colors.surface }]}>
      <TouchableHighlightComponent onPress={() => onItemCategoryPress(data)}>
        <View style={styles.itemHeader}>
          <ShakeAnimation isActiveAnim={isEditable}>
            <View style={styles.iconView}>
              <ImageComponent name={data.icon} size={22} />
            </View>
          </ShakeAnimation>
          <RNText numberOfLines={1} style={styles.headerTitle} fontSize={18}>
            {data.categoryName}
          </RNText>
        </View>
      </TouchableHighlightComponent>

      {children.length > 0 && (
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      )}

      <View style={styles.childView}>
        {children.map((child) => (
          <TouchableHighlightComponent
            key={child.id}
            style={styles.childContent}
            onPress={() => onItemCategoryPress(child)}
          >
            <View style={[styles.itemChild, { width: ITEM_WIDTH }]}>
              <ShakeAnimation isActiveAnim={isEditable}>
                <View style={styles.iconView}>
                  <ImageComponent name={child.icon} size={22} />
                </View>
              </ShakeAnimation>
              <RNText numberOfLines={1} fontSize={12} style={{ opacity: 0.8 }}>
                {child.categoryName}
              </RNText>
            </View>
          </TouchableHighlightComponent>
        ))}
      </View>
    </View>
  );
}

export default React.memo(ParentItem);
