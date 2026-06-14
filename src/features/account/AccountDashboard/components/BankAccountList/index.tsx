import { memo } from 'react';
import { View } from 'react-native';
import isEqual from 'react-fast-compare';
import RNText from 'components/Text';
import { TAccount } from 'database/types';
import { useCustomTheme } from 'resources/theme';
import { formatNumber } from 'utils/math';
import AccountList from '../AccountList';
import { bankAccountListStyles } from './styles';

type BankAccountListProps = {
  data: TAccount[];
  onRefresh: () => void;
  index: number;
};

function BankAccountList({ data, onRefresh, index }: BankAccountListProps) {
  const { colors } = useCustomTheme();
  const totalBalance = data.reduce((sum, item) => sum + (item.closingAmount ?? 0), 0);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[bankAccountListStyles.totalBalanceContainer, { backgroundColor: colors.surface }]}
      >
        <RNText color={colors.textSecondary} fontSize={12}>
          Ngân hàng
        </RNText>
        <RNText fontSize={20} style={{ fontWeight: '700', marginTop: 4 }}>
          {formatNumber(totalBalance, true)}
        </RNText>
        <RNText color={colors.textSecondary} fontSize={12} style={{ marginTop: 4 }}>
          {data.length} tài khoản ngân hàng đang theo dõi
        </RNText>
      </View>

      <AccountList data={data} onRefresh={onRefresh} index={index} />
    </View>
  );
}

export default memo(BankAccountList, isEqual);
