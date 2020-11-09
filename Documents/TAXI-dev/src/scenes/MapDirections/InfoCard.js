import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Icon, Text } from '../../components';
import { colors, strings, faresLocale, Images } from '../../helpers';
import style from './style';
import env from '../../env';

const InfoCard = ({ image, item }) => {
  const { priceMinIn, waitTime, minKmIn, pricePerKmIn, pricePerMinute, description, name } = item;
  const descArr = description ? description.split('\\n') : [];
  return (
    <ScrollView contentContainerStyle={style.infoContainer}>
      <View style={{ marginBottom: 16 }}>
        <Text style={style.infoTypeText}>{name}</Text>
        <Text modalTitle style={style.infoBlock}>{`${strings.tripFrom.toLowerCase()} ${Math.ceil(
          priceMinIn
        )} ${env.app_currency}`}</Text>
        <View style={style.infoImage}>
          <Image source={image} />
        </View>
        <View style={style.infoPros}>
          <Text style={style.fareInfo}>
            <Text>{faresLocale.TariffPriceMin} </Text>
            <Text normalText>
              {priceMinIn}
              {env.app_currency},
            </Text>
            <Text>{faresLocale.TariffPriceInc} </Text>
            <Text normalText>
              {minKmIn} {strings.km}
            </Text>
            <Text>, {faresLocale.TariffPriceNext}</Text>
            <Text normalText>
              {pricePerKmIn}
              {env.app_currency}/{strings.km}
            </Text>
          </Text>
        </View>
        <View style={style.infoPros}>
          <Text style={style.fareInfo}>
            <Text>{faresLocale.TariffPriceAwait}</Text>
            <Text>{faresLocale.TariffPriceIncLine} </Text>
            <Text normalText>
              {waitTime}
              {strings.timeMin}
            </Text>
            <Text>, {faresLocale.TariffPriceNextLine}</Text>
            <Text normalText>
              {pricePerMinute}
              {env.app_currency}/{strings.timeMin}
            </Text>
          </Text>
        </View>
      </View>
      <View>
        {descArr.map(el => (
          <View style={style.infoPros} key={el}>
            <Icon name="feature" color={colors.darkGrey} size={15} />
            <Text smallRegular style={style.infoProsText}>
              {el}
            </Text>
          </View>
        ))}
      </View>
      {item.coefficient > 1 && (
        <View
          style={{
            margin: 16,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <Image source={Images.Bell} style={{ width: 18, height: 22, marginRight: 12 }} />
          <Text normalText>{strings.coeficientIncr}</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default connect(({ user }) => ({ user }))(InfoCard);

InfoCard.propTypes = {
  image: PropTypes.number,
  item: PropTypes.object,
};
