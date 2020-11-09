import { StyleSheet, Dimensions, Platform } from 'react-native';

import env from '../env';

import CheckBoxEmpty from '../assets/images/check_box_empty.png';
import CheckBoxFill from '../assets/images/checkbox.png';
import LogoCar from '../assets/images/logo-plaseholder.png';
import SmallAvatar from '../assets/images/user-placeholder.png';
import Avatar from '../assets/images/avatar.png';
import TaxiBlue from '../assets/images/TaxiBlue.png';
import TaxiGreen from '../assets/images/TaxiGreen.png';
import TaxiRed from '../assets/images/TaxiRed.png';
import Bell from '../assets/images/bell.png';
import GiftBox from '../assets/images/giftbox.png';
import CarBusiness from '../assets/images/cars/business.png';
import CarCargo from '../assets/images/cars/cargo.png';
import CarEconom from '../assets/images/cars/econom.png';
import CarGroup from '../assets/images/cars/group.png';
import CarMinivan5 from '../assets/images/cars/minivan5.png';
import CarMinivan6 from '../assets/images/cars/minivan6.png';
import CarMinivan7 from '../assets/images/cars/minivan7.png';
import CarMinivan8 from '../assets/images/cars/minivan8.png';
import CarPremium from '../assets/images/cars/premium.png';
import CarStandart from '../assets/images/cars/standart.png';
import CarUniversalB from '../assets/images/cars/universal_b.png';
import CarUniversalS from '../assets/images/cars/universal_s.png';
import CarUniversalM from '../assets/images/cars/universal_m.png';
import Radar from '../assets/images/radar.png';
import RadarInner from '../assets/images/Oval.png';
import DestPin from '../assets/images/black-pin.png';
import OriginPin from '../assets/images/yellow-pin.png';
import Pin from '../assets/images/pin.png';
import Star from '../assets/images/star.png';
import StarEmpty from '../assets/images/star-empty.png';
import Payments from '../assets/images/payment.png';
import APay from '../assets/images/APay.png';
import GPay from '../assets/images/GPay.png';
import VisaBlack from '../assets/images/visa-black.png';
import Visa from '../assets/images/visa.png';
import MasterCard from '../assets/images/master-card.png';

import { colors } from '.';

export const Version = '0.7.0';

export const Dimension = {
  ScreenWidth(percent = 1) {
    return Dimensions.get('window').width * percent;
  },
  ScreenHeight(percent = 1) {
    return Dimensions.get('window').height * percent;
  },
  IsIphoneX() {
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      (Dimensions.get('window').height === 812 ||
        Dimensions.get('window').width === 812 ||
        Dimensions.get('window').height === 896 ||
        Dimensions.get('window').width === 896)
    );
  },
  IfIphoneX(iphoneXStyle, regularStyle) {
    if (Dimension.IsIphoneX()) {
      return iphoneXStyle;
    }
    return regularStyle;
  },
};

export const styleConstants = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexStart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  flexCenterRow: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flexStartRow: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  rootContainer: {
    flexGrow: 1,
    backgroundColor: colors.white,
    paddingTop: Dimension.IsIphoneX() ? 20 : Platform.OS === 'ios' ? 10 : undefined,
  },
  rootContainerSimple: {
    flex: 1,
    paddingTop: Dimension.IsIphoneX() ? 20 : Platform.OS === 'ios' ? 10 : undefined,
  },
  orangeDot: {
    borderRadius: 100,
    height: 10,
    width: 10,
    backgroundColor: colors.orange,
    borderColor: colors.borderGrey,
    borderWidth: 2,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalWrap: {
    marginVertical: 48,
    backgroundColor: colors.white,
    width: '100%',
    borderRadius: 10,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
  },
  modalRightButton: {
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    flex: 1,
    flexDirection: 'row',
  },
  modalLeftButton: {
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomLeftRadius: 10,
    flex: 1,
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  modalIosContainer: {
    paddingHorizontal: 16,
    backgroundColor: colors.modal,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    height: '100%',
    paddingVertical: Dimension.IsIphoneX() ? 24 : undefined,
  },
  fontMedium: { fontFamily: 'Montserrat-Medium' },
  fontRegular: { fontFamily: 'Montserrat-Regular' },
  fontSemiBold: { fontFamily: 'Montserrat-SemiBold' },
  fontBold: { fontFamily: 'Montserrat-Bold' },
  colorTextEnv: { color: colors.textEnv },
});

