import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const style = StyleSheet.create({
  logoWrap: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    height: 160,
    width: 160,
  },
  logoLong: {
    height: 116,
    width: width - 16,
  },
});

export default style;
