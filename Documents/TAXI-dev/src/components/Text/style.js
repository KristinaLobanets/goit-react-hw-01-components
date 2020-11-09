import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  header: {
    fontSize: 21,
    color: colors.black,
    fontFamily: 'Montserrat-Bold',
    padding: 24,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    fontFamily: 'Montserrat-Medium',
  },
  smallText: {
    fontSize: 12,
    color: colors.darkGrey,
    fontFamily: 'Montserrat-Medium',
  },
  smallRegular: {
    fontSize: 12,
    color: colors.darkGrey,
  },
  smallBlackText: {
    fontSize: 12,
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
  },
  normalText: {
    fontSize: 14,
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
  },
  modalTitle: {
    fontSize: 18,
    color: colors.black,
    lineHeight: 22,
    fontFamily: 'Montserrat-SemiBold',
    textAlign: 'center',
  },
  defaultFont: {
    fontFamily: 'Montserrat-Regular',
    color: colors.darkGrey,
  },
});

export default style;
