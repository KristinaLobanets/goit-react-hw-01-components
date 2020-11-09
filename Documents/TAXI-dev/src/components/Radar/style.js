import { StyleSheet } from 'react-native';

const style = StyleSheet.create({
  radar: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 30,
  },
  outer: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  inner: {
    resizeMode: 'contain',
    position: 'absolute',
  },
});

export default style;
