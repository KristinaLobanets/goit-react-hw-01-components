import React from 'react';
import { TouchableOpacity, View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../../components';
import { colors, strings, Dimension } from '../../helpers';

const CorporateSwitch = ({ value, onExpand, isExpand = false, onModal }) => {
  return (
    <View
      style={{
        backgroundColor: colors.white,
        marginRight: 24,
        marginLeft: '20%',
        borderRadius: 21.5,
        elevation: 2,
        position: 'absolute',
        top: Dimension.IsIphoneX() ? 32 : Platform.OS === 'ios' ? 20 : 10,
        right: 0,
        left: 0,
        zIndex: 20,
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          flex: 1,
        }}
        onPress={() => {
          onExpand();
        }}
      >
        <Text normalText style={{ flex: 1, color: isExpand ? colors.darkGrey : colors.black }}>
          {value === 0 ? strings.standartFare : strings.corporateFare}
        </Text>
        <Icon
          name={isExpand ? 'chevron-up' : 'chevron-down'}
          color={colors.darkGrey}
          mci
          size={26}
        />
      </TouchableOpacity>
      {isExpand && <View style={{ borderTopWidth: 1, borderTopColor: colors.lightGrey }} />}
      {isExpand && (
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            paddingBottom: 12,
            paddingTop: 8,
            paddingHorizontal: 16,
            flex: 1,
          }}
          onPress={() => {
            onModal(value === 0 ? 1 : 0);
          }}
        >
          <Text normalText style={{ flex: 1 }}>
            {value === 0 ? strings.corporateFare : strings.standartFare}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

CorporateSwitch.propTypes = {
  isExpand: PropTypes.bool,
  onModal: PropTypes.func,
  onExpand: PropTypes.func,
  value: PropTypes.number,
};

export default CorporateSwitch;
