import React from 'react';
import { View, TouchableOpacity, Platform, Switch } from 'react-native';
import PropTypes from 'prop-types';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { Text, Modal } from '../../components';
import { colors, styleConstants, strings } from '../../helpers';
import style from './style';
import env from '../../env';

const minimumDate = new Date();

const LaterModal = ({
  visible,
  onLeft,
  onRight,
  date,
  time,
  price,
  onPresetTimePress,
  activeTimeButton,
  onDateTimePress,
  showDatePicker,
  isChange,
  onConfirm,
  onCancel,
  timeMode,
  onSwitchAlarm,
  alarm,
  disabled,
}) => {
  const picker = () => {
    const comp = (
      <DateTimePicker
        isVisible={showDatePicker}
        onConfirm={onConfirm}
        onCancel={onCancel}
        mode={Platform.OS !== 'android' ? 'datetime' : timeMode ? 'time' : 'date'}
        timePickerModeAndroid="spinner"
        minimumDate={minimumDate}
        minuteInterval={5}
      />
    );
    return comp;
  };
  const inner = (
    <View style={styleConstants.modalWrap}>
      <View style={style.laterHeader}>
        <Text modalTitle>{strings.setComfortTime}</Text>
      </View>
      {!isChange ? (
        <Text smallBlackText style={{ textAlign: 'center', marginTop: 16 }}>
          {`${strings.cost}: ${price} ${env.app_currency}`}
        </Text>
      ) : null}
      {!isChange ? (
        <View style={style.laterTimeButtonsContainer}>
          <TouchableOpacity style={style.laterTimeButton30} onPress={() => onPresetTimePress(35)}>
            <Text style={activeTimeButton === 35 ? { color: colors.black, flex: 1 } : null}>
              {`${strings.via} 35 ${strings.timeMin}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.laterTimeButton60} onPress={() => onPresetTimePress(60)}>
            <Text style={activeTimeButton === 60 ? { color: colors.black } : null}>
              {`${strings.via} 60 ${strings.timeMin}`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
      <View style={[style.laterDateTimeContainer, isChange ? { marginTop: 24 } : null]}>
        <View style={style.laterButtonPickerContainer}>
          <Text smallRegular>{strings.date}</Text>
          <TouchableOpacity style={style.laterButtonPicker} onPress={() => onDateTimePress(false)}>
            <Text normalText>{date}</Text>
          </TouchableOpacity>
        </View>
        <View style={style.laterButtonPickerContainer}>
          <Text smallRegular>{strings.time}</Text>
          <TouchableOpacity
            style={style.laterButtonPicker}
            onPress={
              Platform.OS === 'android' ? () => onDateTimePress(true) : () => onDateTimePress(false)
            }
          >
            <Text normalText>{time}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.laterAlarmContainer}>
        {!isChange && <Text>{strings.setAlarm}</Text>}
        {!isChange && (
          <Switch
            trackColor={{ false: '#767577', true: colors.darkGrey }}
            thumbColor={alarm ? colors.black : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSwitchAlarm}
            value={alarm}
          />
        )}
      </View>
      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onLeft}>
          <Text normalText>{strings.return}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styleConstants.modalRightButton,
            disabled && { backgroundColor: colors.backgroundGrey },
          ]}
          onPress={onRight}
          disabled={disabled}
        >
          <Text normalText style={styleConstants.colorTextEnv}>
            {isChange ? strings.change : strings.order}
          </Text>
        </TouchableOpacity>
      </View>
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
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>
          {showDatePicker ? picker() : inner}
        </View>
      ) : showDatePicker ? (
        picker()
      ) : (
        inner
      )}
    </Modal>
  );
};

export default LaterModal;

LaterModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onLeft: PropTypes.func.isRequired,
  onRight: PropTypes.func.isRequired,
  date: PropTypes.string,
  time: PropTypes.string,
  onPresetTimePress: PropTypes.func,
  activeTimeButton: PropTypes.number,
  onDateTimePress: PropTypes.func,
  showDatePicker: PropTypes.bool,
  isChange: PropTypes.bool,
  price: PropTypes.number,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  timeMode: PropTypes.bool,
  onSwitchAlarm: PropTypes.func,
  alarm: PropTypes.bool,
  disabled: PropTypes.bool,
};
