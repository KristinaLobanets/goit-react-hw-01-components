import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon, ArrowRight } from '../../components';
import { colors, strings } from '../../helpers';
import style from './style';
import env from '../../env';

const OverPrice = ({ additionalPrice, onMinus, onPlus, onRecall, orderPrice, disabled }) => {
  return (
    <View style={style.overpriceContainer}>
      <Text modalTitle style={style.overpriceHeaderText}>
        {strings.payCarOtherArea}
      </Text>
      <View style={style.overpriceLineContainer}>
        <View style={style.line} />
        <Text smallText style={style.lineText}>
          {strings.extraOverPay}
        </Text>
        <View style={style.line} />
      </View>
      <View style={style.overpriceRiseContainer}>
        <TouchableOpacity onPress={onMinus} disabled={additionalPrice === 0}>
          <Icon
            name="minus-circle"
            mci
            size={26}
            color={additionalPrice === 0 ? colors.smokeGrey : colors.darkGrey}
          />
        </TouchableOpacity>
        <Text style={style.overPriceText}>{`${additionalPrice} ${env.app_currency}`}</Text>
        <TouchableOpacity onPress={onPlus}>
          <Icon name="plus-circle" mci size={26} color={colors.darkGrey} />
        </TouchableOpacity>
      </View>
      <Text smallRegular style={style.overPriceComment}>
        {strings.overPayComment}
      </Text>
      <View style={style.overpriceOptions}>
        <View>
          <Text smallRegular>{strings.overPay}</Text>
          <Text style={style.overPriceText}>{`${additionalPrice} ${env.app_currency}`}</Text>
        </View>
        <View>
          <Text smallRegular>{strings.rideCost}</Text>
          <Text style={style.overPriceTextBold}>{`${orderPrice + additionalPrice} ${
            env.app_currency
          }`}</Text>
        </View>
        <View>
          <ArrowRight onPress={onRecall} disabled={disabled} />
        </View>
      </View>
    </View>
  );
};
export default OverPrice;

OverPrice.propTypes = {
  additionalPrice: PropTypes.number,
  onPlus: PropTypes.func.isRequired,
  onMinus: PropTypes.func.isRequired,
  onRecall: PropTypes.func.isRequired,
  orderPrice: PropTypes.number,
  disabled: PropTypes.bool,
};
