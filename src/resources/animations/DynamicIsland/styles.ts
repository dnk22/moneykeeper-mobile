import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    zIndex: 9,
    position: 'absolute',
    alignItems: 'center',
  },
  popup: {
    zIndex: 10,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

export default styles;
