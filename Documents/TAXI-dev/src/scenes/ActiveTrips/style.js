import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  headerContainer: {
    height: 94,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  rideContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
    elevation: 1,
  },
  rideHeader: {
    paddingTop: 12,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginHorizontal: 12,
  },
  directionsBody: {
    paddingBottom: 14,
    paddingTop: 15,
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  originContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  directionsIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  directionsText: {
    flex: 1,
    marginHorizontal: 8,
  },
  replaceContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  replaceButton: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 100,
  },
  rideFooter: {
    paddingHorizontal: 12,
    borderColor: colors.lightGrey,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingBottom: 9,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  paymentText: {
    marginLeft: 8,
  },
  statusText: {
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
  },
  deleteButton: {
    backgroundColor: colors.white,
  },
  containerBackground: {
    backgroundColor: colors.backgroundGrey,
  },
  preloaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: colors.modal,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ridesListFooter: {
    height: 36,
  },
  driverLabel: {
    marginBottom: 8,
  },
  driverColor: {
    width: 40,
    minHeight: 20,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: 5,
  },
  driverInfo: {
    marginRight: 6,
    flex: 1,
  },
});

export default style;
