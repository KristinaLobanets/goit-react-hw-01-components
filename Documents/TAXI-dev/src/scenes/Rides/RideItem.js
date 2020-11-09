import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Text, Icon } from '../../components';
import { styleConstants, colors, strings } from '../../helpers';
import style from './style';
import env from '../../env';

const RideItem = ({
  item,
  onDelete,
  onCall,
  onDeleteOrder,
  onCancelPlanned,
  onChangePlanned,
  onDetailsOpen,
}) => {
  const template = item.templateId && item.templateId >= 0;
  const planned = !!item.address0;
  const templateName = template ? item.name : '';
  const history = !planned;
  return (
    <View style={style.rideContainer}>
      {template && (
        <View style={style.rideHeader}>
          <Text style={styleConstants.fontMedium}>
            {templateName || item.object || item.street0}
          </Text>
        </View>
      )}
      <TouchableOpacity
        style={style.directionsBody}
        disabled={!history}
        onPress={() => onDetailsOpen(template ? item.templateId : item.id)}
      >
        <View style={styleConstants.flex}>
          <View style={style.originContainer}>
            <View style={style.directionsIconContainer}>
              <View style={styleConstants.orangeDot} />
            </View>
            <Text normalText style={style.directionsText}>
              {planned
                ? item.address0
                : item.object0
                ? `${item.object0}, ${item.street0}, ${item.house0}`
                : `${item.street0}, ${item.house0}`}
            </Text>
          </View>
          {!!item.street1 && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.object1
                  ? `${item.object1}, ${item.street1 || ''}, ${item.house1 || ''}`
                  : `${item.street1}, ${item.house1 || ''}`}
              </Text>
            </View>
          )}
          {!!item.street2 && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.object2
                  ? `${item.object2}, ${item.street2 || ''}, ${item.house2 || ''}`
                  : `${item.street2}, ${item.house2 || ''}`}
              </Text>
            </View>
          )}
          {!!item.street3 && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.object3
                  ? `${item.object3}, ${item.street3 || ''}, ${item.house3 || ''}`
                  : `${item.street3}, ${item.house3 || ''}`}
              </Text>
            </View>
          )}
          {!!item.street4 && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.object4
                  ? `${item.object4}, ${item.street4 || ''}, ${item.house4 || ''}`
                  : `${item.street4}, ${item.house4 || ''}`}
              </Text>
            </View>
          )}
          {!!item.address1 && item.address1[0] !== ',' && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.address1}
              </Text>
            </View>
          )}
          {!!item.address2 && item.address2[0] !== ',' && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.address2}
              </Text>
            </View>
          )}
          {!!item.address3 && item.address3[0] !== ',' && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.address3}
              </Text>
            </View>
          )}
          {!!item.address4 && item.address4[0] !== ',' && (
            <View style={style.destinationContainer}>
              <View style={style.directionsIconContainer}>
                <Icon name="marker" size={11} />
              </View>
              <Text normalText style={style.directionsText}>
                {item.address4}
              </Text>
            </View>
          )}
        </View>
        {!!item.street1 && (
          <View style={style.replaceContainer}>
            <TouchableOpacity
              style={style.replaceButton}
              onPress={() => onCall(item, true)}
              hitSlop={{ top: 20, bottom: 20, right: 20, left: 20 }}
            >
              <Icon name="refresh" color={colors.darkGrey} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={style.rideFooter}
        disabled={!history}
        onPress={() => onDetailsOpen(template ? item.templateId : item.id)}
      >
        <Text smallRegular>{`${item.priceName || ''}`}</Text>
        {template ? (
          <View style={style.paymentContainer}>
            <Icon
              name={
                item.paymentTypeId === 0
                  ? 'cash'
                  : item.paymentTypeId === 1
                  ? 'credit-card'
                  : 'rocket'
              }
              color={colors.green}
            />
            <Text smallRegular style={style.paymentText}>
              {item.paymentTypeId === 0
                ? strings.cash
                : item.paymentTypeId === 1
                ? strings.payWithCreditCard
                : item.paymentTypeId === 2
                ? strings.bonusPay
                : strings.cashless}
            </Text>
          </View>
        ) : (
          [
            !!item.price && (
              <Text smallBlackText key="price" style={[style.paymentText, styleConstants.fontBold]}>
                {`${item.price} ${env.app_currency}`}
              </Text>
            ),
            <Text
              smallRegular={!planned}
              smallBlackText={planned}
              key="dt"
              style={[style.paymentText, planned ? { color: colors.red } : null]}
            >
              {moment(planned ? item.orderTime : item.dt, 'DD-MM-YYYY HH:mm').format(
                'DD.MM.YYYY HH:mm'
              )}
            </Text>,
          ]
        )}
      </TouchableOpacity>
      {template ? null : item.allowDelete === false ? (
        <Text smallRegular style={style.statusText}>
          {strings.corporateFare}
        </Text>
      ) : null}
      {template ? null : item.statusId === 7 || item.statusId === 12 ? (
        <Text smallRegular style={style.statusText}>
          {item.statusId === 7
            ? strings.taxiNotFound
            : item.statusId === 12
            ? strings.canceled
            : ''}
        </Text>
      ) : null}
      <View style={styleConstants.modalButtonsContainer}>
        {((!planned && !template && item?.allowDelete) || planned || template) && (
          <TouchableOpacity
            style={[styleConstants.modalLeftButton, style.deleteButton]}
            onPress={
              template
                ? () => onDelete(item)
                : planned
                ? () => onCancelPlanned(item)
                : () => onDeleteOrder(item)
            }
          >
            <Text normalText>{planned ? strings.cancel : strings.remove}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styleConstants.modalRightButton}
          onPress={planned ? () => onChangePlanned(item) : () => onCall(item)}
        >
          <Text normalText style={styleConstants.colorTextEnv}>
            {planned ? strings.change : strings.order}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideItem;

RideItem.propTypes = {
  onDelete: PropTypes.func,
  onDeleteOrder: PropTypes.func,
  onCancelPlanned: PropTypes.func,
  onChangePlanned: PropTypes.func,
  onCall: PropTypes.func,
  item: PropTypes.object.isRequired,
  onDetailsOpen: PropTypes.func,
};
