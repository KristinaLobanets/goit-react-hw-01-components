import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mapWrapper: {
    flex: 1,
    minHeight: 100,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  headerRow: {
    flexDirection: 'row',
  },
  headerStatus: {
    marginRight: 12,
  },
  originContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  directionsIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  promoLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginHorizontal: 16,
  },
  driverContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
    paddingTop: 4,
    // flex: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    justifyContent: 'space-between',
    marginBottom: 12,
    // flex: 1
  },
  driverWrap: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  driverCarTextWrap: {
    justifyContent: 'space-between',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 18,
  },
  paymentIcon: {
    paddingRight: 8,
  },
  orderInfoContainer: {
    marginHorizontal: 16,
  },
  orderInfoWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // InfoModal
  modalItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingVertical: 12,
  },
  modalItemRowServices: {
    paddingVertical: 12,
  },

  serviceModalContainer: {
    maxHeight: '100%',
    marginTop: 36,
  },
  bottomBox: {
    backgroundColor: colors.lightGrey,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  rateTripRatingStar: {
    marginRight: 6,
  },
  rateTripText: {
    marginBottom: 12,
  },
  backButton: {
    width: 48,
    height: 48,
    position: 'absolute',
    top: 36,
    left: 16,
    borderRadius: 24,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  ratingWrap: {
    // flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    justifyContent: 'flex-end',
  },
});

export default style;
