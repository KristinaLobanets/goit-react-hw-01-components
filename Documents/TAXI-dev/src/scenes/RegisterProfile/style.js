import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const styles = StyleSheet.create({
  textInputStyle: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    textAlign: 'center',
    fontSize: 16,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  formWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  headerText: {
    paddingBottom: 36,
    paddingHorizontal: 16,
    textAlign: 'center',
    color: colors.black,
  },
  image: {
    height: 160,
    width: 160,
    borderRadius: 80,
  },
  textInputWrap: {
    padding: 10,
    justifyContent: 'center',
    width: '100%',
  },
  checkContainer: {
    paddingHorizontal: 16,
  },
  footerWrap: {
    justifyContent: 'flex-start',
  },
  clearButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    right: 20,
    top: 0,
    bottom: 0,
  },
  datePickerTextIos: {
    width: 272,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
    padding: 10,
    alignSelf: 'center',
    margin: 10,
  },
  datePickerIos: {
    position: 'absolute',
    right: 16,
    top: 0,
    borderRadius: 50,
    backgroundColor: colors.orange,
    padding: 5,
    shadowOffset: { width: 1, height: 1 },
    elevation: 1,
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  inputContainer: {},
  statusIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 24,
    top: 0,
    bottom: 0,
  },
  passButton: {
    flex: 1,
    marginLeft: 12,
  },
  buttons: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  iconDelete: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    borderRadius: 16,
    backgroundColor: colors.smokeGrey,
    minHeight: 20,
    maxHeight: 32,
    alignSelf: 'center',
    padding: 6,
    zIndex: 20,
  },
});

export default styles;
