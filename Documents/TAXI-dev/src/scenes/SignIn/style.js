import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    marginHorizontal: 36,
    marginTop: 24,
  },
  textInput: {
    paddingVertical: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  statusIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 16,
    top: 0,
    bottom: 0,
  },
  footerText: {
    flex: 1,
    lineHeight: 20,
    fontSize: 12,
    marginRight: 6,
  },
  footerLink: {
    textDecorationLine: 'underline',
    color: colors.blue,
    fontFamily: 'Montserrat-SemiBold',
  },
  promoContainer: {
    marginHorizontal: 24,
    marginTop: 12,
  },
  promoTextUnderline: {
    textDecorationLine: 'underline',
  },
  promoText: {
    color: colors.darkGrey,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default style;
