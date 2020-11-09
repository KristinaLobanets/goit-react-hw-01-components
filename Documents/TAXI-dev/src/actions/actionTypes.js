export const authTypes = {
  SWITCH_REGISTRATION: 'SWITCH_REGISTRATION',
  LOGOUT: 'LOGOUT',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  GET_DEVICE_TOKEN: 'GET_DEVICE_TOKEN',
  GET_PROMO: 'GET_PROMO',
  FROM_LINK: 'FROM_LINK',
  GET_SMS_CODE: 'GET_SMS_CODE',
  CONNECTION_CHANGE: 'CONNECTION_CHANGE',
};

export const dataTypes = {
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  CLEAR_DRIVER_INFO: 'CLEAR_DRIVER_INFO',
  CLEAR_FEEDBACK: 'CLEAR_FEEDBACK',
  ADDRESS_NOMINATIM: 'ADDRESS_NOMINATIM',
  BONUS_CODE_CLEAR: 'BONUS_CODE_CLEAR',
  CLEAR_COMFORTABLE: 'CLEAR_COMFORTABLE',
  CLEAR_ROUTES: 'CLEAR_ROUTES',
};

export const popupTypes = {
  CREATE_POPUP: 'CREATE_POPUP',
};

export const userTypes = {
  SET_USER: 'SET_USER',
  SET_PHONE: 'SET_PHONE',
  SET_POSITION: 'SET_POSITION',
  SET_ADDRESS: 'SET_ADDRESS',
  SET_USER_INITIAL_ADDRESS: 'SET_USER_INITIAL_ADDRESS',
  SET_FROM: 'SET_FROM',
  SET_TO: 'SET_TO',
  SET_DEFAULT_CAR: 'SET_DEFAULT_CAR',
  SET_DEFAULT_LANG: 'SET_DEFAULT_LANG',
  GET_DEFAULT_LANG: 'GET_DEFAULT_LANG',
  SET_ORDER_OPTIONS: 'SET_ORDER_OPTIONS',
  SET_DEFAULT_PAYMENT_METHOD: 'SET_DEFAULT_PAYMENT_METHOD',
  GET_DEFAULT_PAYMENT_METHOD: 'GET_DEFAULT_PAYMENT_METHOD',
  DELETE_DEFAULT_CARD: 'DELETE_DEFAULT_CARD',
};

