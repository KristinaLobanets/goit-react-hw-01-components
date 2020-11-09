import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  headerContainer: {
    height: 94,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  button: {
    marginVertical: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  addressContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
  },
  addressInput: {
    color: colors.black,
    marginRight: 36,
    marginLeft: 24,
  },
  autocompleteItem: {
    paddingVertical: 8,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  autocompleteInputContainer: {
    borderWidth: 0,
  },
  autocomplete: {
    marginHorizontal: 8,
    borderWidth: 0,
  },
  iconRemove: {
    position: 'absolute',
    top: 0,
    right: 16,
    bottom: 0,
    justifyContent: 'center',
  },
  iconMyAddress: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  specContainer: {
    flexDirection: 'row',
    paddingTop: 21,
  },
  objectContainer: {
    flex: 1,
  },
  entranceContainer: {
    marginLeft: 24,
  },
  label: {
    fontSize: 12,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingLeft: 0,
  },
  commentInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingLeft: 0,
  },
  commentContainer: {
    paddingTop: 21,
  },
  iconsContainer: {
    paddingTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textInputDefault: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  iconWrap: {
    height: 36,
    width: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savedText: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
    marginVertical: 16,
  },
  iosInput: {
    paddingVertical: 12,
    marginTop: 6,
  },
  iosInputBase: {
    paddingVertical: 12,
  },
});

export default style;