export const constants = {
  TAXI_TOKEN: '700400',
  LATITUDE_DELTA: 0.0025623,
  LONGITUDE_DELTA: 0.0025623,
  ICONS_TEMPLATE: [
    {
      id: 0,
      name: 'home',
      size: 24,
    },
    {
      id: 1,
      name: 'bag',
      size: 20,
    },
    {
      id: 2,
      name: 'my-address',
      size: 24,
    },
    {
      id: 3,
      name: 'bank',
      size: 20,
    },
    {
      id: 4,
      name: 'paint',
      size: 20,
    },
    {
      id: 5,
      name: 'basket',
      size: 20,
    },
    {
      id: 6,
      name: 'marker',
      size: 20,
    },
    {
      id: 7,
      name: 'hotel',
      size: 20,
    },
  ],
  COLORS: [
    { hex: '#000000', id: 1, en: 'black', ru: 'Черный', uk: 'Чорний' },
    { hex: '#FFFFFF', id: 2, en: 'white', ru: 'Белый', uk: 'Білий' },
    { hex: '#ffff00', id: 3, en: 'yellow', ru: 'Желтый', uk: 'Жовтий' },
    { hex: '#003366', id: 4, en: 'dark blue', ru: 'Темно-синий', uk: 'Темно-синій' },
    { hex: '#808080', id: 5, en: 'grey', ru: 'Серый', uk: 'Сірий' },
    { hex: '#008000', id: 6, en: 'green', ru: 'Зеленый', uk: 'Зелений' },
    { hex: '#FF0000', id: 7, en: 'red', ru: 'Красный', uk: 'Червоний' },
    { hex: '#0000FF', id: 8, en: 'blue', ru: 'Синий', uk: 'Синій' },
    { hex: '#de3163', id: 9, en: 'cherry', ru: 'Вишневый', uk: 'Вишневий' },
    { hex: '#e1c699', id: 10, en: 'beige', ru: 'Бежевый', uk: 'Бежевий' },
    { hex: '#8b4513', id: 11, en: 'brown', ru: 'Коричневый', uk: 'Коричневий' },
    { hex: '#ff4500', id: 12, en: 'orange', ru: 'Оранжевый', uk: 'Помаранчовий' },
    { hex: '#9400d3', id: 13, en: 'violet', ru: 'Фиолетовый', uk: 'Фіолетовий' },
    { hex: '#D4AF37', id: 14, en: 'golden', ru: 'Золотистый', uk: 'Золотистий' },
    { hex: '#808000', id: 15, en: 'olive', ru: 'Оливковый', uk: 'Оливковый' },
  ],
  COLORS_POLY: [
    { hex: '#ff4500', id: 0, en: 'orange', ru: 'Оранжевый', uk: 'Помаранчовий' },
    { hex: '#008000', id: 1, en: 'green', ru: 'Зеленый', uk: 'Зелений' },
    { hex: '#9400d3', id: 2, en: 'violet', ru: 'Фиолетовый', uk: 'Фіолетовий' },
    { hex: '#ffff00', id: 3, en: 'yellow', ru: 'Желтый', uk: 'Жовтий' },
    { hex: '#0000FF', id: 4, en: 'blue', ru: 'Синий', uk: 'Синій' },
    { hex: '#FF0000', id: 5, en: 'red', ru: 'Красный', uk: 'Червоний' },
    { hex: '#003366', id: 6, en: 'dark blue', ru: 'Темно-синий', uk: 'Темно-синій' },
    { hex: '#808080', id: 7, en: 'grey', ru: 'Серый', uk: 'Сірий' },
    { hex: '#de3163', id: 8, en: 'cherry', ru: 'Вишневый', uk: 'Вишневий' },
    { hex: '#e1c699', id: 9, en: 'beige', ru: 'Бежевый', uk: 'Бежевий' },
    { hex: '#8b4513', id: 10, en: 'brown', ru: 'Коричневый', uk: 'Коричневий' },
  ],
};

const Logo = env.app_logo;
export const Images = {
  Pin,
  CheckBoxEmpty,
  CheckBoxFill,
  Logo,
  LogoCar,
  Avatar,
  SmallAvatar,
  TaxiBlue,
  TaxiGreen,
  TaxiRed,
  Bell,
  CarBusiness,
  CarCargo,
  CarEconom,
  CarGroup,
  CarMinivan5,
  CarMinivan6,
  CarMinivan7,
  CarMinivan8,
  CarPremium,
  CarStandart,
  CarUniversalB,
  CarUniversalS,
  CarUniversalM,
  Radar,
  RadarInner,
  DestPin,
  OriginPin,
  Star,
  StarEmpty,
  Payments,
  APay,
  GPay,
  VisaBlack,
  Visa,
  MasterCard,
  GiftBox,
};

export const PopupData = {
  Bell: {
    bell: true,
    header: 'Ціну за тарифи тимчасово піднято',
    bellText:
      'Через високий попит на таксі поруч з вами, не вистачає вільних автомобілів. Вартість поїздок тимчасово збільшилась - це дозволить  долучити більше водіїв в ваш район. Як тільки їх буде вдосталь, ціна відразу знизиться',
  },
  testAlert: {
    header: 'Адресу збережено',
    text: 'Ти можеш знайти нову адресу в збережених адресах.',
    buttons: true,
  },
};

export const langs = [
  {
    name: 'Українська',
    shortName: 'uk',
  },
  {
    name: 'Русский',
    shortName: 'ru',
  },
  {
    name: 'English',
    shortName: 'en',
  },
  {
    name: 'Slovenský',
    shortName: 'sk',
  },
];
