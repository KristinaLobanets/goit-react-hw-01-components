import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  preloader: {
    position: 'absolute',
    backgroundColor: colors.preloader,
    zIndex: 1000,
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default style;
