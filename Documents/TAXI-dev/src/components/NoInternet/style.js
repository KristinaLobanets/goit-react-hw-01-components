import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.modal,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5000,
  },
  modal: {
    backgroundColor: colors.white,
    padding: 24,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 1,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 1, height: 1 },
  },
  text: {
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
});

export default style;
