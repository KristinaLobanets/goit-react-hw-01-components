import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  header: {
    padding: 0,
    marginBottom: 23,
    marginHorizontal: 16,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  cardInputContainer: {
    marginBottom: 24,
  },
  textLabel: {
    marginBottom: 6,
  },
  simpleTextInput: {
    height: 33,
    borderWidth: 0.5,
    borderColor: colors.blue,
    flex: 1,
    fontSize: 17,
    padding: 6,
    borderRadius: 6,
  },
  inputsRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  expireWrap: {
    flex: 1,
    marginRight: 12,
  },
  inputsDateRow: {
    flexDirection: 'row',
    flex: 1,
  },
  inputBordersRight: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  inputBordersLeft: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  cvvWrap: {
    flex: 1,
    marginLeft: 12,
  },
  buttonContainer: {
    marginVertical: 24,
  },
  button: {
    paddingVertical: 4,
  },
});

export default style;
