import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  button: {
    backgroundColor: colors.orange,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  disabled: {
    backgroundColor: colors.backgroundGrey,
  },
  imageWrap: {
    paddingVertical: 12,
  },
  buttonText: {
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textEnv,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
  },
  image: {
    width: 44,
    height: 17,
  },
});

export default style;
