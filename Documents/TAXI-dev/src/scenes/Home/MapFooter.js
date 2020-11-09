import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import style from './style';
import { ArrowRight, Button } from '../../components';
import { colors, styleConstants, strings } from '../../helpers';

const MapFooter = ({
  titleText,
  onPressAddress,
  onPressNext,
  disabled,
  addressText,
  history,
  onPressRides,
  onPressLast,
  trip,
  tripStatus,
  onCurrentRide,
  outrun,
}) => {
  const status = {
    0: '',
    1: strings.statusSearching,
    2: strings.statusSearching,
    3: strings.statusAwaiting,
    4: strings.statusDriveOnPlace,
    5: strings.statusInTheWay,
  };
  return (
    <View style={style.mapFooter}>
      {trip ? (
        <View style={style.footerInner}>
          <View style={styleConstants.flex}>
            <Button
              buttonTextStyle={style.textButtons}
              title={`${strings.orderStatus}: ${status[tripStatus]}`}
              buttonStyle={style.historyButtons}
              onPress={onCurrentRide}
            />
          </View>
        </View>
      ) : null}
      {!trip && !outrun ? (
        <View style={style.footerInner}>
          <View style={style.footerButtonContainer}>
            <Button
              buttonTextStyle={style.textButtons}
              title={titleText}
              icon="marker"
              buttonStyle={style.whiteButton}
              colorIcon={colors.black}
              onPress={onPressAddress}
              disabled={disabled}
            />
          </View>
          <View>
            <ArrowRight onPress={onPressNext} disabled={disabled} buttonStyle={style.nextButton} />
          </View>
        </View>
      ) : null}
      {history && !trip ? (
        <View style={style.footerInner}>
          {!!addressText && !outrun && (
            <View style={style.addressButtonContainer}>
              <Button
                buttonTextStyle={style.textButtons}
                title={addressText}
                buttonStyle={style.historyButtons}
                colorIcon={colors.black}
                onPress={onPressLast}
                disabled={!!disabled}
              />
            </View>
          )}
          <View style={styleConstants.flex}>
            <Button
              buttonTextStyle={style.textButtons}
              title={strings.myTrips}
              icon="history"
              buttonStyle={style.historyButtons}
              colorIcon={colors.black}
              onPress={onPressRides}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default MapFooter;

MapFooter.propTypes = {
  titleText: PropTypes.string,
  onPressAddress: PropTypes.func,
  onPressNext: PropTypes.func,
  disabled: PropTypes.bool,
  addressText: PropTypes.string,
  history: PropTypes.bool,
  onPressRides: PropTypes.func.isRequired,
  onPressLast: PropTypes.func.isRequired,
  trip: PropTypes.bool,
  tripStatus: PropTypes.number,
  onCurrentRide: PropTypes.func.isRequired,
  outrun: PropTypes.bool,
};

MapFooter.defaultProps = {
  titleText: '',
  onPressAddress: () => {},
  onPressNext: () => {},
  disabled: false,
  addressText: '',
  history: true,
  outrun: false,
};
