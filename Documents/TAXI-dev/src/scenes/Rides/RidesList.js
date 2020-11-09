import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';

import { styleConstants } from '../../helpers';
import { Text, Preloader } from '../../components';
import RideItem from './RideItem';
import style from './style';

class RidesList extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    stub: PropTypes.string,
    onDeleteOrder: PropTypes.func,
    onReplace: PropTypes.func,
    onCall: PropTypes.func,
    loading: PropTypes.bool,
    onDelete: PropTypes.func,
    onEndReached: PropTypes.func,
    preloader: PropTypes.bool,
    onMomentumScrollBegin: PropTypes.func,
    onChangePlanned: PropTypes.func,
    onCancelPlanned: PropTypes.func,
    onDetailsOpen: PropTypes.func,
    lang: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  keyExtractor = item =>
    item && item.id
      ? item.id.toString()
      : item.templateId
      ? item.templateId.toString()
      : JSON.stringify(item);

  renderItem = ({ item }) => {
    return (
      <RideItem
        item={item}
        onDeleteOrder={this.props.onDeleteOrder}
        onReplace={this.props.onReplace}
        onCall={this.props.onCall}
        onDelete={this.props.onDelete}
        onChangePlanned={this.props.onChangePlanned}
        onCancelPlanned={this.props.onCancelPlanned}
        onDetailsOpen={this.props.onDetailsOpen}
        lang={this.props.lang}
      />
    );
  };

  render() {
    const { data, stub } = this.props;
    return (
      <View style={[styleConstants.flex, style.containerBackground]}>
        {this.props.loading && (
          <View style={style.preloaderContainer}>
            <Preloader loading={this.props.loading} />
          </View>
        )}
        {data && data.length > 0 ? (
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={this.keyExtractor}
            ListFooterComponent={
              this.props.preloader ? (
                <Preloader loading={this.props.preloader} />
              ) : (
                <View style={style.ridesListFooter} />
              )
            }
            onEndReached={this.props.onEndReached || null}
            onEndReachedThreshold={0.01}
            onMomentumScrollBegin={this.props.onMomentumScrollBegin}
            bounces={false}
            extraData={this.props}
          />
        ) : (
          <View style={styleConstants.flexCenter}>
            <Text>{stub}</Text>
          </View>
        )}
      </View>
    );
  }
}

export default RidesList;
