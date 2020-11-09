import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  // Address
  containerTab: {
    flex: 1,
    backgroundColor: colors.white,
  },
  autocompleteItem: {
    paddingVertical: 12,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1,
    marginHorizontal: 16,
  },
  destSceneTopLabel: {
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  destSceneTopLabelText: {
    marginLeft: 16,
  },
  autocompleteInputContainer: {
    borderWidth: 0,
  },
  autocomplete: {
    marginHorizontal: 8,
    borderWidth: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },

  // AddressList
  stubContainer: {
    alignItems: 'center',
    margin: 16,
    flex: 1,
    justifyContent: 'center',
  },
  stubLink: {
    marginTop: 10,
    color: colors.black,
    textDecorationLine: 'underline',
  },
  noAddressText: {
    fontSize: 18,
  },

  // AddressElement
  container: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  iconLeft: {
    paddingRight: 16,
  },
  iconRight: {
    paddingLeft: 12,
  },
  textContainer: {
    justifyContent: 'space-around',
  },
});

export default style;
