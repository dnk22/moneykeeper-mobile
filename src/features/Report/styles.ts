import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  list: {
    flex: 1,
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonChangeStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: 60,
    right: 40,
  },
  card: {
    margin: 5,
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textViewHolder: {
    zIndex: 998,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 10,
  },
  textOnImage: {
    color: 'white',
    zIndex: 1000,
  },
});
export default styles;
