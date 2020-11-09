import React, { Component } from 'react';
import { View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

import StarButton from './Star';
import { Images } from '../../helpers';
import style from './style';

const propTypes = {
  buttonStyle: ViewPropTypes.style,
  containerStyle: ViewPropTypes.style,
  disabled: PropTypes.bool,
  maxStars: PropTypes.number,
  rating: PropTypes.number,
  selectedStar: PropTypes.func,
  starSize: PropTypes.number,
  starStyle: ViewPropTypes.style,
};

const defaultProps = {
  buttonStyle: {},
  containerStyle: {},
  disabled: false,
  maxStars: 5,
  rating: 0,
  selectedStar: () => {},
  starSize: 40,
  starStyle: {},
};

class Rating extends Component {
  constructor(props) {
    super(props);

    this.starRef = [];
    this.onStarButtonPress = this.onStarButtonPress.bind(this);
  }

  onStarButtonPress(rating) {
    const { selectedStar } = this.props;

    selectedStar(rating);
  }

  render() {
    const {
      buttonStyle,
      containerStyle,
      disabled,
      maxStars,
      rating,
      starSize = 18,
      starStyle,
    } = this.props;

    // Round rating down to nearest star
    let starsLeft = Math.round(rating);
    const starButtons = [];

    for (let i = 0; i < maxStars; i += 1) {
      let starImage = Images.StarEmpty;

      if (starsLeft >= 1) {
        starImage = Images.Star;
      }
      const starButtonElement = (
        <View key={i}>
          <StarButton
            buttonStyle={buttonStyle}
            disabled={disabled}
            onStarButtonPress={() => {
              this.onStarButtonPress(i + 1);
            }}
            starImage={starImage}
            starSize={starSize}
            starStyle={starStyle}
          />
        </View>
      );

      starButtons.push(starButtonElement);
      starsLeft -= 1;
    }

    return <View style={[style.container, containerStyle]}>{starButtons}</View>;
  }
}

Rating.propTypes = propTypes;
Rating.defaultProps = defaultProps;

export default Rating;
