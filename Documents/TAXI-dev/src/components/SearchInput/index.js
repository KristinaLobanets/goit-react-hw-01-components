import React from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';

import { Icon, TextInput, Text } from '..';
import { colors, styleConstants, strings } from '../../helpers';
import style from './style';

const SearchInput = React.forwardRef((props, ref) => {
  const {
    colorIconMyAddress,
    onChangeText,
    onHide,
    onMapPress,
    onPressRemove,
    iconMyAddress,
    iconRemove,
    loading,
    placeholder,
    textInputContainer,
    textInputWrap,
    textInputStyle,
    value,
    mapDisabled,
  } = props;
  return (
    <TouchableWithoutFeedback onPress={onHide}>
      <View style={[style.textInputWrap, textInputWrap]}>
        <View style={[style.textInputContainer, textInputContainer]}>
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            textInputStyle={[style.textInput, textInputStyle]}
            placeholder={placeholder}
            placeholderTextColor={colors.grey}
            autoFocus
          />
          {!!iconMyAddress && (
            <View style={style.iconMyAddress}>
              {iconMyAddress !== 'marker' ? (
                <View style={styleConstants.orangeDot} />
              ) : (
                <Icon name={iconMyAddress} color={colorIconMyAddress} size={14} />
              )}
            </View>
          )}
          {iconRemove ? (
            <TouchableOpacity
              onPress={onPressRemove}
              style={style.iconRemove}
              hitSlop={{ right: 15 }}
            >
              <Icon name={iconRemove} color={colors.darkGrey} />
            </TouchableOpacity>
          ) : loading ? (
            <View style={style.iconRemove}>
              <ActivityIndicator animating={loading} color={colors.orange} style={style.loader} />
            </View>
          ) : null}
          <View style={style.backBlock} />
        </View>
        <TouchableOpacity
          style={[style.mapButtonContainer, mapDisabled ? { opacity: 0.4 } : null]}
          onPress={onMapPress}
          disabled={mapDisabled}
        >
          <Icon name="marker" color={colors.darkGrey} size={12} />
          <Text smallText style={style.mapButtonText}>
            {strings.map}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
});

SearchInput.propTypes = {
  colorIconMyAddress: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onMapPress: PropTypes.func.isRequired,
  onPressRemove: PropTypes.func.isRequired,
  iconMyAddress: PropTypes.string,
  iconRemove: PropTypes.string,
  loading: PropTypes.bool,
  placeholder: PropTypes.string,
  textInputContainer: PropTypes.any,
  textInputStyle: PropTypes.any,
  textInputWrap: PropTypes.any,
  value: PropTypes.string,
  mapDisabled: PropTypes.bool,
};

SearchInput.defaultProps = {
  colorIconMyAddress: colors.black,
  iconMyAddress: 'my-address',
  iconRemove: 'remove',
  placeholder: 'Address',
  textInputContainer: {},
  textInputStyle: {},
  textInputWrap: {},
  value: '',
  mapDisabled: false,
};

export default SearchInput;