export const socketTypes = {
  CARS: 'CARS',
  REGISTER: 'REGISTER',
  SEND_SMS: 'SEND_SMS',
  LOGON: 'LOGON',
  GET_PROFILE: 'GET_PROFILE',
  EDIT_PROFILE: 'EDIT_PROFILE',

  ADDRESS_BY_LAT_LON: 'ADDRESS_BY_LAT_LON',
  SEARCH_ADDRESS_OBJECT: 'SEARCH_ADDRESS_OBJECT',
  ADDRESS_SEARCH: 'ADDRESS_SEARCH',
  GET_DRIVERS_ON_MAP: 'GET_DRIVERS_ON_MAP',
  GET_DRIVER_INFO: 'GET_DRIVER_INFO',

  GET_PHONES: 'GET_PHONES',
  ADD_PHONE: 'ADD_PHONE',
  DELETE_PHONE: 'DELETE_PHONE',

  GET_ADDRESS_TEMPLATES: 'GET_ADDRESS_TEMPLATES',
  ADD_ADDRESS_TEMPLATE: 'ADD_ADDRESS_TEMPLATE',
  EDIT_ADDRESS_TEMPLATE: 'EDIT_ADDRESS_TEMPLATE',
  DELETE_ADDRESS_TEMPLATE: 'DELETE_ADDRESS_TEMPLATE',

  CONFIRM_MESSAGE: 'CONFIRM_MESSAGE',
  GET_PAYMENT_AMOUNT: 'GET_PAYMENT_AMOUNT',
  CONFIRM_PAYMENT: 'CONFIRM_PAYMENT',
  GET_HISTORY: 'GET_HISTORY',
  DELETE_ORDER: 'DELETE_ORDER',
  BONUS_CODE: 'BONUS_CODE',
  FEEDBACK: 'FEEDBACK',
  FEEDBACK_HISTORY: 'FEEDBACK_HISTORY',

  GET_ADDITIONAL_FARES: 'GET_ADDITIONAL_FARES',
  GET_FARES: 'GET_FARES',
  GET_DATA: 'GET_DATA',
  GET_ORDER_MESSAGES: 'GET_ORDER_MESSAGES',
  GET_ORDER_DETAILS: 'GET_ORDER_DETAILS',
  CURRENT_MESSAGES: 'CURRENT_MESSAGES',
  CLEAR_CHAT: 'CLEAR_CHAT',

  SEND_MESSAGE: 'SEND_MESSAGE',
  SEND_MESSAGE_GO_OUT: 'SEND_MESSAGE_GO_OUT',
  SEND_MESSAGE_LINGER: 'SEND_MESSAGE_LINGER',

  CREATE_ORDER: 'CREATE_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  GET_PRICE: 'GET_PRICE',
  ORDER_PRICE: 'ORDER_PRICE',
  RANK_ORDER: 'RANK_ORDER',
  GET_SETTINGS: 'GET_SETTINGS',

  CURRENT_ORDERS: 'CURRENT_ORDERS',
  ADD_TRIP_TEMPLATE: 'ADD_TRIP_TEMPLATE',
  GET_TRIP_TEMPLATES: 'GET_TRIP_TEMPLATES',
  CREATE_TRIP_TEMPLATE: 'CREATE_TRIP_TEMPLATE',
  DELETE_TRIP_TEMPLATE: 'DELETE_TRIP_TEMPLATE',
  POPULAR_ADDRESSES: 'POPULAR_ADDRESSES',
  UPDATE_ORDER: 'UPDATE_ORDER',
  UPDATE_ADVANCE_ORDER: 'UPDATE_ADVANCE_ORDER',
  CHECK_NON_COMFORTABLE_PLACE: 'CHECK_NON_COMFORTABLE_PLACE',
  ROUTE: 'ROUTE',
  OBJECTS_IN_BOUNDS: 'OBJECTS_IN_BOUNDS',
  NEAREST_ADDRESSES: 'NEAREST_ADDRESSES',
  LAST_ADDRESSES: 'LAST_ADDRESSES',
};

export const errorTypes = {
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  REGISTER_ERROR: 'REGISTER_ERROR',
  REGISTER_ALREADY_EXIST: 'REGISTER_ALREADY_EXIST',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_NOT_EXIST: 'LOGIN_NOT_EXIST',
  FEEDBACK_ERROR: 'FEEDBACK_ERROR',
  BONUS_ERROR: 'BONUS_ERROR',
  CREATE_ORDER_ERROR: 'CREATE_ORDER_ERROR',
};

export const orderTypes = {
  CLEAR_ORDER: 'CLEAR_ORDER',
  CLEAR_ORDERS: 'CLEAR_ORDERS',
  CLEAR_DETAILS: 'CLEAR_DETAILS',
  DELETE_HISTORY_ITEM: 'DELETE_HISTORY_ITEM',
  SHOW_RATING: 'SHOW_RATING',
  RELOAD_HISTORY: 'RELOAD_HISTORY',
  CHOOSE_CONTACT: 'CHOOSE_CONTACT',
  GET_HISTORY_SEARCH: 'GET_HISTORY_SEARCH',
};

export const techTypes = {
  CHANGE_RIDES_TABS: 'CHANGE_RIDES_TABS',
  CREATE_TEMPLATE_PROCESS: 'CREATE_TEMPLATE_PROCESS',
  SWITCH_CORPORATE: 'SWITCH_CORPORATE',
  SET_ORDER_ID: 'SET_ORDER_ID',
  SELECT_SEARCH_CAR: 'SELECT_SEARCH_CAR',
};
