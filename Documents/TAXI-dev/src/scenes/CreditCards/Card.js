import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

import { Text, Icon } from '../../components';
import { Images, styleConstants, colors } from '../../helpers';
import style from './style';

const Card = ({ onCardPress, onDeleteCard, card, defaultCard }) => {
  return (
    <View
      style={[
        style.card,
        {
          backgroundColor: defaultCard === card.cardId ? colors.orange : colors.white,
        },
      ]}
    >
      <TouchableOpacity
        style={styleConstants.flexStartRow}
        onPress={() => onCardPress(card.cardId)}
      >
        <Image
          source={Images[card.cardType === 'VISA' ? 'Visa' : 'MasterCard']}
          style={style.cardImage}
          resizeMode="contain"
        />
        <Text normalText style={style.cardText}>
          {card.maskedCard}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.cardIcon} onPress={() => onDeleteCard(card.cardId)}>
        <Icon name="remove" color={colors.textEnv} />
      </TouchableOpacity>
    </View>
  );
};

export default Card;

Card.propTypes = {
  onCardPress: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  card: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  defaultCard: PropTypes.number,
};
