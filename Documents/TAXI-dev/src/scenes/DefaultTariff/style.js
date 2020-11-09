import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  radioItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  radioIcon: {
    marginRight: 20,
  },
});

export default style;
