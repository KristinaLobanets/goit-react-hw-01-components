import React, { Component } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';

import { Text, Icon, Header } from '../../components';
import { colors, styleConstants } from '../../helpers';
import style from './style';

class MultiPoints extends Component {
  static propTypes = {
    destination: PropTypes.array,
    onMultiPress: PropTypes.func,
    onDrag: PropTypes.func,
    onDelete: PropTypes.func,
  };

  renderItem = ({ item, drag, isActive }) => {
    return (
      <TouchableOpacity
        style={[
          {
            backgroundColor: isActive ? colors.preloader : colors.white,
          },
          style.multiItemContainer,
        ]}
        onPressIn={drag}
      >
        <View style={style.multiItemIcon}>
          <Icon name="drag" mci size={28} color={colors.iconGrey} />
        </View>
        <View style={style.multiAddress}>
          <Text smallBlackText>
            {item.object
              ? `${item.object}, ${item.street}, ${item.house}`
              : item.house && item.street
              ? `${item.street}, ${item.house}`
              : item.street
              ? item.street
              : ''}
          </Text>
        </View>
        <TouchableOpacity
          onPress={
            Platform.OS === 'ios'
              ? () => this.props.onDelete(item.templateId || item.id)
              : undefined
          }
          onPressOut={
            Platform.OS === 'android'
              ? () => this.props.onDelete(item.templateId || item.id)
              : undefined
          }
          style={style.multiItemIcon}
        >
          <Icon name="remove" size={28} color={colors.red} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  render() {
    const { onMultiPress, onDrag, destination } = this.props;
    return (
      <View style={{ flexGrow: 1, backgroundColor: colors.white }}>
        <Header onPressBack={onMultiPress} headerStyle={{ padding: 6 }} />
        <View style={styleConstants.flex}>
          <DraggableFlatList
            data={destination}
            renderItem={this.renderItem}
            keyExtractor={item => `draggable-item-${item.templateId || item.id}`}
            onDragEnd={({ data }) => onDrag(data)}
            bounces={false}
            extraData={this.props}
          />
        </View>
      </View>
    );
  }
}

export default connect(({ user }) => ({ destination: user.destination }))(MultiPoints);
