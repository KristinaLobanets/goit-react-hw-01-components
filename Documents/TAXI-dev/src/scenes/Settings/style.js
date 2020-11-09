import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  group: {
    borderRadius: 10,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  body: {
    marginHorizontal: 16,
    flexGrow: 1,
  },
  button: {
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 16,
  },
  lang: {
    flexDirection: 'row',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iosback: {
    paddingRight: 12,
  },
  modalItemsList: {
    flex: 1,
    margin: 16,
  },
  methodName: {
    flexBasis: '80%',
    fontSize: 16,
  },
  langName: {
    fontSize: 16,
  },

  // SettingsItem.js
  settingsItemContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    marginHorizontal: 16,
    alignItems: 'center',
    borderBottomColor: colors.lightGrey,
  },
  logoutText: {
    color: colors.red,
    fontSize: 14,
    marginLeft: 16,
  },
  optionPress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  option: {
    marginRight: 16,
  },
  modalHeaderIos: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginVertical: 12,
  },
});

export default style;
