import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  phoneInput: {
    width: 50,
    height: 42,
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 16,
    borderColor: colors.lightGrey,
    borderRadius: 10,
  },
  phoneInputWrap: {
    padding: 12,
  },
  queryContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  changePhoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  resendContainer: {
    marginVertical: 12,
    marginHorizontal: 44,
  },
  resendText: {
    textAlign: 'center',
  },
  borderBlack: {
    borderColor: colors.black,
  },
  borderGrey: {
    borderColor: colors.grey,
  },
});

export default style;
