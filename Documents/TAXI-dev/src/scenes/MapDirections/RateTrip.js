import React from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';

import { TextInput, Text, Modal, Ratings } from '../../components';
import { styleConstants, Images, strings } from '../../helpers';
import style from './style';

const RateTrip = ({
  visible,
  onSend,
  onFinish,
  onChangeRating,
  rating,
  order,
  comment,
  onChangeComment,
}) => {
  const rateText = ratingNum => {
    switch (ratingNum) {
      case 1:
        return strings.rateTerribly;
      case 2:
        return strings.rateBadly;
      case 3:
        return strings.rateSatisfactorily;
      case 4:
        return strings.rateGood;
      case 5:
        return strings.ratePerfectly;
      default:
        return '';
    }
  };
  const Element = Platform.OS === 'ios' ? KeyboardAvoidingView : View;
  const inner = (
    <Element style={styleConstants.modalWrap} behavior="padding">
      <ScrollView style={[styleConstants.rootContainer, style.rateTripContainer]} bounces="false">
        <View style={style.rateTripContentWrap}>
          <Text modalTitle style={style.templateHeader}>
            {strings.rateARide}
          </Text>
          <View style={style.rateTripDriverInfo}>
            <Image
              source={
                order.driverPhoto
                  ? { uri: `data:image/png;base64,${order.driverPhoto}` }
                  : Images.SmallAvatar
              }
              style={style.rateTripAvatar}
            />
            <Text normalText style={style.rateTripName}>
              {order.driverName}
            </Text>
            <Text smallText>{order.car}</Text>
          </View>
          <View style={style.rateTripRatingsContainer}>
            <Ratings
              maxStars={5}
              rating={rating}
              starSize={24}
              buttonStyle={style.rateTripRatingStar}
              selectedStar={onChangeRating}
            />
          </View>
          <View style={style.lineTextContainer}>
            <View style={style.line} />
            <Text style={[style.lineText, styleConstants.fontMedium]}>{rateText(rating)}</Text>
            <View style={style.line} />
          </View>
          <View>
            <Text normalText>{strings.comment}</Text>
            <TextInput
              textInputStyle={[
                style.rateTripComment,
                Platform.OS === 'ios' ? style.rateTripCommentIos : null,
              ]}
              multiline
              value={comment}
              onChangeText={onChangeComment}
              placeholder={strings.startWrite}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styleConstants.modalButtonsContainer}>
        <TouchableOpacity style={styleConstants.modalLeftButton} onPress={onFinish}>
          <Text normalText>{strings.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styleConstants.modalRightButton} onPress={onSend}>
          <Text normalText style={styleConstants.colorTextEnv}>
            {strings.send}
          </Text>
        </TouchableOpacity>
      </View>
    </Element>
  );
  return (
    <Modal visible={visible} style={styleConstants.modal} plain={Platform.OS !== 'android'}>
      {Platform.OS !== 'android' ? (
        <View style={[styleConstants.modal, styleConstants.modalIosContainer]}>{inner}</View>
      ) : (
        inner
      )}
    </Modal>
  );
};

export default RateTrip;

RateTrip.propTypes = {
  visible: PropTypes.bool,
  onSend: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  onChangeRating: PropTypes.func.isRequired,
  rating: PropTypes.number,
  order: PropTypes.object,
  comment: PropTypes.string,
  onChangeComment: PropTypes.func,
};
