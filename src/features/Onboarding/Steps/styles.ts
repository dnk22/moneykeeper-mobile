import { StyleSheet } from 'react-native';

export const commonStyle = StyleSheet.create({
  title: {
    fontWeight: '400',
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});

export const welComeStyles = StyleSheet.create({
  image: {
    width: '100%',
    height: 260,
  },
  note: {
    alignItems: 'center',
    gap: 2,
  },
  subTitle: {
    textAlign: 'center',
    width: '90%',
    opacity: 0.6,
  },
});

export const themeStyles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 24,
  },
  imageContainer: {
    width: '60%',
    height: 268,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  form: {
    marginTop: 24,
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
    gap: 16,
  },
  item: {
    width: '94%',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const endBoardingStyle = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '45%',
    padding: 8,
    borderRadius: 8,
  },
  stepLoading: {
    flex: 1,
    paddingLeft: 24,
  },
});
