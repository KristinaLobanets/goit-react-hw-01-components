import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  versionText: {
    marginTop: 12,
    textAlign: 'center',
  },
  buttonsContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  buttons: {
    backgroundColor: colors.white,
    marginVertical: 12,
    marginHorizontal: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
});

export default style;
