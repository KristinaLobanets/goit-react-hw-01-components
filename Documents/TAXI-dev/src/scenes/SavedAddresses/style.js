import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  houseHeader: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  houseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    marginHorizontal: 16,
    paddingVertical: 12,
  },
  houseAddresses: {
    marginLeft: 20,
    marginRight: 'auto',
    flex: 1,
  },
  icon: {
    padding: 8,
  },
});

export default style;
