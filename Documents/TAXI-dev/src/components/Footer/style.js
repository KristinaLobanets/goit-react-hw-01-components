import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  footerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 68,
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  footerButton: {
    width: 36,
    height: 36,
    borderRadius: 21,
  },
  leftElement: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  stepItem: {
    width: 8,
    height: 8,
    backgroundColor: colors.grey,
    margin: 6,
    borderRadius: 50,
  },
  stepItemColored: {
    backgroundColor: colors.orange,
    borderWidth: 2,
    borderColor: colors.grey,
    width: 9,
    height: 9,
  },
});

export default style;
