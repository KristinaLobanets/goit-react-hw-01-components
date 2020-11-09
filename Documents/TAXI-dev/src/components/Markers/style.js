import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  image: {
    width: 44,
    height: 60,
  },
  taxiMarker: {
    width: 15,
    height: 35,
  },
  imageSmaller: {
    width: 32,
    height: 42,
  },
  textWrap: {
    marginTop: 5,
  },
  text: {
    alignSelf: 'center',
    color: colors.black,
  },
  textBold: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
  },
  textThin: {
    fontSize: 10,
  },
});

export default style;
