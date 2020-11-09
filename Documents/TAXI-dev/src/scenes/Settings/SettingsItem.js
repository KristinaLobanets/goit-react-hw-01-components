import React from 'react';
import { View, TouchableOpacity, Switch } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../../components';
import { colors } from '../../helpers';
import style from './style';

const SettingsItem = ({
  isExit,
  onPress,
  isLast,
  title,
  isSwitch,
  onValueChange,
  value,
  currentOption,
}) => {
  const Element = isSwitch ? View : TouchableOpacity;
  return (
    <Element
      onPress={onPress}
      style={[
        style.settingsItemContainer,
        {
          borderBottomWidth: isLast ? 0 : 1,
          justifyContent: isExit ? 'center' : 'space-between',
        },
      ]}
    >
      {isExit && <Icon name="logout" color={colors.red} size={14} />}
      <Text smallText style={isExit ? style.logoutText : null}>
        {title}
      </Text>
      {isSwitch ? (
        <Switch value={value} onValueChange={onValueChange} />
      ) : !isExit ? (
        <TouchableOpacity style={style.optionPress} onPress={onPress}>
          <Text normalText style={style.option}>
            {currentOption}
          </Text>
          <Icon size={18} name="arrow-right" color={colors.darkGrey} />
        </TouchableOpacity>
      ) : null}
    </Element>
  );
};

export default SettingsItem;

SettingsItem.propTypes = {
  isExit: PropTypes.bool,
  onPress: PropTypes.func,
  isLast: PropTypes.bool,
  title: PropTypes.string,
  isSwitch: PropTypes.bool,
  onValueChange: PropTypes.func,
  value: PropTypes.bool,
  currentOption: PropTypes.any,
};
