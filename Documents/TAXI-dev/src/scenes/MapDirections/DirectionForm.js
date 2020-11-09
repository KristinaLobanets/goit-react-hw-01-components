import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { Icon, Text } from '../../components';
import { colors, strings, styleConstants } from '../../helpers';
import style from './style';

const DirectionForm = ({
  currentAddress,
  destination,
  onPressCurrent,
  onPressDestination,
  onEntranceInput,
  onClearDestination,
  entrance,
  onMultiPress,
  multiButton,
  multiAddress,
}) => {
  return (
    <View style={style.addressWrap}>
      <View style={style.directionWrap}>
        <Icon name="my-address" color={colors.grey} size={8} />
        <Icon name="my-address" color={colors.grey} size={8} />
        <Icon name="menu-down" color={colors.grey} size={10} mci />
      </View>
      <View style={styleConstants.flex}>
        <View style={style.buttonAddressWrap}>
          <TouchableOpacity style={style.buttonAddress} onPress={onPressCurrent}>
            <View style={[styleConstants.orangeDot, style.dot]} />
            <Text
              normalText
              style={[style.textInner, !currentAddress ? style.dirFormTextColor : null]}
              numberOfLines={2}
            >
              {currentAddress || strings.startAddress}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={style.inputEntrance} onPress={onEntranceInput}>
            <Text smallText={!entrance} smallBlackText={!!entrance}>
              {entrance || strings.approach}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={style.lineDirections} />
        <View style={style.buttonAddressWrap}>
          <TouchableOpacity style={style.buttonAddress} onPress={onPressDestination}>
            <View style={style.iconInner}>
              <Icon name="marker" size={14} />
            </View>
            <Text
              normalText
              style={[style.textInner, !destination ? style.dirFormTextColor : null]}
              numberOfLines={2}
            >
              {multiAddress
                ? ` +${multiAddress} ${strings.points}`
                : destination || strings.addressOfArrival}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClearDestination} hitSlop={{ left: 50 }}>
            <Icon name="remove" color={colors.darkGrey} />
          </TouchableOpacity>
          {!!multiButton && (
            <TouchableOpacity style={style.buttonAddressRight} onPress={onMultiPress}>
              <Icon name="add" size={20} color={colors.darkGrey} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};
export default DirectionForm;

DirectionForm.propTypes = {
  currentAddress: PropTypes.string,
  destination: PropTypes.string,
  onPressCurrent: PropTypes.func.isRequired,
  onPressDestination: PropTypes.func.isRequired,
  onEntranceInput: PropTypes.func.isRequired,
  onClearDestination: PropTypes.func.isRequired,
  entrance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  multiButton: PropTypes.bool,
  onMultiPress: PropTypes.func,
  multiAddress: PropTypes.number,
};

DirectionForm.defaultProps = {
  currentAddress: '',
  destination: '',
};
