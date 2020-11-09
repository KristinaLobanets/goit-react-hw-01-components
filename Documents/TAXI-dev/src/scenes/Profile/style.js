import { StyleSheet } from 'react-native';
import { colors, Dimension } from '../../helpers';

const style = StyleSheet.create({
  header: {
    height: 94,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  userContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 24,
  },
  avatarImage: {
    width: 65,
    height: 65,
    borderRadius: 33,
  },
  editButton: {
    backgroundColor: colors.white,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    right: 0,
    elevation: 2,
    padding: 4,
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 16,
    lineHeight: 20,
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
  },
  menuContainer: {
    marginHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    borderBottomColor: colors.lightGrey,
    paddingVertical: 16,
    paddingLeft: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconWrap: {
    minWidth: 30,
    alignItems: 'center',
  },
  menuTitle: {
    flex: 1,
    marginLeft: 16,
  },
  callButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingVertical: Dimension.IsIphoneX() ? 24 : 16,
    backgroundColor: colors.lightGrey,
  },
  callButtonText: {
    marginLeft: 16,
  },
  listColumns: {
    justifyContent: 'center',
  },
  socialIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  socialsContainer: {
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
  },
  redDot: {
    width: 8,
    height: 8,
    alignSelf: 'center',
    backgroundColor: colors.red,
    borderRadius: 4,
    marginRight: 16,
  },
});

export default style;
