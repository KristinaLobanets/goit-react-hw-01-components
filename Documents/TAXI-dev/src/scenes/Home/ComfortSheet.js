import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import PropTypes from 'prop-types';

import style from './style';
import { Icon, Text } from '../../components';
import { constants, colors, strings } from '../../helpers';

const ComfortSheet = ({ places, onClose, onPick }) => {
  let scroll = null;
  return (
    <View style={style.taxiInfoContainer}>
      <View style={style.taxiInfoHeader}>
        <Text style={style.taxiInfoHeaderText}>{strings.comfortPlace}</Text>
        <TouchableOpacity onPress={onClose} hitSlop={{ top: 30, left: 30, bottom: 30 }}>
          <Icon name="remove" size={22} />
        </TouchableOpacity>
      </View>
      <View style={style.taxiInfoRatingContainer}>
        <View style={style.taxiInfoLine} />
        <Text style={style.taxiInfoRating}>{strings.proposePlace}</Text>
        <View style={style.taxiInfoLine} />
      </View>
      <ScrollView
        contentContainerStyle={style.taxiInfoOptions}
        persistentScrollbar
        ref={ref => (scroll = ref)}
        onLayout={() => scroll?.flashScrollIndicators()}
      >
        {places?.map((el, index) => (
          <TouchableOpacity
            key={el.object}
            style={{
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.lightGrey,
              flexDirection: 'row',
            }}
            onPress={() => onPick(el)}
          >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: index < 11 ? constants.COLORS_POLY[index].hex : colors.red,
                }}
              />
            </View>
            <View style={{ flex: 1, marginHorizontal: 12 }}>
              <Text normalText>{`${el.object}`}</Text>
              <Text>{`${el.street}, ${el.house}`}</Text>
            </View>

            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text>{`${Math.floor(el.distance)} ${strings.m}`}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ComfortSheet;

ComfortSheet.propTypes = {
  places: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onPick: PropTypes.func.isRequired,
};
