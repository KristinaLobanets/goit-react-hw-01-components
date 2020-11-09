import { StyleSheet, Platform } from 'react-native';
import { colors, Dimension } from '../../helpers';

const style = StyleSheet.create({
  // index.js
  rootContainer: {
    flex: 1,
    backgroundColor: colors.lightGrey,
  },
  mapWrapper: {
    flex: 1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    bottom: -30,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bottomNavigationView: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  slider: {
    backgroundColor: colors.lightGrey,
    width: '100%',
    maxHeight: 131,
  },

  // DirectionsForm.js
  addressWrap: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 97,
    paddingHorizontal: 16,
  },
  directionWrap: {
    position: 'absolute',
    height: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    left: 26.5,
    paddingBottom: 3,
  },
  buttonAddressWrap: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    marginRight: 12,
    flex: 1,
  },
  inputEntrance: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    borderRadius: 10,
    textAlign: 'center',
  },
  inputContainer: {
    marginVertical: 12,
    width: 65,
  },
  buttonAddressRight: {
    justifyContent: 'center',
    marginLeft: 16,
  },
  lineDirections: {
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    left: 36,
  },
  iconInner: {
    paddingHorizontal: 8,
    height: '100%',
    textAlignVertical: 'center',
    textAlign: 'center',
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInner: {
    paddingHorizontal: 8,
    textAlignVertical: 'center',
    flexShrink: 1,
  },
  dot: {
    marginHorizontal: 10,
  },
  dirFormTextColor: {
    color: colors.darkGrey,
  },

  // CarList.js
  carWrap: {
    width: 92,
    marginRight: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  carContainer: {
    zIndex: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 10,
    width: '100%',
    paddingLeft: 8,
    paddingTop: 10,
    paddingBottom: 6,
  },
  carTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carTypeText: {
    flex: 1,
  },
  carBell: {
    paddingRight: 4,
    alignSelf: 'center',
  },
  carImgContainer: {
    justifyContent: 'center',
    marginVertical: 4,
  },
  carImg: {
    width: 76,
    height: 28,
  },
  carPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carPriceText: {
    marginLeft: 4,
  },
  carOverlay: {
    backgroundColor: colors.white,
    opacity: 0.7,
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: 10,
    zIndex: 12,
  },
  iconWrap: {
    zIndex: 105,
    position: 'absolute',
    left: 38,
    top: -8,
    width: 16,
    height: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapPassive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGrey,
  },
  iconWrapActive: {
    backgroundColor: colors.orange,
  },
  carScroll: {
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  // BottomControls.js
  bottomContainer: {
    paddingHorizontal: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingTop: 12,
  },
  option: {
    justifyContent: 'space-between',
  },
  optionLast: {
    justifyContent: 'space-between',
    flex: 1,
  },
  optionCentral: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: colors.lightGrey,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginLeft: 24,
    marginRight: 16,
    minWidth: 100,
  },
  optionText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  buttonNowWrap: {
    flex: 1,
  },
  buttonLaterWrap: {
    width: 124,
    paddingLeft: 16,
  },
  buttonNow: {
    height: 50,
  },
  buttonLater: {
    height: 50,
    backgroundColor: colors.grey,
  },
  paymentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  paymentText: {
    marginLeft: 6,
  },

  // Header.js
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'absolute',
    height: 60,
    top: Dimension.IsIphoneX() ? 25 : Platform.OS === 'ios' ? 15 : 0,
    right: 0,
    zIndex: 20,
  },
  headerBackButton: {
    height: 40,
    width: 40,
    backgroundColor: colors.white,
    justifyContent: 'center',
    borderRadius: 100,
  },
  headerTypeButtonWrap: {
    marginLeft: 32,
  },
  headerTypeButton: {
    width: 200,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  cancelButtonContainer: {
    marginLeft: 10,
  },
  headerButton: {
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 100,
  },
  headerButtonIcon: {
    marginHorizontal: 12,
  },
  moreTaxiButtonContainer: {
    flex: 1,
    marginLeft: 10,
  },

  // InfoCard.js
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoTypeText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },
  infoBlock: {
    marginVertical: 16,
  },
  infoImage: {
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    textAlign: 'center',
  },
  infoCars: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  infoProsHeader: {
    marginTop: 16,
    marginBottom: 3,
  },
  infoProsHeaderText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
  },
  infoPros: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
    marginRight: 8,
  },
  infoProsText: {
    lineHeight: 18,
    paddingLeft: 12,
    color: colors.black,
    marginLeft: 0,
  },
  fareInfo: {
    lineHeight: 18,
    marginVertical: 5,
    color: colors.black,
    textAlign: 'center',
    width: '100%',
  },

  // Comment.js
  commentContainer: {
    width: '100%',
    minHeight: 200,
    marginTop: 24,
  },
  commentScroll: {
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
  },
  commentInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  commentIcon: {
    position: 'absolute',
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  commentStub: {
    flex: 1,
  },
  commentHeader: {
    marginHorizontal: 24,
  },
  commentInputContainer: {
    paddingVertical: 16,
    marginHorizontal: 24,
  },

  // SearchTaxi.js
  bottomNavigationViewSearch: {
    width: '100%',
  },
  directionsContainer: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  directionsHeaderContainer: {
    paddingBottom: 12,
  },
  directionsHeader: {
    fontSize: 18,
    fontFamily: 'Montserrat-SemiBold',
    color: colors.black,
  },
  originContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  destinationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingTop: 12,
  },
  directionsIconContainer: {
    width: 14,
    justifyContent: 'center',
  },
  directionsText: {
    paddingLeft: 8,
  },
  searchTextWrap: {
    justifyContent: 'space-between',
  },
  searchPaymentWrap: {
    flexDirection: 'row',
    paddingTop: 4,
    alignItems: 'center',
  },
  searchOptionsContainer: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: Dimension.IsIphoneX() ? 24 : 16,
    justifyContent: 'space-between',
  },
  optionHeaderWrap: {
    paddingTop: 12,
  },
  optionHeaderText: {
    fontSize: 12,
  },
  optionBodyWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBodyText: {
    color: colors.black,
    fontWeight: 'bold',
  },

  // Modals
  modalContainer: {
    marginVertical: 16,
  },
  modalHeader: {
    marginHorizontal: 24,
  },
  lineTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  line: {
    borderBottomWidth: 1,
    flex: 1,
    height: 1,
    borderBottomColor: colors.lightGrey,
  },
  lineText: {
    textAlign: 'center',
    marginHorizontal: 12,
  },

  // CancelModal.js
  modalBody: {
    marginHorizontal: 24,
  },
  reason: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  reasonRadio: {
    marginHorizontal: 2,
  },
  reasonTextContainer: {
    marginLeft: 12,
  },

  // CancelInfoModal.js
  reasonInfo: {
    marginHorizontal: 24,
    paddingBottom: 16,
  },
  reasonInfoText: {
    color: colors.black,
    textAlign: 'center',
  },
  infoBlockCancel: {
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey,
    marginHorizontal: 24,
    paddingTop: 16,
  },
  infoBlockText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
    fontFamily: 'Montserrat-Medium',
  },

  // DriverInfo.js
  driverInfoRatingStar: {
    marginHorizontal: 2,
  },
  driverInfoPaymentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
  },
  driverInfoCentralIcon: {
    marginHorizontal: 24,
  },
  driverContainer: {
    backgroundColor: colors.white,
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  driverOptionsContainer: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: Dimension.IsIphoneX() ? 24 : 16,
    justifyContent: 'space-between',
  },
  driverInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    justifyContent: 'space-between',
  },
  driverCarInfo: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    justifyContent: 'space-between',
  },
  driverCarTextWrap: {
    justifyContent: 'space-between',
  },
  driverNameContainer: {
    flexDirection: 'row',
  },
  driverAvatar: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 18,
  },
  driverCarColor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverMessage: {
    flexDirection: 'row',
    paddingRight: 16,
    paddingLeft: 16,
    paddingVertical: 12,
  },
  paymentIcon: {
    paddingRight: 8,
  },
  driverChatButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // NoTaxi.js
  noTaxiContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  noTaxiButton: {
    marginTop: 16,
  },

  // OverPrice.js
  overpriceContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  overpriceHeaderText: {
    marginHorizontal: 36,
    marginVertical: 12,
  },
  overpriceRiseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    backgroundColor: colors.lightGrey,
    paddingVertical: 10,
  },
  overPriceText: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
  },
  overPriceTextBold: {
    color: colors.black,
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
  },
  overPriceComment: {
    paddingLeft: 16,
    paddingRight: 23,
    marginTop: 16,
    marginBottom: 24,
  },
  overpriceOptions: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 14,
    paddingVertical: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    paddingBottom: Dimension.IsIphoneX() ? 16 : undefined,
  },
  overpriceLineContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    alignItems: 'center',
    marginBottom: 16,
  },

  // DriverArrive.js
  driverArriveHeader: {
    flexDirection: 'row',
    paddingTop: 16,
    marginHorizontal: 21,
    justifyContent: 'center',
  },
  driverArriveHeaderText: {
    flex: 1,
  },
  driverArriveRating: {
    justifyContent: 'center',
  },
  driverArriveDriverContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginVertical: 24,
  },
  driverArriveRow: {
    flexDirection: 'row',
  },
  driverArriveCarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  driverArriveIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverArriveCarInfo: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
    marginHorizontal: 24,
    marginTop: 16,
    paddingVertical: 12,
  },
  buttonIcons: {
    paddingRight: 13,
  },
  driverArriveMessage: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  driverArriveCarInfoBlock: {
    flex: 1,
    justifyContent: 'space-between',
  },
  colorBlock: {
    width: 40,
    minHeight: 20,
    borderWidth: 2,
    borderColor: colors.grey,
    borderRadius: 5,
    marginTop: 6,
  },
  driverArriveIcon: {
    marginLeft: 24,
  },

  // RideInfo.js
  rideInfo: {
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 20,
    paddingVertical: 20,
    marginHorizontal: 16,
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  rideInfoContainer: {
    position: 'absolute',
    bottom: 24,
    width: '100%',
  },
  rideInfoTimeWrap: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 12,
  },
  rideInfoDistanceWrap: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  rideInfoShare: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // RideSuccess.js
  rideSuccessHeader: {
    marginTop: 16,
    marginBottom: 16,
  },
  rideSuccessOption: {
    backgroundColor: colors.lightGrey,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 10,
    minHeight: 63,
    justifyContent: 'center',
  },
  rideSuccessOptionText: {
    textAlign: 'center',
  },
  rideSuccessAddressText: {
    textAlign: 'center',
  },

  // TemplateModal.js
  templateHeader: {
    marginVertical: 16,
  },
  templateBlock: {
    marginHorizontal: 24,
  },
  templateBlockLast: {
    marginHorizontal: 24,
    marginBottom: 17,
  },
  templateInput: {
    height: 40,
    fontSize: 14,
    color: colors.black,
    paddingBottom: 2,
  },
  templateInputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginBottom: 12,
  },
  templateTextBlock: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginBottom: 12,
    paddingBottom: 9,
    paddingTop: 8,
  },
  templatePayment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  // CancelType.js
  cancelTypeOption: {
    backgroundColor: colors.lightGrey,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 10,
    minHeight: 51,
    justifyContent: 'center',
  },
  cancelTypeText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'center',
    color: colors.black,
  },
  cancelTypeLine: {
    marginBottom: 16,
  },

  // LaterModal.js
  laterHeader: {
    marginTop: 16,
  },
  laterTimeButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    justifyContent: 'space-around',
  },
  laterTimeButton30: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 16,
  },
  laterTimeButton60: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginHorizontal: 16,
  },
  laterDateTimeContainer: {
    marginLeft: 24,
    flexDirection: 'row',
  },
  laterButtonPickerContainer: {
    flex: 1,
    marginRight: 24,
  },
  laterButtonPicker: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    minHeight: 30,
    justifyContent: 'center',
  },
  laterAlarmContainer: {
    marginVertical: 20,
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // RateTrip.js
  rateTripContainer: {
    borderRadius: 10,
  },
  rateTripContentWrap: {
    marginHorizontal: 24,
  },
  rateTripDriverInfo: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 16,
    paddingTop: 10,
  },
  rateTripAvatar: {
    width: 70,
    height: 70,
  },
  rateTripName: {
    marginTop: 16,
    marginBottom: 9,
  },
  rateTripRatingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
  },
  rateTripRatingStar: {
    marginHorizontal: 12,
  },
  rateTripComment: {
    fontSize: 12,
  },
  rateTripCommentIos: {
    paddingVertical: 12,
    marginVertical: 12,
  },

  // BadRating
  badRatingModal: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 36,
  },
  badRatingList: {
    marginHorizontal: 16,
  },
  badRatingReasonItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  badRatingReasonTextWrap: {
    marginLeft: 12,
    flex: 1,
  },
  badRatingInputContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
  badRatingInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  badRatingInputIos: {
    paddingVertical: 12,
  },

  // Payment
  paymentButton: {
    backgroundColor: colors.white,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: colors.grey,
    marginVertical: 16,
  },
  paymentButtonContainer: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 24,
  },
  paymentImage: {
    height: 200,
    width: 200,
  },
  paymentPrefferedText: {
    marginBottom: 16,
  },
  paymentImageWithInput: {
    marginBottom: 24,
  },
  paymentInputContainer: {
    marginVertical: 24,
    marginHorizontal: 24,
    flex: 1,
  },
  paymentInput: {
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  paymentInputError: {
    borderWidth: 1,
    borderColor: colors.red,
  },
  paymentErrorText: {
    color: colors.red,
    textAlign: 'center',
  },
  paymentInputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  paymentCancelButton: {
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  paymentConfirmButton: {
    flex: 1,
    marginLeft: 16,
  },

  // Additional Service
  serviceModalContainer: {
    flex: 1,
    marginTop: 36,
  },
  serviceItem: {
    flexDirection: 'row',
    marginVertical: 6,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 12,
  },
  serviceResultPriceBox: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 8,
    borderTopColor: colors.lightGrey,
  },
  servicesResultPriceItem: {
    paddingTop: 10,
    paddingBottom: 0,
    lineHeight: 14,
    fontSize: 18,
  },
  serviceListContainer: {
    alignItems: 'stretch',
    paddingHorizontal: 16,
    width: '100%',
    flex: 1,
  },
  servicePriceContainer: {
    flexBasis: '100%',
    alignItems: 'center',
  },

  // Chat modal
  chatModal: {
    flex: 1,
    marginTop: Dimension.ScreenHeight() < 640 ? 18 : 24,
    marginBottom: 12,
  },
  chatHeaderText: {
    fontSize: 20,
    borderBottomWidth: 1,
    paddingVertical: 16,
    borderBottomColor: colors.lightGrey,
    marginHorizontal: 24,
  },
  chatList: {
    padding: 12,
  },
  chatMessageContainer: {
    flexDirection: 'row',
  },
  chatHeader: {
    flexDirection: 'row',
    paddingTop: 12,
    marginVertical: 6,
    alignItems: 'center',
    position: 'relative',
  },
  chatButton: {
    position: 'absolute',
    right: 21,
    top: 14,
  },
  inputStyle: {
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: colors.lightGrey,
    minHeight: 44,
    flexDirection: 'row',
    borderRadius: 6,
    paddingVertical: 8,
  },
  driverText: {
    maxWidth: 280,
    minWidth: 50,
    padding: 12,
    backgroundColor: colors.lightGrey,
  },
  clientText: {
    maxWidth: 280,
    minWidth: 100,
    backgroundColor: colors.orange,
    color: colors.textEnv,
    padding: 12,
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
  chatArrowButton: {
    marginRight: 12,
  },

  // friends
  friendsButton: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    alignItems: 'center',
  },
  friendItem: {
    margin: 8,
    justifyContent: 'space-between',
  },
  friendActiveItem: {
    backgroundColor: colors.lightGrey,
    borderRadius: 16,
  },
  friendImage: {
    width: 36,
    height: 36,
    marginRight: 12,
    borderRadius: 18,
  },
  friendList: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    marginVertical: Dimension.ScreenHeight() > 640 ? 36 : 18,
  },
  friendSearchInput: {
    backgroundColor: colors.lightGrey,
    paddingLeft: 24,
    paddingVertical: 12,
  },
  friendClearSearchIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  friendSearchSeparator: {
    height: 0.5,
    width: '100%',
    elevation: 1,
    backgroundColor: colors.grey,
  },
  friendListInner: {
    flexGrow: 1,
  },
  friendListFooter: {
    paddingBottom: 12,
  },

  // addNumberForm
  addNumberContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 24,
  },
  addNumberModal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  addNumberInputWrap: {
    justifyContent: 'center',
  },
  addNumberInput: {
    margin: 12,
    borderRadius: 12,
    backgroundColor: colors.lightGrey,
    paddingLeft: 24,
    paddingVertical: 12,
  },
  addNumberInputIcon: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 16,
    top: 0,
    bottom: 0,
  },
  addNumberButtonDisabled: {
    backgroundColor: colors.lightGrey,
  },
  addNumberTextDisabled: {
    color: colors.borderGrey,
  },

  // MultiPoints Modal
  multiItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.smokeGrey,
    paddingHorizontal: 16,
    paddingVertical: Dimension.ScreenHeight() < 640 ? 12 : 24,
    flexDirection: 'row',
  },
  multiItemIcon: {
    flex: 1,
    maxWidth: 30,
    alignItems: 'center',
  },
  multiAddress: {
    flex: 3,
    marginHorizontal: 16,
  },

  // ActiveBar
  activeBarContainer: {
    position: 'absolute',
    top: '30%',
    right: 0,
    width: 40,
    height: 40,
    zIndex: 40,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
  },
  activeBarText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    alignSelf: 'center',
    color: colors.textEnv,
    width: 200,
    textAlign: 'center',
  },
});

export default style;
