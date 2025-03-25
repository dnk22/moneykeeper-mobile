import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    rowGap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  item: {
    position: 'relative',
    width: 150,
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
  },
  topItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  label: {
    opacity: 0.6,
  },
  title: {
    opacity: 0.6,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  accountIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  noData: {
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  wallet: {
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },

  // Carousel styles
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  carouselItem: {
    paddingHorizontal: 10,
  },
  demoCard: {
    padding: 20,
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  demoIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#5B37B7',
    width: 20,
  },
});

export const demoStyles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  carouselItem: {
    height: 160,
  },
  demoCard: {
    padding: 20,
    borderRadius: 12,
    height: '100%',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  demoIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  indicator: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#D9D9D9',
    marginHorizontal: 4,
  },
  activeIndicator: {
    width: 18,
  },
  description: {
    marginBottom: 5,
    textAlign: 'center',
  },
  addAccountNow: {
    marginTop: 10,
    paddingEnd: 5,
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 5,
  },
});
