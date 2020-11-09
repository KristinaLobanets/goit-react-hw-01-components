import React, { Component } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import env from '../../env';

import { Icon, Text } from '../../components';
import { colors, Images, strings, styleConstants } from '../../helpers';
import style from './style';

class CarList extends Component {
  static propTypes = {
    fares: PropTypes.array,
    openInfo: PropTypes.func,
    activeFare: PropTypes.number.isRequired,
    onPressFare: PropTypes.func.isRequired,
    dest: PropTypes.bool,
    additionalPrice: PropTypes.number,
  };

  static defaultProps = {
    fares: [],
    openInfo: () => {},
  };

  componentDidMount() {
    this.getData();
    setTimeout(() => {
      const current = this.props.fares.find(el => el.id === this.props.activeFare);

      if (current?.standardTypeId === 4 || current?.standardTypeId === 5) {
        this.scroll.scrollTo({ x: 200, y: 0, animated: true });
      }
      if (current?.standardTypeId === 6 || current?.standardTypeId === 7) {
        this.scroll.scrollTo({ x: 300, y: 0, animated: true });
      }
      if (current?.standardTypeId === 8 || current?.standardTypeId === 9) {
        this.scroll.scrollTo({ x: 400, y: 0, animated: true });
      }
      if (current?.standardTypeId >= 10) {
        this.scroll.scrollToEnd();
      }
    }, 10);
  }

  getData = () => {
    let carImage;
    const fares = this.props.fares.map(fare => {
      switch (fare.standardTypeId) {
        case 1:
          carImage = Images.CarEconom;
          break;
        case 2:
          carImage = Images.CarStandart;
          break;
        case 3:
          carImage = Images.CarPremium;
          break;
        case 4:
          carImage = Images.CarBusiness;
          break;
        case 5:
          carImage = Images.CarUniversalS;
          break;
        case 6:
          carImage = Images.CarUniversalM;
          break;
        case 7:
          carImage = Images.CarUniversalB;
          break;
        case 8:
          carImage = Images.CarMinivan5;
          break;
        case 9:
          carImage = Images.CarMinivan6;
          break;
        case 10:
          carImage = Images.CarMinivan7;
          break;
        case 11:
          carImage = Images.CarMinivan8;
          break;
        case 12:
          carImage = Images.CarCargo;
          break;
        default:
          carImage = Images.CarStandart;
          break;
      }
      fare = {
        ...fare,
        carImage,
      };
      return fare;
    });
    return fares;
  };

  renderItem(item) {
    return (
      <View style={style.carWrap} item={item} key={item.id}>
        <TouchableOpacity
          style={[style.carContainer, item.coefficient > 1 && { borderColor: colors.red }]}
          onPress={() => this.props.openInfo(item)}
        >
          <View style={style.carTypeContainer}>
            <Text smallBlackText numberOfLines={1} style={style.carTypeText}>
              {item.name}
            </Text>
            {/* <Icon name="bell-active" size={10} color={colors.grey} style={style.carBell} /> */}
          </View>
          <View style={style.carImgContainer}>
            <Image source={item.carImage} style={style.carImg} />
          </View>
          <View style={style.carPriceContainer}>
            <Icon name="price" size={10} color={item.coefficient > 1 ? colors.red : colors.grey} />
            {!this.props.dest && (
              <Text
                smallRegular
                style={[style.carPriceText, item.coefficient > 1 && { color: colors.red }]}
              >
                {strings.tripFrom.toLowerCase()}
              </Text>
            )}
            <Text
              smallBlackText
              style={[style.carPriceText, styleConstants.fontBold]}
              numberOfLines={1}
            >
              {`${`${Math.ceil(Math.ceil(item.price) * item.coefficient) +
                this.props.additionalPrice}`} ${env.app_currency}`}
            </Text>
          </View>
          <View style={style.carPriceContainer}>
            <Icon
              name="clock-outline"
              size={10}
              color={item.coefficient > 1 ? colors.red : colors.grey}
              mci
            />
            <Text
              smallRegular
              style={[style.carPriceText, item.coefficient > 1 && { color: colors.red }]}
            >
              {`~ ${item.interval} ${strings.timeMin}`}
            </Text>
          </View>
        </TouchableOpacity>
        {this.props.activeFare !== item.id && (
          <TouchableOpacity
            style={style.carOverlay}
            onPress={() => this.props.onPressFare(item.id)}
          />
        )}
        <TouchableOpacity
          style={[
            style.iconWrap,
            this.props.activeFare !== item.id
              ? style.iconWrapPassive
              : item.coefficient > 1
              ? { backgroundColor: colors.white, borderColor: colors.red, borderWidth: 1 }
              : style.iconWrapActive,
          ]}
          onPress={() => this.props.openInfo(item)}
        >
          <Icon
            name="about"
            size={10}
            color={this.props.activeFare !== item.id ? colors.lightGrey : colors.textEnv}
          />
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const data = this.getData();
    return (
      <ScrollView
        contentContainerStyle={style.carScroll}
        showsHorizontalScrollIndicator={false}
        horizontal
        ref={ref => (this.scroll = ref)}
      >
        {data.map(el => this.renderItem(el))}
      </ScrollView>
    );
  }
}
export default connect(({ user }) => ({ user, lang: user.settings.defaultLang }))(CarList);
