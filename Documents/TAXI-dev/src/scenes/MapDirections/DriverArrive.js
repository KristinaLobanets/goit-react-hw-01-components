import React from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon, Modal, Ratings } from '../../components';
import { colors, Images, styleConstants, constants, strings } from '../../helpers';
import style from './style';

const DriverArrive = ({
  visible,
  onLeft,
  onRight,
  order,
  onClose,
  onChooseLateTime,
  showTime,
  onChangeTime,
  lateTime,
}) => {
  const address = order.object0
    ? `${order.object0}, ${order.street0}, ${order.house0}`
    : `${order.street0}, ${order.house0 || 1}`;
  const color = constants.COLORS.find(e => e.id === order.colorId)
    ? constants.COLORS.find(e => e.id === order.colorId).hex
    : '';
  const inner = (
    <View style={styleConstants.modalWrap}>
      {showTime ? (
        <View style={{ paddingVertical: 16 }}>
          <View style={style.driverArriveHeader}>
            <Text modalTitle style={style.driverArriveHeaderText}>
              {strings.lateTime}
            </Text>
          </View>
          <View style={[style.overpriceRiseContainer, { marginVertical: 16 }]}>
            <TouchableOpacity onPress={() => onChangeTime(false)} disabled={lateTime <= 1}>
              <Icon
                name="minus-circle"
                mci
                size={26}
                color={lateTime <= 1 ? colors.smokeGrey : colors.darkGrey}
              />
            </TouchableOpacity>
            <Text style={style.overPriceText}>{`${lateTime} ${strings.timeMin}`}</Text>
            <TouchableOpacity onPress={() => onChangeTime(true)}>
              <Icon name="plus-circle" mci size={26} color={colors.darkGrey} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <View style={style.driverArriveHeader}>
            <Text modalTitle style={style.driverArriveHeaderText}>
              {strings.driverInPlace}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="remove" size={24} />
            </TouchableOpacity>
          </View>
          <View>
            <View style={style.driverArriveDriverContainer}>
              <View style={style.driverArriveRow}>
                <Image
                  source={
                    order.driverPhoto
                      ? { uri: `data:image/png;base64,${order.driverPhoto}` }
                      : Images.SmallAvatar
                  }
                  style={style.driverAvatar}
                />
                <View>
                  <Text smallRegular>{`${strings.driver}:`}</Text>
                  <Text normalText>{order.driverName}</Text>
                </View>
              </View>
              <View style={style.driverArriveRating}>
                <Ratings
                  disabled
                  maxStars={5}
                  rating={order.driverRating}
                  starSize={14}
                  buttonStyle={style.driverInfoRatingStar}
                />
              </View>
            </View>
            <View style={style.driverArriveCarContainer}>
              <View style={style.driverArriveRow}>
                <View>
                  <Text smallRegular>{`${strings.car}:`}</Text>
                  <Text normalText>{order.car}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={style.driverArriveCarInfo}>
            <View style={style.driverArriveCarInfoBlock}>
              <Text smallRegular>{`${strings.number}:`}</Text>
              <Text normalText>{order.carNumber}</Text>
            </View>
            <View style={style.driverArriveCarInfoBlock}>
              <Text smallRegular>{`${strings.color}:`}</Text>
              <View style={[style.colorBlock, { backgroundColor: color }]} />
            </View>
          </View>
          <View style={style.driverArriveMessage}>
            <Text normalText>{`${strings.waitNear} ${address}`}</Text>
          </View>
        </View>
      )}

      {showTime ? (
        <View style={styleConstants.modalButtonsContainer}>
          <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
            <Text normalText>{strings.cancel}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styleConstants.modalRightButton} onPress={onChooseLateTime}>
            <Text normalText>{strings.ok}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styleConstants.modalButtonsContainer}>
          <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
            <Icon name="walk" style={style.buttonIcons} />
            <Text normalText>{strings.imlate}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styleConstants.modalRightButton} onPress={onRight}>
            <Icon name="run" style={style.buttonIcons} color={colors.textEnv} />
            <Text normalText style={styleConstants.colorTextEnv}>
              {strings.comeOut}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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

export default DriverArrive;

DriverArrive.propTypes = {
  visible: PropTypes.bool.isRequired,
  onLeft: PropTypes.func.isRequired,
  onRight: PropTypes.func.isRequired,
  order: PropTypes.object,
  onClose: PropTypes.func,
  onChooseLateTime: PropTypes.func,
  showTime: PropTypes.bool,
  onChangeTime: PropTypes.func,
  lateTime: PropTypes.number,
};
