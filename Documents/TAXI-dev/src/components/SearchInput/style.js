import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  textInputWrap: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  textInput: {
    paddingRight: 44,
    paddingLeft: 36,
    backgroundColor: colors.lightGrey,
    paddingVertical: 12,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    borderRightWidth: 1,
    borderRightColor: colors.backgroundGrey,
    color: colors.black,
  },
  iconMyAddress: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  iconRemove: {
    position: 'absolute',
    top: 0,
    right: 8,
    bottom: 0,
    justifyContent: 'center',
  },
  loader: {
    width: 10,
    height: 10,
  },
  mapButtonContainer: {
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
  },
  mapButtonText: {
    marginLeft: 6,
  },
});

export default style;
