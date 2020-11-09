import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

import { Button } from '../../components';
import style from './style';
import { colors, strings } from '../../helpers';

const Header = ({
  onBackPress,
  onPressCancel,
  buttons,
  moreTaxi,
  onNewTaxi,
  cancelIcon,
  onCancelSession,
}) => {
  return (
    <View style={style.header}>
      <View>
        <Button
          buttonStyle={style.headerBackButton}
          icon="arrow-left"
          onPress={onBackPress}
          colorIcon={colors.black}
        />
      </View>
      {buttons ? (
        <View style={style.cancelButtonContainer} key="cancel">
          <Button
            buttonStyle={style.headerButton}
            title={strings.cancel}
            icon="remove"
            colorIcon={colors.red}
            iconButtonStyle={style.headerButtonIcon}
            onPress={onPressCancel}
            buttonTextStyle={{ color: colors.black, paddingRight: 16 }}
          />
        </View>
      ) : null}
      {moreTaxi ? (
        <View style={style.moreTaxiButtonContainer} key="add">
          <Button
            buttonStyle={style.headerButton}
            title={strings.moreTaxi}
            icon="add"
            colorIcon={colors.orange}
            iconButtonStyle={[style.headerButtonIcon, { paddingLeft: 16 }]}
            onPress={onNewTaxi}
            buttonTextStyle={{ color: colors.black, marginRight: 32 }}
          />
        </View>
      ) : null}
      {cancelIcon ? (
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Button
            onPress={onCancelSession}
            icon="remove"
            colorIcon={colors.red}
            buttonStyle={{
              height: 40,
              backgroundColor: colors.white,
              borderRadius: 20,
              paddingHorizontal: 10,
              width: undefined,
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default Header;

Header.propTypes = {
  onBackPress: PropTypes.func.isRequired,
  onPressCancel: PropTypes.func.isRequired,
  buttons: PropTypes.bool,
  moreTaxi: PropTypes.bool,
  onNewTaxi: PropTypes.func,
  cancelIcon: PropTypes.bool,
  onCancelSession: PropTypes.func,
};
