import React from 'react';
import { TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import { TextInputMask } from 'react-native-masked-text';

import { colors, styleConstants } from '../../helpers';

const TextInputCustom = React.forwardRef((props, ref) => {
  const font = styleConstants.fontMedium;
  return (
    <View style={props.textInputWrap}>
      {props.masked ? (
        <TextInputMask
          {...props}
          ref={ref}
          style={[props.textInputStyle, font, { color: colors.black }]}
          placeholderTextColor={colors.grey}
          type={props.type}
          options={props.options}
          value={props.value}
          onChangeText={props.onChangeText}
        />
      ) : (
        <TextInput
          {...props}
          ref={ref}
          style={[props.textInputStyle, font, { color: colors.black }]}
          placeholderTextColor={colors.grey}
          multiline={props.multiline}
          value={props.value}
          onChangeText={props.onChangeText}
        />
      )}
    </View>
  );
});

TextInputCustom.propTypes = {
  textInputWrap: PropTypes.any,
  textInputStyle: PropTypes.any,
  masked: PropTypes.bool,
  type: PropTypes.string,
  options: PropTypes.any,
  multiline: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangeText: PropTypes.func,
};

TextInputCustom.defaultProps = {
  textInputWrap: {},
  textInputStyle: {},
  masked: false,
  type: 'custom',
  options: {},
  multiline: false,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangeText: PropTypes.func,
};

export default TextInputCustom;
