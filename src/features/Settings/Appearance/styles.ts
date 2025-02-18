import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 10,
  },
  title: {
    marginLeft: 15,
    marginBottom: 5,
  },
  appearance: {
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 10,
  },
  selectMode: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  itemMode: {
    alignItems: 'center',
    gap: 10,
  },
  itemDemo: {
    width: 120,
    height: 160,
  },
  divider: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
  animatedCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: height * 1.5,
    borderRadius: width,
    top: height / 2 - width * 0.75,
    left: width / 2 - width * 0.75,
    backgroundColor: '#FFF',
  },
  itemColor: {
    width: 24,
    height: 24,
    borderRadius: 30,
    marginBottom: 10,
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 20,
  },
});

export default styles;
