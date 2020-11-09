import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { strings } from './localization';

export const showImagePicker = () => {
  const options = {
    title: strings.selectPhoto,
    rotation: 360,
    quality: 0.3,
    maxHeight: 320,
    maxWidth: 320,
    permissionDenied: {
      title: strings.permissionDeniedTitle,
      text: strings.permissionDeniedText,
      reTryTitle: strings.permissionDeniedRetry,
      okTitle: strings.permissionDeniedSure,
    },
    cancelButtonTitle: strings.cancel,
    takePhotoButtonTitle: strings.takePhoto,
    chooseFromLibraryButtonTitle: strings.chooseFromLibrary,
  };

  return new Promise((resolve, reject) =>
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        reject(response.didCancel);
      } else if (response.error) {
        reject(response.error);
      } else {
        const source = `data:image/jpeg;base64,${response.data}`;
        resolve(source);
      }
    })
  );
};

export const getAsyncStorage = async (key, error = e => e) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    return error(e);
  }
};

export const setAsyncStorage = async (key, value, error = e => e) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    return error(e);
  }
};

export const removeAsyncStorage = async (key, error = e => e) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    return error(e);
  }
};

export const generatePIN = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const unmaskPhone = text => {
  const data = text.split('');
  const digit = new RegExp(/[0-9]/);
  let phone = '+';
  data.forEach(el => {
    if (digit.test(el)) {
      phone += el;
    }
  });
  return phone;
};

export const removeDuplicates = (myArr, prop) => {
  return myArr.filter((obj, pos, arr) => {
    return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
};

export const getCorrectPhoneNumber = number => {
  const joinedNumber = number
    .split('-')
    .join('')
    .split(' ')
    .join('');
  const slicedNumber = joinedNumber.slice(joinedNumber.length - 10);
  return slicedNumber;
};

export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export const getDataFromRoutes = array => {
  let totalDistance = 0; // дистанция в метрах
  let totalTime = 0; // время в секундах
  let routes = [];

  if (array && array.length > 1) {
    array.forEach(el => {
      totalDistance += el.properties.distance;
      totalTime += el.properties.cost * 3600;
      routes = [
        ...routes,
        ...el.geometry.coordinates.map(i => ({ longitude: i[0], latitude: i[1] })),
      ];
    });
    return {
      totalDistance,
      totalTime,
      routes,
    };
  }
  return null;
};

export const getBoundByRegion = (region, scale = 1) => {
  /*
   * Latitude : max/min +90 to -90
   * Longitude : max/min +180 to -180
   */
  // Of course we can do it mo compact but it wait is more obvious
  const calcMinLatByOffset = (lng, offset) => {
    const factValue = lng - offset;
    if (factValue < -90) {
      return (90 + offset) * -1;
    }
    return factValue;
  };

  const calcMaxLatByOffset = (lng, offset) => {
    const factValue = lng + offset;
    if (factValue > 90) {
      return (90 - offset) * -1;
    }
    return factValue;
  };

  const calcMinLngByOffset = (lng, offset) => {
    const factValue = lng - offset;
    if (factValue < -180) {
      return (180 + offset) * -1;
    }
    return factValue;
  };

  const calcMaxLngByOffset = (lng, offset) => {
    const factValue = lng + offset;
    if (factValue > 180) {
      return (180 - offset) * -1;
    }
    return factValue;
  };

  const latOffset = (region.latitudeDelta / 2) * scale;
  const lngD = region.longitudeDelta < -180 ? 360 + region.longitudeDelta : region.longitudeDelta;
  const lngOffset = (lngD / 2) * scale;

  return {
    minLng: calcMinLngByOffset(region.longitude, lngOffset), // westLng - min lng
    minLat: calcMinLatByOffset(region.latitude, latOffset), // southLat - min lat
    maxLng: calcMaxLngByOffset(region.longitude, lngOffset), // eastLng - max lng
    maxLat: calcMaxLatByOffset(region.latitude, latOffset), // northLat - max lat
  };
};

export const getTemplateName = (templates, name) => {
  let defaultName = name;
  let count = 1;
  let isUnique = true;
  const checkUnique = checkname => {
    isUnique = templates.some(el => el.name === checkname);
    if (!isUnique) {
      return defaultName;
    }
    defaultName += ` ${count}`;
    count += 1;
    return checkUnique(defaultName);
  };
  return checkUnique(defaultName);
};
