import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { Actions } from 'react-native-router-flux';
// import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { store } from '../App';
import { setAsyncStorage, removeAsyncStorage } from '../helpers';
import env from '../env';

class PushNotifications {
  constructor() {
    this.deviceToken = null;
    this.deviceOS = null;
    this.notSavedToken = true;
    this.notification = null;
    this.hasNewNotification = false;
  }

  saveDeviceToken() {
    if (!this.deviceToken) return;
    setAsyncStorage('device_token', this.deviceToken);
  }

  removeDeviceToken() {
    this.deviceToken = null;
    removeAsyncStorage('device_token');
  }

  async configPushNotifications() {
    if (Platform.OS === 'android') {
      PushNotification.configure({
        senderID: env.senderId,
        onNotification: notification => {
          this.notification = notification;
          this.processPushNotification();
        },
        onRegister: register => {
          this.deviceToken = register.token;
          this.deviceOS = register.os;
        },
        onError: () => {},
      });
    } else {
      const enabled = await messaging().hasPermission();
      if (enabled) {
        // user has permissions
        messaging()
          .getToken()
          .then(token => {
            this.deviceToken = token;
          });
      } else {
        // user doesn't have permission
        try {
          await messaging().requestPermission();
          // User has authorised
        } catch (error) {
          // User has rejected permissions
        }
      }
    }
  }

  processPushNotification() {
    /** CAR_NOT_FOUND
        ORDER_TAKEN
        AT_ADDRESS
        CLOSE_ORDER
        TRIP_STARTED
        ORDER_CANCELED
    */
    if (this.notification && this.notification.foreground === false) {
      if (this.notification.type === 'CLOSE_ORDER' && Actions.currentScene !== 'mapDir') {
        const showRating = store.getState().orders.showRating;
        if (showRating === false) {
          store.dispatch({ type: 'SHOW_RATING', payload: parseInt(this.notification.id, 10) });
        }
      }
    }
  }

  setBadgeNumber() {
    PushNotification.setApplicationIconBadgeNumber(0);
  }

  isNewNotification() {
    return this.hasNewNotification;
  }

  clearNewNotification() {
    this.hasNewNotification = false;
  }

  getDeviceToken() {
    return this.deviceToken;
  }
}

export default new PushNotifications();
