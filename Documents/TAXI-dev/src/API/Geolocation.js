import RNLocation from 'react-native-location';
import { Platform } from 'react-native';
import { strings } from '../helpers';

class Geolocation {
  init = async () => {
    const config = await RNLocation.configure({
      distanceFilter: 10, // Meters
      desiredAccuracy: {
        ios: 'best',
        android: 'highAccuracy',
      },
      ...Platform.select({
        ios: {
          activityType: 'other',
          allowsBackgroundLocationUpdates: false,
          headingFilter: 1, // Degrees
          headingOrientation: 'portrait',
          pausesLocationUpdatesAutomatically: false,
          showsBackgroundLocationIndicator: false,
        },
        android: {
          androidProvider: 'playServices',
          interval: 5000, // Milliseconds
          fastestInterval: 5000, // Milliseconds
          maxWaitTime: 5000, // Milliseconds
        },
      }),
    });
    return config;
  };

  requestPermissions = async permission => {
    const result = await RNLocation.requestPermission({
      ios: permission || 'whenInUse', // or 'always'
      android: {
        detail: permission || 'fine', // or 'fine'
        rationale: {
          title: strings.locationAccessHeader,
          message: strings.locationAccessRequest,
          buttonPositive: strings.confirm,
          buttonNegative: strings.cancel,
        },
      },
    });
    return result;
  };

  checkPermission = async permission => {
    const isPermission = await RNLocation.checkPermission({
      ios: permission || 'whenInUse', // or 'always'
      android: {
        detail: permission || 'fine', // or 'fine'
      },
    });
    return isPermission;
  };

  getCurrentPermission = async () => {
    const currentPermission = await RNLocation.getCurrentPermission();
    return currentPermission;
  };

  getLatestLocation = async () => {
    const latestLocation = await RNLocation.getLatestLocation({ timeout: 15000 });
    return latestLocation;
  };
}

export default new Geolocation();
