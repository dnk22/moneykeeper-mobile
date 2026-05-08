import { ScrollView, View } from 'react-native';
import RNText from 'components/Text';
import PressableHaptic from 'components/PressableHaptic';
import { ACCOUNT_TYPE_ALL, ACCOUNT_TYPE_LIST } from 'utils/constants/account';
import useAccountTypeTabs from '../../hooks/useAccountTypeTabs';
import { accountTypeTabsStyles as styles } from './styles';

type AccountTypeTabsProps = {
  pageIndex: number;
  onChangePageIndex: (index: number) => void;
  colors: {
    divider: string;
    surface: string;
    text: string;
  };
};

function AccountTypeTabs({ pageIndex, onChangePageIndex, colors }: AccountTypeTabsProps) {
  const { scrollRef, onTabLayout, onLayout, onContentSizeChange } = useAccountTypeTabs({
    pageIndex,
  });
  const accountTypeTabs = [ACCOUNT_TYPE_ALL, ...ACCOUNT_TYPE_LIST];

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      style={styles.tabScroll}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      bounces={false}
    >
      {accountTypeTabs.map((accountType, index) => {
        const isActive = pageIndex === index;

        return (
          <View key={accountType.id} onLayout={onTabLayout(index)}>
            <PressableHaptic
              style={[
                styles.tabItem,
                {
                  borderColor: colors.divider,
                  backgroundColor: isActive ? '#000' : colors.surface,
                },
              ]}
              onPress={() => onChangePageIndex(index)}
            >
              <RNText
                fontSize={14}
                color={isActive ? '#ffffff' : colors.text}
                style={styles.tabText}
              >
                {accountType.name}
              </RNText>
            </PressableHaptic>
          </View>
        );
      })}
    </ScrollView>
  );
}

export default AccountTypeTabs;
