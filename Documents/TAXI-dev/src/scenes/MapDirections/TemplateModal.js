import React from 'react';
import { View, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';

import { TextInput, Text, Modal, Icon } from '../../components';
import { styleConstants, colors, strings } from '../../helpers';
import style from './style';

const TemplateModal = ({
  visible,
  onSave,
  onBack,
  order,
  name,
  onChangeName,
  additionalServices,
  servicesText,
  templateData,
  fareName,
}) => {
  const data = templateData || order;
  const type = templateData ? fareName?.name : order?.priceName;
  const getAddress = point => {
    if (point === 'empty') return undefined;
    return data[`object${point}`]
      ? `${data[`object${point}`]}, ${data[`street${point}`]}, ${data[`house${point}`]}`
      : `${data[`street${point}`]}, ${data[`house${point}`] || 1}`;
  };
  const from = getAddress(0);
  const to = getAddress(data.street1 ? 1 : 'empty');
  const to2 = getAddress(data.street2 ? 2 : 'empty');
  const to3 = getAddress(data.street3 ? 3 : 'empty');
  const to4 = getAddress(data.street4 ? 4 : 'empty');

  const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const inner = (
    <View style={styleConstants.modalWrap}>
      <Text modalTitle style={style.templateHeader}>
        {strings.newTemplate}
      </Text>
      <ScrollView contentContainerStyle={styleConstants.rootContainer}>
        <Element style={style.templateBlock}>
          <Text smallRegular>{strings.name}</Text>
          <TextInput
            textInputStyle={style.templateInput}
            textInputWrap={style.templateInputWrap}
            value={name}
            onChangeText={value => onChangeName(value)}
          />
        </Element>
        <View style={style.templateBlock}>
          <Text smallRegular>{strings.tripFrom}</Text>
          <Text normalText style={style.templateTextBlock}>
            {from}
          </Text>
        </View>
        {to ? (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.tripTo}</Text>
            <Text normalText style={style.templateTextBlock}>
              {to}
            </Text>
          </View>
        ) : null}
        {to2 ? (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.tripTo}</Text>
            <Text normalText style={style.templateTextBlock}>
              {to2}
            </Text>
          </View>
        ) : null}
        {to3 ? (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.tripTo}</Text>
            <Text normalText style={style.templateTextBlock}>
              {to3}
            </Text>
          </View>
        ) : null}
        {to4 ? (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.tripTo}</Text>
            <Text normalText style={style.templateTextBlock}>
              {to4}
            </Text>
          </View>
        ) : null}
        <View style={style.templateBlock}>
          <Text smallRegular>{strings.carClass}</Text>
          <Text normalText style={style.templateTextBlock}>
            {type}
          </Text>
        </View>
        {!!additionalServices && (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.additionalServices}</Text>
            <Text normalText style={style.templateTextBlock}>
              {servicesText}
            </Text>
          </View>
        )}
        {!!data.comments && (
          <View style={style.templateBlock}>
            <Text smallRegular>{strings.commentDriver}</Text>
            <Text normalText style={style.templateTextBlock}>
              {data.comments}
            </Text>
          </View>
        )}
        <View style={style.templateBlockLast}>
          <Text smallRegular>{strings.payment}</Text>
          <View style={style.templatePayment}>
            <Icon
              name={
                data.paymentTypeId === 0
                  ? 'cash'
                  : data.paymentTypeId === 1
                  ? 'credit-card'
                  : 'rocket'
              }
              color={colors.green}
              style={style.paymentIcon}
              size={14}
            />
            <Text normalText>
              {data.paymentTypeId === 0
                ? strings.cash
                : data.paymentTypeId === 1
                ? strings.payWithCreditCard
                : data.paymentTypeId === 2
                ? strings.bonusPay
                : strings.cashless}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onBack}>
          <Text normalText>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onSave}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.create}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <Modal visible={visible} style={styleConstants.modal} plain={Platform.OS !== 'android'}>
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};

export default TemplateModal;

TemplateModal.propTypes = {
  visible: PropTypes.bool,
  onBack: PropTypes.func,
  onSave: PropTypes.func,
  onChangeName: PropTypes.func,
  order: PropTypes.object,
  name: PropTypes.string,
  additionalServices: PropTypes.number,
  servicesText: PropTypes.string,
  templateData: PropTypes.object,
  fareName: PropTypes.object,
};
