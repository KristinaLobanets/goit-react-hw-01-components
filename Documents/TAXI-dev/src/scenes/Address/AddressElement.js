import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

import { Icon, Text } from '../../components';
import { colors, constants, styleConstants } from '../../helpers';
import style from './style';

const AddressElement = props => {
  const { item, onPressConfirm, onPressDelete } = props;
  const templateName = item.templateId ? item.name : '';
  return (
    <View style={style.container}>
      <View style={styleConstants.flexStartRow}>
        {item.iconId === 0 || !!item.iconId ? (
          <View style={style.iconLeft}>
            <Icon name={constants.ICONS_TEMPLATE[item.iconId].name} color={colors.black} />
          </View>
        ) : null}
        <TouchableOpacity style={style.textContainer} onPress={() => onPressConfirm(item)}>
          <Text normalText>
            {templateName || item.object || item.object0 || item.street || item.street0}
          </Text>
          <Text numberOfLines={1} smallRegular>
            {`${item.street || item.street0}${item.house || item.house0 ? ', ' : ''}${item.house ||
              item.house0 ||
              ''}`}
          </Text>
        </TouchableOpacity>
      </View>
      {item.templateId ? (
        <TouchableOpacity onPress={() => onPressDelete(item)}>
          <Icon name="remove" size={20} color={colors.darkGrey} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
export default AddressElement;

AddressElement.propTypes = {
  item: PropTypes.any.isRequired,
  onPressConfirm: PropTypes.func.isRequired,
  onPressDelete: PropTypes.func,
};
