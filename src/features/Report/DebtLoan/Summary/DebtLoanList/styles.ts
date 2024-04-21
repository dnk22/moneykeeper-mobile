import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 5,
  },
  personContainer: {
    paddingVertical: 5,
  },
  header: {
    height: 38,
    paddingLeft: 15,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconSwapContainer: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '500',
  },
  divider: {
    width: '100%',
    height: 0.5,
    alignSelf: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 6,
  },
  // item
  item: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  col: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  itemColor: {
    width: 5,
    height: '90%',
    borderRadius: 10,
  },
  accountName: {
    fontWeight: '500',
    gap: 5,
  },
  amountCol: {
    alignItems: 'flex-end',
  },
  amount: {
    maxWidth: 130,
    fontWeight: '500',
  },
  personLogo: {
    width: 38,
    height: 38,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'red',
  },
});
export default styles;
