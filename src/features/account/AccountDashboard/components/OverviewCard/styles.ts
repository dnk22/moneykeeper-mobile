import { StyleSheet } from 'react-native';

export const overviewCardStyles = StyleSheet.create({
  overviewSection: {
    flexDirection: 'row',
    columnGap: 10,
  },
  overviewCard: {
    flex: 1,
    padding: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 14,
    justifyContent: 'center',
    gap: 6,
  },
  overviewAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  overviewAmount: {
    fontWeight: '600',
  },
  hideButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCard: {
    width: 80,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
