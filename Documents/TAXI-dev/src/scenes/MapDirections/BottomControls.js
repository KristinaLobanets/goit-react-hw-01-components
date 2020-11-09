import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { Button, Text, Icon } from '../../components';
import { strings, colors } from '../../helpers';
import style from './style';

const BottomControls = ({
  onCallNow,
  onCallLater,
  onCommentPress,
  isComment = false,
  onServiceOpenPress,
  paymentTypeId,
  onPaymentPress,
  additionalServices,
  cardNumber,
  bonuses,
  disabled,
  disabledTemplate,
  laterButton,
  block,
  isCreateTemplate,
  onCreateTemplate,
  isFriend,
  isAddPrice,
}) => {
  const payment =
    paymentTypeId === 1
      ? `${strings.creditCard}: ${cardNumber}`
      : paymentTypeId === 2
      ? `${strings.bonusPay}${bonuses ? `: ${bonuses}` : ''}`
      : paymentTypeId === 3
      ? strings.cashless
      : strings.cash;
  const icon =
    paymentTypeId === 1 || paymentTypeId === 3
      ? 'credit-card'
      : paymentTypeId === 2
      ? 'rocket'
      : 'cash';
  return (
    <View style={style.bottomContainer}>
      <View style={style.optionsContainer}>
        <TouchableOpacity onPress={onCommentPress} style={style.option}>
          <Text smallRegular>{strings.comment}</Text>
          <Text smallBlackText>{isComment ? strings.added : strings.add}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.optionCentral} onPress={onServiceOpenPress}>
          <Text smallRegular>{strings.addService}</Text>
          <Text smallBlackText>
            {additionalServices === 0 && isFriend === 0 && isAddPrice === 0
              ? strings.add
              : `${strings.serviceCount} ${additionalServices + isFriend + isAddPrice}`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={style.optionLast} onPress={onPaymentPress} disabled={block}>
          <Text smallRegular>{strings.payment}</Text>
          <View style={style.paymentWrap}>
            <Icon name={icon} color={colors.green} size={12} />
            <Text smallBlackText style={style.paymentText}>
              {payment}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={style.buttonContainer}>
        <View style={style.buttonNowWrap}>
          {!isCreateTemplate ? (
            <Button
              title={strings.order}
              buttonStyle={style.buttonNow}
              onPress={onCallNow}
              disabled={disabled}
            />
          ) : (
            <Button
              title={strings.createNewTemplate}
              buttonStyle={style.buttonNow}
              onPress={onCreateTemplate}
              disabled={disabledTemplate}
            />
          )}
        </View>
        {laterButton && !isCreateTemplate && (
          <View style={style.buttonLaterWrap}>
            <Button
              title={strings.orderLater}
              buttonStyle={style.buttonLater}
              onPress={onCallLater}
            />
          </View>
        )}
      </View>
    </View>
  );
};
export default BottomControls;

BottomControls.propTypes = {
  onPaymentPress: PropTypes.func.isRequired,
  onCallNow: PropTypes.func.isRequired,
  onCallLater: PropTypes.func,
  onCommentPress: PropTypes.func.isRequired,
  isComment: PropTypes.bool,
  onServiceOpenPress: PropTypes.func.isRequired,
  paymentTypeId: PropTypes.number,
  additionalServices: PropTypes.number,
  cardNumber: PropTypes.string,
  bonuses: PropTypes.string,
  disabled: PropTypes.bool,
  disabledTemplate: PropTypes.bool,
  laterButton: PropTypes.bool,
  block: PropTypes.bool,
  isCreateTemplate: PropTypes.bool,
  onCreateTemplate: PropTypes.func,
  isFriend: PropTypes.number,
  isAddPrice: PropTypes.number,
};
