import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  infoText: {
    lineHeight: 20,
  },
  giftBox: {
    width: 160,
    height: 160,
  },
  giftWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoContainer: {
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
  },
  promoString: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
  },
  promoWrap: {
    justifyContent: 'space-between',
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  dropdownText: {
    marginVertical: 16,
  },
});

export default style;
