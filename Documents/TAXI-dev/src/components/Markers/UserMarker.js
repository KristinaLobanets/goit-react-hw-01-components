import React, { PureComponent } from 'react';
import { View, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';

import { Text } from '..';
import style from './style';
import { Images, strings } from '../../helpers';

const propTypes = {
  destScene: PropTypes.bool,
  duration: PropTypes.number,
  style: PropTypes.object,
};

const defaultProps = {
  destScene: false,
  duration: undefined,
};

export class UserMarker extends PureComponent {
  render() {
    const duration = this.props.duration && this.props.duration > 0 ? Math.ceil(this.props.duration) : 0;
    return (
      <ImageBackground
        source={this.props.destScene ? Images.DestPin : Images.Pin}
        style={[!this.props.destScene ? style.image : style.imageSmaller, this.props.style]}
        onLoad={() => this.forceUpdate()}
      >
        {!this.props.destScene ? (
          <View style={style.textWrap}>
            <Text style={[style.text, style.textBold]}>{duration}</Text>
            <Text style={[style.text, style.textThin]}>{strings.timeMin}</Text>
          </View>
        ) : null}
        <Text style={{ width: 0, height: 0 }}>{Math.random()}</Text>
      </ImageBackground>
    );
  }
}

UserMarker.propTypes = propTypes;
UserMarker.defaultProps = defaultProps;
