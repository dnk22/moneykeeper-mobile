import { StyleSheet } from 'react-native';
import { SCREEN_WIDTH } from 'share/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  header: {
    padding: 5,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  col: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    marginTop: 8,
  },
  title: {
    opacity: 0.7,
    fontWeight: '300',
  },
  value: {
    maxWidth: SCREEN_WIDTH / 3,
    fontWeight: '400',
  },
  dateView: {
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 20,
  },
  itemDate: {
    gap: 4,
  },
  flatList: {
    flex: 1,
    marginTop: 10,
  },
  divider: {
    height: 0.5,
    width: '95%',
    alignSelf: 'center',
  },
  // item
  itemDetailContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerColor: {
    width: 4,
    height: 60,
    position: 'absolute',
    left: 0,
  },
  headerItem: {
    gap: 8,
    height: 50,
    paddingHorizontal: 15,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  day: {
    fontWeight: '500',
  },
  childItem: {
    height: 48,
    width: '96%',
    paddingHorizontal: 10,
    marginTop: 4,
    borderRadius: 8,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
  },
  descriptions: {
    fontStyle: 'italic',
    fontWeight: '300',
  },
  colRight: {
    alignItems: 'flex-end',
  },
  accountName: {
    gap: 2,
    flexDirection: 'row',
  },
  gap2: { gap: 2 },
});
export default styles;
