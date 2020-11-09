import { StyleSheet, Platform } from 'react-native';
import { colors, Dimension } from '../../helpers';

const style = StyleSheet.create({
  // Bell
  bellContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: 138,
    height: 150,
    marginVertical: 24,
  },
  errorText: {
    textAlign: 'center',
    lineHeight: 20,
  },

  // Popup
  bodyContainer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  header: {
    marginTop: 16,
  },
  line: {
    backgroundColor: colors.lightGrey,
    width: '100%',
    marginTop: 14,
    height: 1,
  },
  text: {
    marginVertical: 24,
    textAlign: 'center',
  },
  error: {
    backgroundColor: colors.red,
  },

  // Entrance Modal
  inputModal: {
    margin: 0,
  },
  inputModalContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    backgroundColor: colors.white,
  },
  inputModalWrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },

  // Policies Modal
  subHeader: {
    position: 'absolute',
    top: Dimension.IsIphoneX() ? 50 : Platform.OS === 'ios' ? 25 : Dimension.ScreenHeight() < 640 ? 36 : -5,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});

export default style;
