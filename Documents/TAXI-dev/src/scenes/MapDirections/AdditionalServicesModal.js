import React from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';

import env from '../../env';
import { Text, Modal, CustomCheckBox, Icon } from '../../components';
import { strings, styleConstants, colors } from '../../helpers';
import ContactsList from './ContactsList';
import AddNumberForm from './AddNumberForm';

import style from './style';

const AdditionalServicesModal = ({
  visible,
  onLeft,
  onRight,
  onPress,
  addServices,
  carPrice,
  additionalFares,
  onFriendPress,
  friend,
  showFriends,
  onBackFriends,
  onDeleteFriend,
  addNumber,
  showNumberForm,
  onAddPrice,
  additionalPrice,
}) => {
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
  } = additionalFares;
  const services = [
    {
      name: strings.servicesTravelTrunk,
      price:
        emptyTrunkMulti === 1 && emptyTrunkAdd > 0
          ? `( + ${emptyTrunkAdd} ${env.app_currency})`
          : emptyTrunkMulti > 1
          ? `( +${emptyTrunkMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'emptyTrunk',
    },
    {
      name: strings.servicesTinted,
      price:
        tintedMulti === 1 && tintedAdd > 0
          ? `( + ${tintedAdd} ${env.app_currency})`
          : tintedMulti > 1
          ? `( +${tintedMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'tinted',
    },
    {
      name: strings.servicesConditioner,
      price:
        conditionerMulti === 1 && conditionerAdd > 0
          ? `( + ${conditionerAdd} ${env.app_currency})`
          : conditionerMulti > 1
          ? `( +${conditionerMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'conditioner',
    },
    {
      name: strings.servicesTerminal,
      price:
        terminalMulti === 1 && terminalAdd > 0
          ? `( + ${terminalAdd} ${env.app_currency})`
          : terminalMulti > 1
          ? `( +${terminalMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'terminal',
    },
    {
      name: strings.servicesAnimals,
      price:
        animalsMulti === 1 && animalsAdd > 0
          ? `( + ${animalsAdd} ${env.app_currency})`
          : animalsMulti > 1
          ? `( +${animalsMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'animals',
    },
    {
      name: strings.servicesChildSeat,
      price:
        childSeatMulti === 1 && childSeatAdd > 0
          ? `( + ${childSeatAdd} ${env.app_currency})`
          : childSeatMulti > 1
          ? `( +${childSeatMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'childSeat',
    },
    {
      name: strings.servicesLowLanding,
      price:
        lowLandingMulti === 1 && lowLandingAdd > 0
          ? `( + ${lowLandingAdd} ${env.app_currency})`
          : lowLandingMulti > 1
          ? `( +${lowLandingMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'lowLanding',
    },
    {
      name: strings.servicesReceipt,
      price:
        receiptMulti === 1 && receiptAdd > 0
          ? `( + ${receiptAdd} ${env.app_currency})`
          : receiptMulti > 1
          ? `( +${receiptMulti * 100 - 100}%  ${strings.costOfTariff})`
          : null,
      key: 'receipt',
    },
  ];

  const inner = (
    <View style={[styleConstants.modalWrap, style.serviceModalContainer]}>
      <View style={style.modalContainer}>
        <View style={style.modalHeader}>
          <Text modalTitle>{strings.chooseAdditionalServices}</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={[styleConstants.rootContainer, style.rateTripContainer]}>
        <View style={style.serviceListContainer}>
          {services.map(({ key, name, price }) => (
            <TouchableOpacity key={key} style={style.serviceItem} onPress={() => onPress(key)}>
              <View>
                <Text normalText>{name}</Text>
                {price ? <Text smallText>{price}</Text> : null}
              </View>
              <CustomCheckBox isChecked={addServices[key]} onClick={() => onPress(key)} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={style.friendsButton}
        onPress={onFriendPress}
        onLongPress={onDeleteFriend}
      >
        <View style={styleConstants.flex}>
          <Text>{strings.servicesTripToFriend}</Text>
          {friend.recordID && (
            <Text smallBlackText>{`${friend.givenName}${
              friend.middleName ? ` ${friend.middleName}` : ''
            }${friend.familyName ? ` ${friend.familyName}` : ''}`}</Text>
          )}
        </View>

        <Icon name="arrow-right" color={colors.iconGrey} />
      </TouchableOpacity>
      <TouchableOpacity style={style.friendsButton} onPress={onAddPrice}>
        <View style={styleConstants.flex}>
          <Text>{strings.overPay}</Text>
          {!!additionalPrice && (
            <Text
              smallBlackText
            >{`${strings.extraOverPay}: ${additionalPrice} ${env.app_currency}`}</Text>
          )}
        </View>
        <Icon name="arrow-right" color={colors.iconGrey} />
      </TouchableOpacity>
      <View style={style.serviceResultPriceBox}>
        <View style={style.servicePriceContainer}>
          <Text smallText>{strings.rideCost}</Text>
          <Text header style={style.servicesResultPriceItem}>
            {`${Math.ceil(carPrice) + additionalPrice} ${env.app_currency}`}
          </Text>
        </View>
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
          <Text normalText>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onRight}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.save}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const friendsList = <ContactsList onBack={onBackFriends} showNumberForm={showNumberForm} />;
  const addNumberForm = <AddNumberForm onBack={showNumberForm} />;

  return (
    <Modal
      visible={visible}
      style={showFriends || addNumber ? undefined : styleConstants.modal}
      backdropOpacity={0.602553}
      plain={Platform.OS !== 'android'}
    >
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modalIosContainer]}>
          {showFriends ? friendsList : addNumber ? addNumberForm : inner}
        </View>
      ) : showFriends ? (
        friendsList
      ) : addNumber ? (
        addNumberForm
      ) : (
        inner
      )}
    </Modal>
  );
};

export default AdditionalServicesModal;

AdditionalServicesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onLeft: PropTypes.func.isRequired,
  onRight: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  onFriendPress: PropTypes.func,
  addServices: PropTypes.object,
  carPrice: PropTypes.number,
  additionalFares: PropTypes.object,
  friend: PropTypes.object,
  showFriends: PropTypes.bool,
  onBackFriends: PropTypes.func,
  onDeleteFriend: PropTypes.func,
  addNumber: PropTypes.bool,
  showNumberForm: PropTypes.func,
  onAddPrice: PropTypes.func,
  additionalPrice: PropTypes.number,
};
