import { StyleSheet } from 'react-native';
import { colors } from '../../helpers/colors';

const style = StyleSheet.create({
  text: {
    marginHorizontal: 16,
    marginVertical: 16,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    padding: 6,
    marginHorizontal: 16,
  },
  iosInput: {
    paddingVertical: 12,
  },
  button: {
    marginTop: 16,
    marginBottom: 24,
    marginHorizontal: 16,
  },

  // Chat modal
  chatList: {
    padding: 16,
  },
  chatMessageContainer: {
    flexDirection: 'row',
  },
  driverText: {
    maxWidth: 280,
    minWidth: 50,
    padding: 12,
    backgroundColor: colors.lightGrey,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 6,
  },
  clientText: {
    maxWidth: 280,
    minWidth: 100,
    backgroundColor: colors.orange,
    color: colors.textEnv,
    padding: 12,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopRightRadius: 0,
  },
  driverChatContainer: {
    justifyContent: 'flex-start',
    marginVertical: 6,
    maxWidth: '80%',
  },
  clientChatContainer: {
    justifyContent: 'flex-end',
    marginVertical: 6,
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  chatAvatar: {
    width: 36,
    height: 36,
    marginLeft: 12,
    borderRadius: 21,
  },
  driverAvatar: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 18,
  },
});

export default style;
