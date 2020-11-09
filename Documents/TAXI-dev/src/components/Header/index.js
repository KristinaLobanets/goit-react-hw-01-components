import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';

import { Text, Icon, ArrowRight } from '..';
import style from './style';
import { strings } from '../../helpers';

const Header = ({
  headerStyle,
  bigTitle,
  arrowRight,
  onPress,
  disabled,
  onPressBack,
  icon,
  mci,
  minHHeight,
  subtitle,
  subtitleStyle,
}) => {
  return (
    <SafeAreaView style={[style.header, headerStyle, { minHeight: minHHeight }]}>
      <View>
        <TouchableOpacity style={style.backButton} onPress={onPressBack || Actions.pop}>
          <Icon name="arrow-left" style={style.headerIcon} />
          <Text smallText>{strings.return}</Text>
        </TouchableOpacity>
        {!!bigTitle && <Text style={style.textBig}>{bigTitle}</Text>}
        {!!subtitle && (
          <Text smallBlackText style={subtitleStyle}>
            {subtitle}
          </Text>
        )}
      </View>
      {arrowRight && (
        <ArrowRight
          onPress={onPress}
          disabled={disabled}
          icon={icon}
          mci={mci}
          buttonStyle={style.button}
        />
      )}
    </SafeAreaView>
  );
};

export default Header;

Header.propTypes = {
  arrowRight: PropTypes.bool,
  bigTitle: PropTypes.string,
  disabled: PropTypes.bool,
  headerStyle: PropTypes.any,
  icon: PropTypes.string,
  mci: PropTypes.bool,
  minHHeight: PropTypes.number,
  onPress: PropTypes.func,
  onPressBack: PropTypes.func,
  subtitleStyle: PropTypes.object,
  subtitle: PropTypes.string,
};

Header.defaultProps = {
  arrowRight: false,
  bigTitle: '',
  disabled: false,
  headerStyle: {},
  icon: 'arrow-right',
  mci: false,
  onPress: () => {},
  onPressBack: undefined,
};
