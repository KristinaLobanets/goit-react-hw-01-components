/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';

import { Text } from '..';
import { colors, Dimension, styleConstants } from '../../helpers';

class TabViewComponent extends PureComponent {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.func).isRequired,
    routesData: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
    onLoadTab: PropTypes.func,
    startPage: PropTypes.number,
    isNewRides: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      index: this.props.startPage || 0,
      routes: [{ key: 'first', title: 'default' }],
      tabs: { first: () => null },
    };
  }

  componentDidMount() {
    this.getInitState();
  }

  getInitState = () => {
    const createData = (routes, routesData) => {
      const arr = [];
      routesData.map((d, i) => {
        return routes.map((item, idx) => {
          if (idx === i) {
            arr.push({ ...d, route: item });
          }
        });
      });
      const tabs = arr.reduce((o, key) => ({ ...o, [key.key]: key.route }), {});
      return tabs;
    };
    this.setState({
      routes: this.props.routesData,
      tabs: createData(this.props.routes, this.props.routesData),
    });
  };

  // renderLabel = ({ route, focused }) => {
  //   return (
  //     <Text
  //       numberOfLines={1}
  //       style={{ color: focused ? colors.black : undefined, fontFamily: 'Montserrat-Medium' }}
  //     >
  //       {route.title}*
  //     </Text>
  //   );
  // };

  renderLabel = ({ route, focused }) => {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Text
          numberOfLines={1}
          style={{ color: focused ? colors.black : undefined, fontFamily: 'Montserrat-Medium' }}
        >
          {route.title}
        </Text>
        {this.props.isNewRides && route.key === 'second' && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.red,
              alignSelf: 'center',
              marginLeft: 4,
            }}
          />
        )}
      </View>
    );
  };

  handleIndex = index => {
    this.setState(prevState => ({ navigation: prevState.navigation, index }));
  };

  render() {
    return (
      <View style={styleConstants.flex}>
        <TabView
          navigationState={this.state}
          renderScene={({ route }) => {
            switch (route.key) {
              case 'first':
                return this.state.tabs.first();
              case 'second':
                return this.state.tabs.second();
              case 'third':
                return this.state.tabs.third();
              default:
                return null;
            }
          }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: colors.black }}
              style={{ backgroundColor: colors.white }}
              renderLabel={this.renderLabel}
              onTabPress={this.props.onLoadTab}
            />
          )}
          onIndexChange={this.handleIndex}
          initialLayout={{ height: 0, width: Dimension.ScreenWidth() }}
          lazy
        />
      </View>
    );
  }
}
export default TabViewComponent;
