import { StyleSheet, Platform } from 'react-native';
import { colors, Dimension } from '../../helpers';
import env from '../../env';

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  addressOverlay: {
    position: 'absolute',
    top: '14%',
    left: 0,
    right: 0,
    bottom: Platform.OS === 'ios' ? undefined : 0,
  },
  markerStub: {
    opacity: 0,
  },
  overlay: {
    position: 'absolute',
    top: '42%',
    bottom: '50%',
    right: 0,
    left: 0,
    alignItems: 'center',
  },

  // Footer
  mapFooter: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingHorizontal: 16,
    marginBottom: Dimension.IsIphoneX() ? 16 : undefined,
  },
  footerInner: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textButtons: {
    paddingHorizontal: 6,
    fontSize: 16,
    color: colors.black,
  },
  historyButtons: {
    backgroundColor: colors.white,
    height: 44,
  },
  footerButtonContainer: {
    flex: 1,
    paddingRight: 21,
  },
  whiteButton: {
    backgroundColor: colors.white,
    marginVertical: 0,
    paddingVertical: 6,
  },
  addressButtonContainer: {
    flex: 1,
    marginRight: 16,
  },
  nextButton: {
    width: 42,
    height: 42,
  },

  // Header
  mapHeader: {
    width: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  mapHeaderButtonRow: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    padding: 16,
  },
  mapHeaderImg: {
    height: 36,
    width: 36,
    borderRadius: 18,
  },
  mapHeaderLocation: {
    height: 36,
    width: 36,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  profileIcon: {
    borderWidth: 1,
    borderRadius: 18,
  },
  activeTrips: {
    backgroundColor: env.app_color,
    padding: 12,
    alignItems: 'center',
    paddingTop: Dimension.IsIphoneX() ? 25 + 12 : Platform.OS === 'ios' ? 25 : 12,
  },
  // unused
  mapHeaderCity: {
    height: 36,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 16,
    flex: 1,
    marginHorizontal: 24,
  },
  cityText: {
    flex: 1,
  },

  // OverlayText
  overlayContainer: {
    alignItems: 'center',
  },
  overlayAddressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
  },
  overlayText: {
    fontSize: 22,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  overlayLinkWrap: {
    marginTop: 12,
  },

  // TaxiInfo
  taxiInfoContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    position: 'absolute',
    bottom: 0,
    height: '40%',
  },
  taxiInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 31,
    marginLeft: 21,
    marginTop: 19,
    marginBottom: 10,
  },
  taxiInfoIconWrap: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.orange,
    width: 19,
    height: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 62,
  },
  taxiInfoHeaderText: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 8,
    marginRight: 76,
  },
  taxiInfoRatingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taxiInfoLine: {
    flex: 1,
    height: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
  },
  taxiInfoRating: {
    marginHorizontal: 16,
  },
  taxiInfoCarContainer: {
    marginLeft: 16,
    flexDirection: 'row',
    marginTop: 13,
  },
  taxiInfoCarInfo: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    marginRight: 12,
  },
  taxiInfoOptions: {
    margin: 16,
    paddingBottom: 16,
  },
  taxiInfoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: Dimension.IsIphoneX() ? 20 : 14,
    paddingRight: 14,
    backgroundColor: colors.lightGrey,
  },
  taxiInfoColor: {
    width: 40,
    height: 15,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: 5,
    flex: 1,
    alignSelf: 'center',
  },
});

export default style;
