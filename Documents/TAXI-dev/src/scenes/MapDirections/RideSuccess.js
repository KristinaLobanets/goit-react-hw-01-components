import React from 'react';
import { View, TouchableOpacity, Platform, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Modal } from '../../components';
import { styleConstants, strings } from '../../helpers';
import style from './style';

const RideSuccess = ({
  visible,
  onSaveAddress,
  onSaveTemplate,
  onEndRide,
  order,
  templates = [],
}) => {
  const getAddress = point => {
    return order[`object${point}`]
      ? `${order[`object${point}`]}, ${order[`street${point}`]}, ${order[`house${point}`]}`
      : `${order[`street${point}`]}, ${order[`house${point}`] || 1}`;
  };
  const isDuplicate = point => {
    if (order.statusId === 6) {
      const findD = templates.some(el => {
        return el.street === order[`street${point}`] && el.house === order[`house${point}`];
      });
      return findD;
    }
  };
  const addressA = getAddress(0);
  const addressB = getAddress(1);
  const addressC = getAddress(2);
  const addressD = getAddress(3);
  const addressE = getAddress(4);
  const inner = (
    <View style={styleConstants.modalWrap}>
      <Text modalTitle style={style.rideSuccessHeader}>
        {strings.yourRideIsOver}
      </Text>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {!isDuplicate(0) && (
          <TouchableOpacity style={style.rideSuccessOption} onPress={() => onSaveAddress(0)}>
            <Text normalText style={style.rideSuccessOptionText}>
              {strings.saveTheAddress}
            </Text>
            <Text smallText style={style.rideSuccessAddressText}>
              {addressA}
            </Text>
          </TouchableOpacity>
        )}
        {order.street1 && !isDuplicate(1) ? (
          <TouchableOpacity style={style.rideSuccessOption} onPress={() => onSaveAddress(1)}>
            <Text normalText style={style.rideSuccessOptionText}>
              {strings.saveTheAddress}
            </Text>
            <Text smallText style={style.rideSuccessAddressText}>
              {addressB}
            </Text>
          </TouchableOpacity>
        ) : null}
        {order.street2 && !isDuplicate(2) ? (
          <TouchableOpacity style={style.rideSuccessOption} onPress={() => onSaveAddress(2)}>
            <Text normalText style={style.rideSuccessOptionText}>
              {strings.saveTheAddress}
            </Text>
            <Text smallText style={style.rideSuccessAddressText}>
              {addressC}
            </Text>
          </TouchableOpacity>
        ) : null}
        {order.street3 && !isDuplicate(3) ? (
          <TouchableOpacity style={style.rideSuccessOption} onPress={() => onSaveAddress(3)}>
            <Text normalText style={style.rideSuccessOptionText}>
              {strings.saveTheAddress}
            </Text>
            <Text smallText style={style.rideSuccessAddressText}>
              {addressD}
            </Text>
          </TouchableOpacity>
        ) : null}
        {order.street4 && !isDuplicate(4) ? (
          <TouchableOpacity style={style.rideSuccessOption} onPress={() => onSaveAddress(4)}>
            <Text normalText style={style.rideSuccessOptionText}>
              {strings.saveTheAddress}
            </Text>
            <Text smallText style={style.rideSuccessAddressText}>
              {addressE}
            </Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={style.rideSuccessOption} onPress={onSaveTemplate}>
          <Text normalText style={style.rideSuccessOptionText}>
            {strings.createNewTemplate}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity style={styleConstants.modalButton} onPress={onEndRide}>
        <Text normalText style={styleConstants.colorTextEnv}>
          {strings.close}
        </Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Modal
      visible={visible}
      style={styleConstants.modal}
      backdropOpacity={0.602553}
      plain={Platform !== 'android'}
    >
      {Platform !== 'android' ? (
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};

export default RideSuccess;

RideSuccess.propTypes = {
  visible: PropTypes.bool,
  onSaveAddress: PropTypes.func,
  onSaveTemplate: PropTypes.func,
  onEndRide: PropTypes.func,
  order: PropTypes.object,
  templates: PropTypes.array,
};
