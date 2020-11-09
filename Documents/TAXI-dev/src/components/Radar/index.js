import React, { Component } from 'react';
import { View, Animated, Easing } from 'react-native';
import PropTypes from 'prop-types';

import { Images } from '../../helpers';
import style from './style';

class Radar extends Component {
  constructor(props) {
    super(props);
    this.animatedValue = new Animated.Value(0);
    this.animatedGrow = new Animated.Value(0);
  }

  componentDidMount() {
    this.animateRadar();
  }

  animateRadar() {
    Animated.parallel([
      Animated.loop(
        Animated.timing(this.animatedValue, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.animatedGrow, {
            toValue: 1,
            duration: 1750,
            easing: Easing.linear,
          }),
          Animated.timing(this.animatedGrow, {
            toValue: 0,
            duration: 1750,
            easing: Easing.linear,
          }),
        ])
      ),
    ]).start(() => this.animateRadar());
  }

  render() {
    const spin = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '358deg'],
    });

    const grow = this.animatedGrow.interpolate({
      inputRange: [0, 1],
      outputRange: ['2%', '100%'],
    });
    return (
      <View style={style.radar} onLayout={this.props.onLayout}>
        <Animated.Image
          source={Images.Radar}
          style={[style.outer, { transform: [{ rotate: spin }] }]}
        />
        <Animated.Image
          source={Images.RadarInner}
          style={[style.inner, { width: grow, height: grow }]}
        />
      </View>
    );
  }
}

export default Radar;

Radar.propTypes = {
  onLayout: PropTypes.func,
};
