import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal, Icon } from '../../components';
import { strings, styleConstants, colors } from '../../helpers';

import style from './style';
import env from '../../env';

const InfoModal = ({ visible, onPress, details, fareName, paymentIcon, payment, addFares }) => {
  const {
    animals,
    childSeat,
    conditioner,
    emptyTrunk,
    lowLanding,
    receipt,
    terminal,
    tinted,
    distanceIn,
    distanceOut,
    stayTime,
    tripTime,
    priceMinIn,
    priceMinOut,
    minKmIn,
    minKmOut,
    pricePerKmIn,
    pricePerKmOut,
    pricePerStayMinute,
    pricePerTripMinute,
  } = details;

  const {
    animalsAdd,
    animalsMulti,
    childSeatAdd,
    childSeatMulti,
    conditionerAdd,
    conditionerMulti,
    emptyTrunkAdd,
    emptyTrunkMulti,
    lowLandingAdd,
    lowLandingMulti,
    receiptAdd,
    receiptMulti,
    terminalAdd,
    terminalMulti,
    tintedAdd,
    tintedMulti,
  } = addFares;
  const services = [
    {
      name: strings.servicesTravelTrunk,
      price:
        emptyTrunkMulti === 1 && emptyTrunkAdd > 0
          ? `${emptyTrunkAdd} ${env.app_currency}`
          : emptyTrunkMulti > 1
          ? `${((details.calculatedPrice / 100) * emptyTrunkMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'emptyTrunk',
      isTrue: emptyTrunk,
    },
    {
      name: strings.servicesTinted,
      price:
        tintedMulti === 1 && tintedAdd > 0
          ? `${tintedAdd} ${env.app_currency}`
          : tintedMulti > 1
          ? `${((details.calculatedPrice / 100) * tintedMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'tinted',
      isTrue: tinted,
    },
    {
      name: strings.servicesConditioner,
      price:
        conditionerMulti === 1 && conditionerAdd > 0
          ? `${conditionerAdd} ${env.app_currency}`
          : conditionerMulti > 1
          ? `${((details.calculatedPrice / 100) * conditionerMulti)?.toFixed(2)} ${
              env.app_currency
            }`
          : null,
      key: 'conditioner',
      isTrue: conditioner,
    },
    {
      name: strings.servicesTerminal,
      price:
        terminalMulti === 1 && terminalAdd > 0
          ? `${terminalAdd} ${env.app_currency}`
          : terminalMulti > 1
          ? `${((details.calculatedPrice / 100) * terminalMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'terminal',
      isTrue: terminal,
    },
    {
      name: strings.servicesAnimals,
      price:
        animalsMulti === 1 && animalsAdd > 0
          ? `${animalsAdd} ${env.app_currency}`
          : animalsMulti > 1
          ? `${((details.calculatedPrice / 100) * animalsMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'animals',
      isTrue: animals,
    },
    {
      name: strings.servicesChildSeat,
      price:
        childSeatMulti === 1 && childSeatAdd > 0
          ? `${childSeatAdd} ${env.app_currency}`
          : childSeatMulti > 1
          ? `${((details.calculatedPrice / 100) * childSeatMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'childSeat',
      isTrue: childSeat,
    },
    {
      name: strings.servicesLowLanding,
      price:
        lowLandingMulti === 1 && lowLandingAdd > 0
          ? `${lowLandingAdd} ${env.app_currency}`
          : lowLandingMulti > 1
          ? `${((details.calculatedPrice / 100) * lowLandingMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'lowLanding',
      isTrue: lowLanding,
    },
    {
      name: strings.servicesReceipt,
      price:
        receiptMulti === 1 && receiptAdd > 0
          ? `${receiptAdd} ${env.app_currency}`
          : receiptMulti > 1
          ? `${((details.calculatedPrice / 100) * receiptMulti)?.toFixed(2)} ${env.app_currency}`
          : null,
      key: 'receipt',
      isTrue: receipt,
    },
  ].filter(el => el.isTrue && el.price);

  const inner = (
    <View style={[styleConstants.modalWrap, style.serviceModalContainer]}>
      <View style={style.modalContainer}>
        <View style={{ marginVertical: 16 }}>
          <Text modalTitle>{strings.tripDetails}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styleConstants.rootContainer, style.rateTripContainer]}>
        <View style={{ marginHorizontal: 16 }}>
          <View style={style.modalItemRow}>
            <Text>{strings.tariff}</Text>
            <Text normalText>{fareName}</Text>
          </View>
          {!!distanceIn && (
            <View style={style.modalItemRow}>
              <Text>{strings.distInCity}</Text>
              <Text normalText>{`${distanceIn} ${strings.km}`}</Text>
            </View>
          )}
          {!!distanceOut && (
            <View style={style.modalItemRow}>
              <Text>{strings.distOutCity}</Text>
              <Text normalText>{`${distanceOut} ${strings.km}`}</Text>
            </View>
          )}
          {!!stayTime && (
            <View style={style.modalItemRow}>
              <Text>{strings.stayTime}</Text>
              <Text normalText>{`${Math.ceil(stayTime / 60)} ${strings.timeMin}`}</Text>
            </View>
          )}
          {!!tripTime && (
            <View style={style.modalItemRow}>
              <Text>{strings.timeInRoad}</Text>
              <Text normalText>{`${Math.ceil(tripTime / 60)} ${strings.timeMin}`}</Text>
            </View>
          )}
          {!!priceMinIn && (
            <View style={style.modalItemRow}>
              <Text>{strings.priceMinIn}</Text>
              <Text normalText>{`${priceMinIn} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!priceMinOut && (
            <View style={style.modalItemRow}>
              <Text>{strings.priceMinOut}</Text>
              <Text normalText>{`${priceMinOut} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!minKmIn && (
            <View style={style.modalItemRow}>
              <Text>{strings.minKmIn}</Text>
              <Text normalText>{`${minKmIn} ${strings.km}`}</Text>
            </View>
          )}
          {!!minKmOut && (
            <View style={style.modalItemRow}>
              <Text>{strings.minKmOut}</Text>
              <Text normalText>{`${minKmOut} ${strings.km}`}</Text>
            </View>
          )}
          {!!pricePerKmIn && (
            <View style={style.modalItemRow}>
              <Text>{strings.pricePerKmIn}</Text>
              <Text normalText>{`${pricePerKmIn} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!pricePerKmOut && (
            <View style={style.modalItemRow}>
              <Text>{strings.pricePerKmOut}</Text>
              <Text normalText>{`${pricePerKmOut} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!pricePerStayMinute && (
            <View style={style.modalItemRow}>
              <Text>{strings.pricePerStayMinute}</Text>
              <Text normalText>{`${pricePerStayMinute} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!pricePerTripMinute && (
            <View style={style.modalItemRow}>
              <Text>{strings.pricePerTripMinute}</Text>
              <Text normalText>{`${pricePerTripMinute} ${env.app_currency}`}</Text>
            </View>
          )}
          {!!services.length && (
            <View style={style.modalItemRowServices}>
              <Text>{strings.additionalServices}:</Text>
              {services.map(el => (
                <View style={style.modalItemRow} key={el.key}>
                  <Text>{el.name}</Text>
                  <Text normalText>{el.price}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <View style={style.bottomBox}>
        <View style={style.servicePriceContainer}>
          <Text smallRegular>{strings.cost}</Text>
          <Text normalText>{`${details?.price} ${env.app_currency}`}</Text>
        </View>
        <View style={style.servicePriceContainer}>
          <Text smallRegular>{strings.payment}</Text>
          <View style={style.headerRow}>
            <Icon name={paymentIcon} color={colors.green} />
            <Text style={{ color: colors.black, marginLeft: 6 }}>{payment}</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styleConstants.modalButton} onPress={onPress}>
        <Text normalText>{strings.close}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      style={styleConstants.modal}
      backdropOpacity={0.602553}
      plain={Platform.OS !== 'android'}
    >
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};

export default InfoModal;

InfoModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  details: PropTypes.object,
  fareName: PropTypes.string,
  paymentIcon: PropTypes.string,
  payment: PropTypes.string,
  addFares: PropTypes.object,
};
