import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  header: {
    minHeight: 90,
    padding: Platform.OS === 'ios' ? 24 : 12,
  },
  backButton: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 12,
    paddingRight: 16,
    color: colors.darkGrey,
  },
  textBig: {
    fontSize: 21,
    color: colors.black,
    marginBottom: 12,
    marginHorizontal: 12,
    fontFamily: 'Montserrat-Bold',
    textAlign: 'left',
  },
  button: {
    marginRight: 18,
  },
});

export default style;
