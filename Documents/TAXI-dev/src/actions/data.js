import Socket from '../API/WS';
import { socketTypes, userTypes, dataTypes, errorTypes, orderTypes } from './actionTypes';
import { setAsyncStorage } from '../helpers';

export const clearSearch = () => dispatch => {
  dispatch({
    type: dataTypes.CLEAR_SEARCH,
  });
};
export const clearFeedback = () => dispatch => {
  dispatch({
    type: dataTypes.CLEAR_FEEDBACK,
    payload: '',
  });
};

export const clearDriverInfo = () => dispatch => {
  dispatch({
    type: dataTypes.CLEAR_DRIVER_INFO,
  });
};

export const clearEditProfile = () => dispatch => {
  dispatch({
    type: socketTypes.EDIT_PROFILE,
    payload: undefined,
  });
};
export const clearChatWithDriver = () => dispatch => {
  dispatch({
    type: socketTypes.CLEAR_CHAT,
    payload: '',
  });
};

export const clearBonuses = () => dispatch => {
  dispatch({
    type: dataTypes.BONUS_CODE_CLEAR,
  });
};

export const clearComfortable = () => dispatch => {
  dispatch({
    type: dataTypes.CLEAR_COMFORTABLE,
  });
};

export const clearRoutes = () => dispatch => {
  dispatch({
    type: dataTypes.CLEAR_ROUTES,
  });
};

export const clearDetails = () => dispatch => {
  dispatch({
    type: orderTypes.CLEAR_DETAILS,
  });
  return Promise.resolve();
};

export const addressNominatim = data => dispatch => {
  dispatch({
    type: dataTypes.ADDRESS_NOMINATIM,
    payload: data,
  });
};

export const socketAPI = (command, data, props) => async dispatch => {
  const isSocket = Socket.get();
  if (!isSocket || isSocket.readyState !== 1) {
    await Socket.open();
  }

  Socket.send(command, data);

  Socket.get().onmessage = e => {
    if (e.data === '') e.data = '{}';
    const event = JSON.parse(e.data);
    console.log(event);
    switch (event.command) {
      case 'CARS':
        return dispatch({
          type: socketTypes.CARS,
          payload: event.data,
        });

      case 'REGISTER':
        if (event.data.success) {
          setAsyncStorage('logon', JSON.stringify(event.data.success));
        }
        if (event.data.error) {
          return dispatch({
            type: errorTypes.REGISTER_ERROR,
            payload: event.data.error,
          });
        }
        if (event.data.alreadyExists) {
          return dispatch({
            type: errorTypes.REGISTER_ALREADY_EXIST,
            payload: event.data.alreadyExists,
          });
        }
        return dispatch({
          type: userTypes.SET_USER,
          payload: event.data.success ? event.data.success : undefined,
        });

      case 'SEND_SMS':
        if (event.data.success) {
          return dispatch({
            type: socketTypes.SEND_SMS,
            payload: event.data,
          });
        }
        return Promise.reject(event.data.error);

      case 'LOGON':
        if (event.data.success) {
          setAsyncStorage('logon', JSON.stringify(event.data.success));
        }
        if (event.data.error) {
          return dispatch({
            type: errorTypes.LOGIN_ERROR,
            payload: event.data.error,
          });
        }
        if (event.data.notExists) {
          return dispatch({
            type: errorTypes.LOGIN_NOT_EXIST,
            payload: event.data.notExists,
          });
        }
        return dispatch({
          type: userTypes.SET_USER,
          payload: event.data.success ? event.data.success : undefined,
        });

      case 'GET_PROFILE':
        return dispatch({
          type: socketTypes.GET_PROFILE,
          payload: event.data,
        });

      case 'EDIT_PROFILE':
        return dispatch({
          type: socketTypes.EDIT_PROFILE,
          payload: event.data.success,
        });

      case 'ADDRESS_BY_LAT_LON':
        return dispatch({
          type: socketTypes.ADDRESS_BY_LAT_LON,
          payload: event.data,
        });

      case 'SEARCH_ADDRESS_OBJECT':
        return dispatch({
          type: socketTypes.SEARCH_ADDRESS_OBJECT,
          payload: event.data,
        });

      case socketTypes.ADDRESS_SEARCH:
        return dispatch({
          type: socketTypes.ADDRESS_SEARCH,
          payload: event.data,
        });

      case 'GET_FARES':
        return dispatch({
          type: socketTypes.GET_FARES,
          payload: event.data,
        });

      case 'GET_DRIVERS_ON_MAP':
        return dispatch({
          type: socketTypes.GET_DRIVERS_ON_MAP,
          payload: event.data,
        });

      case 'GET_ADDRESS_TEMPLATES':
        return dispatch({
          type: socketTypes.GET_ADDRESS_TEMPLATES,
          payload: event.data,
        });

      case 'ADD_ADDRESS_TEMPLATE':
        return dispatch({
          type: socketTypes.ADD_ADDRESS_TEMPLATE,
          payload: event.data,
        });

      case 'EDIT_ADDRESS_TEMPLATE':
        return dispatch({
          type: socketTypes.EDIT_ADDRESS_TEMPLATE,
          payload: event.data,
        });

      case 'DELETE_ADDRESS_TEMPLATE':
        return dispatch({
          type: socketTypes.DELETE_ADDRESS_TEMPLATE,
          payload: event.data,
        });

      case 'CREATE_ORDER':
        if (event.data.success) {
          return dispatch({
            type: socketTypes.CREATE_ORDER,
            payload: event.data.success,
          });
        }
        if (event.data.error) {
          return dispatch({
            type: errorTypes.CREATE_ORDER_ERROR,
            payload: event.data.error,
          });
        }
        return;

      case 'CANCEL_ORDER':
        return dispatch({
          type: socketTypes.CANCEL_ORDER,
          payload: event.data,
        });

      case 'CURRENT_ORDERS':
        return dispatch({
          type: socketTypes.CURRENT_ORDERS,
          payload: event.data,
        });

      case 'GET_HISTORY':
        if (props) {
          return dispatch({
            type: orderTypes.GET_HISTORY_SEARCH,
            payload: event.data,
          });
        }
        return dispatch({
          type: socketTypes.GET_HISTORY,
          payload: event.data,
        });

      case 'ADD_TRIP_TEMPLATE':
        return dispatch({
          type: socketTypes.ADD_TRIP_TEMPLATE,
          payload: event.data,
        });

      case 'GET_TRIP_TEMPLATES':
        return dispatch({
          type: socketTypes.GET_TRIP_TEMPLATES,
          payload: event.data,
        });

      case 'DELETE_TRIP_TEMPLATE':
        return dispatch({
          type: socketTypes.DELETE_TRIP_TEMPLATE,
          payload: event.data,
        });

      case 'GET_PRICE':
        return dispatch({
          type: socketTypes.GET_PRICE,
          payload: event.data,
        });

      case socketTypes.ORDER_PRICE:
        return dispatch({
          type: socketTypes.ORDER_PRICE,
          payload: event.data,
        });

      case 'GET_DRIVER_INFO':
        return dispatch({
          type: socketTypes.GET_DRIVER_INFO,
          payload: event.data,
        });

      case 'GET_ORDER_DETAILS':
        return dispatch({
          type: socketTypes.GET_ORDER_DETAILS,
          payload: event.data,
        });

      case 'DELETE_ORDER':
        return dispatch({
          type: socketTypes.DELETE_ORDER,
          payload: event.data,
        });

      case 'GET_SETTINGS':
        return dispatch({
          type: socketTypes.GET_SETTINGS,
          payload: event.data,
        });

      case 'FEEDBACK':
        if (event.data.success) {
          return dispatch({
            type: socketTypes.FEEDBACK,
            payload: event.data.success,
          });
        }
        if (event.data.error) {
          return dispatch({
            type: errorTypes.FEEDBACK_ERROR,
            payload: event.data.error,
          });
        }
        return;

      case 'RANK_ORDER':
        return dispatch({
          type: socketTypes.RANK_ORDER,
          payload: event.data,
        });
      // not in use currently

      case 'GET_PHONES':
        return dispatch({
          type: socketTypes.GET_PHONES,
          payload: event.data,
        });

      case 'ADD_PHONE':
        return dispatch({
          type: socketTypes.ADD_PHONE,
          payload: event.data,
        });

      case 'DELETE_PHONE':
        return dispatch({
          type: socketTypes.DELETE_PHONE,
          payload: event.data,
        });

      case 'CONFIRM_MESSAGE':
        return dispatch({
          type: socketTypes.CONFIRM_MESSAGE,
          payload: event.data,
        });

      case 'GET_PAYMENT_AMOUNT':
        return dispatch({
          type: socketTypes.GET_PAYMENT_AMOUNT,
          payload: event.data,
        });

      case 'CONFIRM_PAYMENT':
        return dispatch({
          type: socketTypes.CONFIRM_PAYMENT,
          payload: event.data,
        });

      case 'BONUS_CODE':
        if (event.data.error) {
          return dispatch({
            type: errorTypes.BONUS_ERROR,
            payload: event.data.error,
          });
        }
        return dispatch({
          type: socketTypes.BONUS_CODE,
          payload: event.data,
        });

      case 'GET_ADDITIONAL_FARES':
        return dispatch({
          type: socketTypes.GET_ADDITIONAL_FARES,
          payload: event.data,
        });

      case 'GET_DATA':
        return dispatch({
          type: socketTypes.GET_DATA,
          payload: event.data,
        });

      case 'GET_ORDER_MESSAGES':
        return dispatch({
          type: socketTypes.GET_ORDER_MESSAGES,
          payload: event.data,
        });

      case 'SEND_MESSAGE':
        return dispatch({
          type: socketTypes.SEND_MESSAGE,
          payload: event.data,
        });

      case 'CURRENT_MESSAGES':
        return dispatch({
          type: socketTypes.CURRENT_MESSAGES,
          payload: event.data,
        });

      case socketTypes.POPULAR_ADDRESSES:
        return dispatch({
          type: socketTypes.POPULAR_ADDRESSES,
          payload: event.data,
        });

      case socketTypes.FEEDBACK_HISTORY:
        return dispatch({
          type: socketTypes.FEEDBACK_HISTORY,
          payload: event.data,
        });

      case socketTypes.CHECK_NON_COMFORTABLE_PLACE:
        return dispatch({
          type: socketTypes.CHECK_NON_COMFORTABLE_PLACE,
          payload: event.data,
        });

      case socketTypes.ROUTE:
        return dispatch({
          type: socketTypes.ROUTE,
          payload: JSON.parse(event.data),
        });

      case socketTypes.NEAREST_ADDRESSES:
        return dispatch({
          type: socketTypes.NEAREST_ADDRESSES,
          payload: event.data?.addresses
            ?.filter(el => el.street && el.name?.[0] !== ' ')
            .filter(el => el.lat),
        });

      case socketTypes.OBJECTS_IN_BOUNDS:
        return dispatch({
          type: socketTypes.OBJECTS_IN_BOUNDS,
          payload: event.data,
        });

      case socketTypes.LAST_ADDRESSES:
        return dispatch({
          type: socketTypes.LAST_ADDRESSES,
          payload: event.data,
        });

      default:
        break;
    }
  };
};

export const docs = `

Endpoint:
ws://server:port/ws/client

Запрос:
{ "command" : command, "data" : data }


Ответ:
{ "command" : command, "data" : data }


Где command - одна из команд:

CARS - список авто из справочника
Запрос: { "command" : "CARS", "data" : null }
Ответ: { "command" : "CARS", "data" : ArrayList<Car>}
Car {
int id; // id авто в справочнике
String name; // марка авто в справочнике
}

ADDRESS_BY_LAT_LON - получить ближайшие адреса по координатам из справочника
Запрос: { "command" : "ADDRESS_BY_LAT_LON", "data" : { "taxiToken" : "1dscf45djud-dr42", "lat" : 46.28, "lon" : 50.23, "lang": "ru" } }
lang = код языка для поиска
Ответ: { "command" : "ADDRESS_BY_LAT_LON", "data" : ArrayList<Address> }
Address {
	int id; // id адреса в справочнике
	String name; // полное название - объект + улица + дом
	String object; // название объекта
	String street; // название улицы
	String house; // номер дома
	double lat; // широта
	double lon; // долгота
	double distance; // дистанция до точки
	int type; // тип точки: enum { 0 - только улица; 1 - адрес; 2 - объект }
}

POPULAR_ADDRESSES - получить популярные адреса
Запрос: { "command" : "POPULAR_ADDRESSES", "data" : {  "taxiToken" : "1dscf45djud-dr42", "search" : "Вокзал" } }
Ответ: { "command" : "POPULAR_ADDRESSES", "data" : ArrayList<Address> }
Address {
	int id; // id адреса в справочнике
	String name; // полное название - объект + улица + дом
	String object; // название объекта
	String street; // название улицы
	String house; // номер дома
	double lat; // широта
	double lon; // долгота
	double distance; // дистанция до точки
	int type; // тип точки: enum { 0 - только улица; 1 - адрес; 2 - объект }
}

LAST_ADDRESSES - получить недавние адреса
Запрос: { "command" : "LAST_ADDRESSES", "data" : {  "clientId" : 7 } }
Ответ: { "command" : "LAST_ADDRESSES", "data" : ArrayList<Address> }

NEAREST_ADDRESSES - получить ближайшие адреса
Запрос: { "command" : "NEAREST_ADDRESSES", "data" : {  "clientId" : 7, "latitude" : 49.4361317335069, "longitude": 26.9854056571013 } }
Ответ: { "command" : "NEAREST_ADDRESSES", "data" : ArrayList<Address> }


ADDRESS_SEARCH - поиск адресов и объектов по регулярному выражению
Запрос: { "command" : "ADDRESS_SEARCH", "data" : { "taxiToken" : "1dscf45djud-dr42", "search": "мира", "lang": "ru" } }
Ответ: { "command" : "ADDRESS_SEARCH", "data" : ArrayList<Address> }

SEND_SMS - отправка СМС
Запрос: { "command" : "SEND_SMS", "data" : { "taxiToken" : "1dscf45djud-dr42", "phone": "+380671112233", "text" : "Hello" } }
taxiToken - идентификатор такси, константа
Ответ: { "command" : "SEND_SMS", "data" : Response }
Response {
	String success;
	String error;
}

GET_PHONES - получить список телефонов клиента
Запрос: { "command" : "GET_PHONES", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_PHONES", "data" : ArrayList<String> }

ADD_PHONE - добавление телефона клиента
Запрос: { "command" : "ADD_PHONE", "data" : { "clientId" : 1234, "phone": "+380671112233" } }
Ответ: { "command" : "ADD_PHONE", "data" : Response }

DELETE_PHONE - удаление телефона клиента
Запрос: { "command" : "DELETE_PHONE", "data" : { "clientId" : 1234, "phone": "+380671112233" } }
Ответ: { "command" : "DELETE_PHONE", "data" : Response }

ADD_TRIP_TEMPLATE - добавление шаблона поездки с заказа
Запрос: { "command" : "ADD_TRIP_TEMPLATE", "data" : { "clientId" : 1234, "orderId": 123, "name": "Работа" } }
Ответ: { "command" : "ADD_TRIP_TEMPLATE", "data" : Response }

GET_TRIP_TEMPLATES - получить список шаблонов поездок клиента
Запрос: { "command" : "GET_TRIP_TEMPLATES", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_TRIP_TEMPLATES", "data" : ArrayList<TripTemplate> }
TripTemplate {
	int templateId;
	String name;
	double lat0;
	double lon0;
	double lat1;
	double lon1;
	double lat2;
	double lon2;
	double lat3;
	double lon3;
	double lat4;
	double lon4;
	String object0; // объект откуда
	String street0; // улица откуда
	String house0; // дом откуда
	String object1; // объект куда
	String street1; // улица куда
	String house1; // дом куда
String object2; // объект куда
	String street2; // улица куда
	String house2; // дом куда
String object3; // объект куда
	String street3; // улица куда
	String house3; // дом куда
	String object4; // объект куда
	String street4; // улица куда
	String house4; // дом куда
	String entrance; // подъезд
	String apartment; // квартира
	String comments; // комментарии
	int standardTypeId; // тип авто enum { 1 - эконом; 2 - стандарт; 3 -	премиум; 4 - бизнесс; 5 - универсал малый; 6 - универсал средний; 7 - универсал большой; 8 - минивен 5; 9 - минивен 6; 10 - минивен 7; 11 - минивен 8; 12 - грузовой }
	int paymentTypeId; // тип оплаты enum { 0 - наличные; 1 - кредитка; 2 - бонусы; 3 - безнал }
	int priceId; // id тарифа
        	boolean emptyTrunk;
        	boolean lowLanding;
        	boolean tinted;
        	boolean receipt;
        	boolean conditioner;
        	boolean terminal;
        	boolean animals;
        	boolean childSeat;
}

CREATE_TRIP_TEMPLATE - создать новый шаблон поездки
Запрос: { "command" : "CREATE_TRIP_TEMPLATE", "data" : { "clientId" : 1234, "name": "Шаблон123", "lat0": 49.45, "lon0": 26.45, "lat1": null, "lon1": null, "lat2": null, "lon2": null, "lat3": null, "lon3": null, "lat4": null, "lon4": null, "object0": "Термопласт", "street0": "Курчатова ул.", "house0": "8", "object1": null, "street1": null, "house1": null, "object2": null, "street2": null, "house2": null, "object3": null, "street3": null, "house3": null, "object4": null, "street4": null, "house4": null, "entrance": null, "apartment": null, "comments": "остановка", "emptyTrunk": false, "lowLanding": false, "tinted": false, "receipt": false, "terminal": false, "conditioner": false, "animals": false, "childSeat": false, "paymentTypeId": 0, "priceId" : 2 } }
Ответ: { "command" : "CREATE_TRIP_TEMPLATE", "data" : Response }

DELETE_TRIP_TEMPLATE - удаление шаблона поездки
Запрос: { "command" : "DELETE_ADDRESS_TEMPLATE", "data" : { "clientId" : 1234, "templateId": 65677 } }
Ответ: { "command" : "DELETE_ADDRESS_TEMPLATE", "data" : Response }

GET_ADDRESS_TEMPLATES - получить список шаблонов клиента
Запрос: { "command" : "GET_ADDRESS_TEMPLATES", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_ADDRESS_TEMPLATES", "data" : ArrayList<AddressTemplate> }
AddressTemplate {
	int templateId;
	int iconId;
	String name;
	String object;
	String street;
	String house;
	String entrance;
	String apartment;
	String comments;
	double lat;
	double lon;
}

ADD_ADDRESS_TEMPLATE - добавление шаблона адреса
Запрос: { "command" : "ADD_ADDRESS_TEMPLATE", "data" : { "clientId" : 1234, "iconId": 123, "name": "Работа", "object" : "Термопласт", "street" : "Курчатова ул.", "house" : "8", "entrance" : null, "apartment" : null, "comments" : "остановка", "lat" : 49.345, "lon" : 26.567 } }
Ответ: { "command" : "ADD_ADDRESS_TEMPLATE", "data" : Response }

EDIT_ADDRESS_TEMPLATE - редактирование шаблона адреса
Запрос: { "command" : "EDIT_ADDRESS_TEMPLATE", "data" : { "clientId" : 1234, "templateId": 65677 , "iconId": 123, "name": "Работа", "object" : "Термопласт", "street" : "Курчатова ул.", "house" : "8", "entrance" : null, "apartment" : null, "comments" : "остановка", "lat" : 49.345, "lon" : 26.567 } }
Ответ: { "command" : "EDIT_ADDRESS_TEMPLATE", "data" : Response }

DELETE_ADDRESS_TEMPLATE - удаление шаблона адреса
Запрос: { "command" : "DELETE_ADDRESS_TEMPLATE", "data" : { "clientId" : 1234, "templateId": 65677 } }
Ответ: { "command" : "DELETE_ADDRESS_TEMPLATE", "data" : Response }

CONFIRM_MESSAGE - подтверждение полученного сообщения
Запрос: { "command" : "CONFIRM_MESSAGE", "data" : { "clientId" : 1234, "messageId": 45678 } }
Ответ: { "command" : "CONFIRM_MESSAGE", "data" : Response }

GET_PAYMENT_AMOUNT - получить сумму для безналичного платежа по заказу
Запрос: { "command" : "GET_PAYMENT_AMOUNT", "data" : { "clientId" : 1234, "orderId": 45678 } }
Ответ: { "command" : "GET_PAYMENT_AMOUNT", "data" : PaymentResponse }
PaymentResponse {
	double success; // сумма платежа
	String error;
}

CONFIRM_PAYMENT - подтверждение безналичного платежа
Запрос: { "command" : "CONFIRM_PAYMENT", "data" : { "clientId" : 1234, "orderId": 45678,  "amount": 108.56 } }
Ответ: { "command" : "CONFIRM_PAYMENT", "data" : Response }

GET_HISTORY - история заказов
Запрос: { "command" : "GET_HISTORY", "data" : { "clientId" : 1234, "limit": 10,  "offset": 20, "addressFrom" : null, "addressTo" :null, "timeFrom" : null, "timeTo" : null, "carTypeId" : null } }
Ответ: { "command" : "GET_HISTORY", "data" : ArrayList<OrderHistory> }
OrderHistory {
	int id; // id заказа
	String dt; // дата и время заказа DD-MM-YYYY HH24:MI
	double lat0;
	double lon0;
	double lat1;
	double lon1;
	double lat2;
	double lon2;
	double lat3;
	double lon3;
	double lat4;
	double lon4;
	String object0; // объект откуда
	String street0; // улица откуда
	String house0; // дом откуда
	String object1; // объект куда
	String street1; // улица куда
	String house1; // дом куда
String object2; // объект куда
	String street2; // улица куда
	String house2; // дом куда
String object3; // объект куда
	String street3; // улица куда
	String house3; // дом куда
	String object4; // объект куда
	String street4; // улица куда
	String house4; // дом куда
	String entrance; // подъезд
	String apartment; // квартира
	String comments; // комментарии
	int standardTypeId; // тип авто enum { 1 - эконом; 2 - стандарт; 3 -	премиум; 4 - бизнесс; 5 - универсал малый; 6 - универсал средний; 7 - универсал большой; 8 - минивен 5; 9 - минивен 6; 10 - минивен 7; 11 - минивен 8; 12 - грузовой }
	int statusId; // статус заказа enum { 1 - Новый; 2 - Подтверждение; 3 - Принят; 4 - По адресу; 5 - С пассажиром; 6 - Закрыт; 7 - Без машины; 8 - Зарезервирован; 9 - Отмена (вина оператора); 10 - Отмена (вина клиента); 11 - Отмена (вина водителя); 12 - Отмена клиентом; 13 - Заблокировано агрегатором; 14 - Предварительный}
	double price; // стоимость 
	int paymentTypeId; // тип оплаты enum { 0 - наличные; 1 - кредитка; 2 - бонусы; 3 - безнал }
	boolean allowDelete; // флаг возможности удаления поездки
}

DELETE_ORDER - удаление заказа из истории
Запрос: { "command" : "DELETE_ORDER", "data" : { "clientId" : 1234, "orderId": 45678 } }
Ответ: { "command" : "DELETE_ORDER", "data" : Response }

GET_PROFILE - получить профиль клиента
Запрос: { "command" : "GET_PROFILE", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_PROFILE", "data" : Profile }
Profile {
	String name; // имя
	String phone; // телефон
	String dateOfBirth; // дата рождения DD-MM-YYYY
	String email; // email
	boolean disableCall; // флаг Не звонить
	String base64Photo; // фото в base64
	boolean showActions; // показывать акции
        	boolean showPriceNotification; // показывать снижение цены
int defaultPaymentType; // тип оплаты по-умолчанию: 0 - наличка, 1 - карта
        	CreditCard defaultCreditCard; // кредитная карта по-умолчанию
	ArrayList<CreditCard> creditCards; // список кредиток
String inviteCode; // инвайт код
double balance; // баланс клиента 
Integer clientNum; // номер клиента
boolean isActive; // флаг клиента разблокирован/заблокирован
int priceId; // тариф по-умолчанию
boolean allowChangePriceId; // разрешить менять тариф по-умолчанию
int corporateId; // если не 0, значит есть id корпоративного клиента
Integer[] paymentTypes; // доступные типы оплаты для  личных поездок
Integer[] corporatePaymentTypes; //доступные типы оплаты для  корпоративных поездок
}

Типы оплаты:
0 => 'Cash',
1 => 'Credit card',
2 => 'Bonus',
3 => 'Cashless',
4 => 'Google Pay',
5 => 'Apple Pay',


CreditCard {
int cardId; // id в базе, нужно для удаления
String maskedCard; // храним последние 4 цифры
        	private String cardType; // тип: Visa, MasterCard и т.д.
        	private String cardToken; // токен карты, который дает мерчант
}
TODO добавить соцсети

EDIT_PROFILE - редактировать профиль
Запрос: { "command" : "EDIT_PROFILE", "data" : { "clientId" : 1234, "name" : "Саша", "phone": "+380671112233", "dateOfBirth" : "01-02-1990", "email": "test@example.com", "disableCall" : false, "base64Photo" : null, "showActions" : true, "showPriceNotification" : true, "defaultPaymentType" : 0, "defaultCreditCardId" : null, "lang": "ru", "priceId" : 13 } }
Ответ: { "command" : "EDIT_PROFILE", "data" : Response }

BONUS_CODE - ввод промокода
Запрос: { "command" : "BONUS_CODE", "data" : { "clientId" : 1234, "code" : "BG12FD45" } }
Ответ: { "command" : "BONUS_CODE", "data" : BonusCodeResponse }
BonusCodeResponse {
	double amount; // сумма пополнения
	int bonusCount; // количество бонусных поездок
	String error; // "already taken", "already used", прочие ошибки
}

FEEDBACK - написать отзыв
Запрос: { "command" : "FEEDBACK", "data" : { "clientId" : 1234, "text" : "Коэффициент 1.5 в час пик просто ужас, больше вызывать не буду!!!111" } }
Ответ: { "command" : "FEEDBACK", "data" : Response }

FEEDBACK_HISTORY - история отзывов
Запрос: { "command" : "FEEDBACK_HISTORY", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "FEEDBACK_HISTORY, "data" : FeedbackResponse }
FeedbackResponse {
        public String dt;
        public String message;
        public String reply;    
}

GET_ADDITIONAL_FARES - дополнительные тарифы в форме заказа
Запрос: { "command" : "GET_ADDITIONAL_FARES", "data" : { "taxiToken" : "700400"} }
Ответ: { "command" : "GET_ADDITIONAL_FARES", "data" : AdditionalFare }
AdditionalFare {
	double emptyTrunkAdd; // пустой багажник доплата
	double emptyTrunkMulti; // пустой багажник коэффициент
	double lowLandingAdd; // низкая посадка доплата
	double lowLandingMulti; // низкая посадка коэффициент
	double tintedAdd; // тонировка доплата
	double tintedMulti; // тонировка коэффициент
	double receiptAdd; // чек доплата
	double receiptMulti; // чек коэффициент
	double terminalAdd; // терминал доплата
	double terminalMulti; // терминал коэффициент
	double conditionerAdd; // кондиционер доплата
	double conditionerMulti; // кондиционер коэффициент
	double animalsAdd; // животные доплата
	double animalsMulti; // животные коэффициент
	double childSeatAdd; // детское кресло доплата
	double childSeatMulti; // детское кресло коэффициент
}

GET_FARES - список тарифов
Запрос: { "command" : "GET_FARES", "data" : {  "taxiToken" : "700400" } }
Ответ: { "command" : "GET_FARES", "data" : ArrayList<Fare> }
Fare {
	int standardTypeId; // id стандартного типа enum { 1 - эконом; 2 - стандарт; 3 -	премиум; 4 - бизнесс; 5 - универсал малый; 6 - универсал средний; 7 - универсал большой; 8 - минивен 5; 9 - минивен 6; 10 - минивен 7; 11 - минивен 8; 12 - грузовой }
double pricePerKmIn; // цена за км по городу
double pricePerKmOut; // цена за км за городом
double pricePerKmInOutIn; // цена за км в 2 стороны
double priceMinIn; // минималка по городу
double priceMinOut; // минималка за городом
double minKmIn; // включено км в минималку по городу
double minKmOut; // включено км в минималку за городом
double priceFinishOutAdd; // доплата за финиш за городом
double pricePerMinute; // цена за минуту простоя
double priceAdvanceOrderAddIn;	// доплата за предварительный по городу
double priceAdvanceOrderAddOut; // доплата за прдварительный за городом
boolean nightEnabled; // флаг ночного тарифа
double nightPriceAdd; // доплата за ночь
double nightPriceMulti; // коэффициент за ночь
String nightFrom; // время начала ночного тарифа HH24:MI+TZ
String nightTo; // время окончания ночного тарифа HH24:MI+TZ
boolean rushHourEnabled; // флаг тарифа час-пик
double rushHourPriceAdd; // доплата за час-пик
double rushHourPriceMulti; // коэффициент за час-пик
String rushHourFrom; // время начала час-пик HH24:MI+TZ
String rushHourTo; // время окончания час-пик HH24:MI+TZ
boolean rushHourCenter; // флаг включения час-пик только для центра
boolean rushHourWeekend; // флаг включения час-пик по выходным
}

GET_DRIVERS_ON_MAP - список водителей на карте
Запрос: { "command" : "GET_DRIVERS_ON_MAP", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_DRIVERS_ON_MAP", "data" : ArrayList<DriverOnMap> }
DriverOnMap {
    	int driverId;
int classId;
double lat;
double lon;
	double bearing;
	boolean isFree;
}


GET_DATA - получение данных клиента (это не профиль)
Запрос: { "command" : "GET_DATA", "data" : { "clientId" : 1234 } }
Ответ: { "command" : "GET_DATA", "data" : ClientData }
ClientData {
	int number; // номер клиента
	boolean isActive; // флаг разблокировки
	double balance; // баланс клиента
	int bonusOrders; // кол-во бонусных поездок
double discountFixed; // фиксированная скидка
double discountPercent; // процентная скидка
String inviteCode; // код для рефералки
}

REGISTER - регистрация
Запрос: { "command" : "REGISTER", "data" : { "taxiToken" : "1dscf45djud-dr42", "phone": "+380671112233", "inviteCode" : "12FG45GH" } }
taxiToken - идентификатор такси, константа
Ответ: { "command" : "REGISTER", "data" : RegisterResponse }
RegisterResponse {
	int success; // возвращает clientId
	String error;
	String alreadyExists;
}

LOGON - авторизация
Запрос: { "command" : "LOGON", "data" : { "taxiToken" : "1dscf45djud-dr42", "phone": "+380671112233", "firebaseToken": null } }
taxiToken - идентификатор такси, константа
Ответ: { "command" : "LOGON", "data" : LogonResponse }
LogonResponse {
	int success; // возвращает clientId
	String error;
	String notExists;
}

GET_ORDER_MESSAGES - получить чат по текущему заказу
Запрос: { "command" : "GET_ORDER_MESSAGES", "data" : { "orderId": 45678 } }
Ответ: { "command" : "GET_ORDER_MESSAGES", "data" : ArrayList<Message> }
Message {
	int id; // id сообщение
	String dt; // время HH24:MI
	String from; // от кого
	String to; // кому
	String text; // текст
}

SEND_MESSAGE - отправить сообщение водителю по заказу
Запрос: { "command" : "SEND_MESSAGE", "data" : { "clientId" : 1234, "orderId": 45678, "text" : "Hello" } }
Ответ: { "command" : "SEND_MESSAGE", "data" : Response }

SEND_MESSAGE_GO_OUT - отправить стандартное сообщение по заказу "Выхожу"
Запрос: { "command" : "SEND_MESSAGE_GO_OUT", "data" : { "clientId" : 1234, "orderId": 45678 } }
Ответ: { "command" : "SEND_MESSAGE_GO_OUT", "data" : Response }

SEND_MESSAGE_LINGER - отправить стандартное сообщение по заказу "Задерживаюсь"
Запрос: { "command" : "SEND_MESSAGE_LINGER", "data" : { "clientId" : 1234, "orderId": 45678, "interval": 5 } }
Ответ: { "command" : "SEND_MESSAGE_LINGER", "data" : Response }

GET_ORDER_DETAILS - подробности заказа
Запрос: { "command" : "GET_ORDER_DETAILS", "data" : { "orderId": 45678,"lang": "ru" } }
Ответ: { "command" : "GET_ORDER_DETAILS", "data" : Order }
Order {
	int id; // id заказа
	String dt; // дата и время заказа DD-MM-YYYY HH24:MI
	double lat0;
	double lon0;
	double lat1;
	double lon1;
	double lat2;
	double lon2;
	double lat3;
	double lon3;
	double lat4;
	double lon4;
	String track; // трек в виде конвертированного GeoJSON
	String object0; // объект откуда
	String street0; // улица откуда
	String house0; // дом откуда
	String object1; // объект куда
	String street1; // улица куда
	String house1; // дом куда
	String object2; // объект куда 2
	String street2; // улица куда 2
	String house2; // дом куда 2
	String object3; // объект куда 3
	String street3; // улица куда 3
	String house3; // дом куда 3
	String object4; // объект куда 4
	String street4; // улица куда 4
	String house4; // дом куда 4
	String entrance; // подъезд
	String apartment; // квартира
	String comments; // комментарии
	int standardTypeId; // тип авто enum { 1 - эконом; 2 - стандарт; 3 -	премиум; 4 - бизнесс; 5 - универсал малый; 6 - универсал средний; 7 - универсал большой; 8 - минивен 5; 9 - минивен 6; 10 - минивен 7; 11 - минивен 8; 12 - грузовой }
	boolean emptyTrunk; // пустой багажник
	boolean lowLanding; // низкая посадка
	boolean tinted; // тонировка
	boolean receipt; // чек
	boolean terminal; // терминал
	boolean conditioner; // кондиционер
	boolean animals; // животные
	boolean childSeat; // детское кресло
	int statusId; // статус заказа enum { 1 - Новый; 2 - Подтверждение; 3 - Принят; 4 - По адресу; 5 - С пассажиром; 6 - Закрыт; 7 - Без машины; 8 - Зарезервирован; 9 - Отмена (вина оператора); 10 - Отмена (вина клиента); 11 - Отмена (вина водителя); 12 - Отмена клиентом; 13 - Заблокировано агрегатором; 14 - Предварительный}
	double price; // стоимость 
	int paymentTypeId; // тип оплаты enum { 0 - наличные; 1 - кредитка; 2 - бонусы; 3 - безнал }
	boolean bonusOrder; // флаг бонусной поездки
	int colorId; // id цвета авто
	String car; // марка и модель
	String carNumber; // номер
	String driverName; // имя водителя
	String driverPhone; // телефон водителя
	double driverRating; // рейтинг водителя
	int driverRatingCount; // количество оценок в рейтинге
	String driverPhoto; // фото водителя, конвертированное из base64
	int merchantId; // мерчант, нужен при безналичной оплате
	double additionalPrice; // доплата клиента
	String otherPhone; // другой телефон, если вызывают кому-то
	double calculatedPrice; // цена просчета
	double distanceIn; // дистанция по городу
           double distanceOut; // дистанция за городом
           int stayTime; // время простоя
           int tripTime; // длительность поездки
	boolean allowDelete; // возможность удаления поездки из истории
String priceName; // название тарифа
Double priceMinIn; // минималка по городу
Double minKmIn; // включено в минималку по городу
Double pricePerKmIn; // цена за км по городу
Double priceMinOut; // минималка за городом
Double minKmOut; // включено в минималку за городом
Double pricePerKmOut; // цена за 1 км за городом
Double pricePerStayMinute; // цена за минуту простоя
Double pricePerTripMinute; // цена за минуту поездки
}

CREATE_ORDER - создать заказ
Запрос: { "command" : "CREATE_ORDER", "data" : { "providerId": 3, "clientId" : 1234, "dt": "10-04-2019 00:00", "lat0": 49.45, "lon0": 26.45, "lat1": null, "lon1": null, "lat2": null, "lon2": null, "lat3": null, "lon3": null, "lat4": null, "lon4": null, "object0": "Термопласт", "street0": "Курчатова ул.", "house0": "8", "object1": null, "street1": null, "house1": null, "object2": null, "street2": null, "house2": null, "object3": null, "street3": null, "house3": null, "object4": null, "street4": null, "house4": null, "entrance": null, "apartment": null, "comments": "остановка", "bonusOrder": false, "standardTypeId": 2, "emptyTrunk": false, "lowLanding": false, "tinted": false, "receipt": false, "terminal": false, "conditioner": false, "animals": false, "childSeat": false, "paymentTypeId": 0, "additionalPrice": 10.00, "otherPhone": null, "price" : 85.46, "bonusCount" : 30.00, "distance" : 5.87, "tripTime": 657 } }
providerId - id провайдера типа enum { 3 - Android; 4 - IOS }
dt - для предварительного время подачи в формате yyyy-mm-dd hh:mm:ss
Ответ: { "command" : "CREATE_ORDER", "data" : OrderResponse }
OrderResponse {
	int success; // id созданного заказа
	String error;
}

UPDATE_ORDER - обновить заказ без машины
Запрос: { "command" : "UPDATE_ORDER", "data" : { "orderId": 33341, "clientId" : 1234, "additionalPrice": 10.00 } }
Ответ: { "command" : "UPDATE_ORDER", "data" : OrderResponse }
OrderResponse {
	int success;
	String error;
}

UPDATE_ADVANCE_ORDER - редактировать предварительный заказ
Запрос: { "command" : "UPDATE_ADVANCE_ORDER", "data" : { "orderId": 33341, "clientId" : 1234, "dt": "29-01-2022 00:10" } }
Ответ: { "command" : "UPDATE_ADVANCE_ORDER", "data" : OrderResponse }
OrderResponse {
	int success;
	String error;
}

CANCEL_ORDER - отменить заказ
Запрос: { "command" : "CANCEL_ORDER", "data" : { "clientId" : 1234, "orderId": 45678, "reasonId": 2 } }
Ответ: { "command" : "CANCEL_ORDER", "data" : Response }

ORDER_PRICE - стоимость для каждого класса в форме заказа
Запрос: { "command" : "ORDER_PRICE", "data" : { "taxiToken" : "700400", "dt": "10-04-2019 00:00", "lat0": 49.45, "lon0": 26.45, "lat1": null, "lon1": null, "lat2": null, "lon2": null, "lat3": null, "lon3": null, "lat4": null, "lon4": null, "bonusOrder": false, "emptyTrunk": false, "lowLanding": false, "tinted": false, "receipt": false, "terminal": false, "conditioner": false, "animals": false, "childSeat": false } }
Ответ: { "command" : "ORDER_PRICE", "data" : PriceResponse }
PriceResponse {
	int standardTypeId; // тип авто enum { 1 - эконом; 2 - стандарт; 3 -	премиум; 4 - бизнесс; 5 - универсал малый; 6 - универсал средний; 7 - универсал большой; 8 - минивен 5; 9 - минивен 6; 10 - минивен 7; 11 - минивен 8; 12 - грузовой }
	double price; // стоимость
	double coefficient; // если больше 1, то повышенная стоимость
	int interval; // примерное время подачи машины в минутах
	double distance; // дистанция
int tripTime; // время в пути в секундах
double priceMinIn; // минималка
double minKmIn; // количество км в минималке
double pricePerKmIn; // цена за 1 км
double pricePerMinute; // цена за 1 мин ожидания
int waitTime; // кол-во минут бесплатного ожидания
}

RANK_ORDER - отзыв о поездке
Запрос: { "command" : "RANK_ORDER", "data" : { "clientId" : 1234, "orderId": 45678, "rating": 2, "comments": "Вез другой дорогой, получилось в 2 раза дороже", "reasonId": [3, 4] } }
reasonId - список причин, почему плохая оценка, константы
Ответ: { "command" : "RANK_ORDER", "data" : Response }

GET_SETTINGS - настройки и разрешения
Запрос: { "command" : "GET_SETTINGS", "data" : { "taxiToken" : "1dscf45djud-dr42" } }
taxiToken - идентификатор такси, константа
Ответ: { "command" : "GET_SETTINGS", "data" : SettingsResponse }
SettingsResponse {
	String currency; // валюта
	String phonePrefix; // префикс телефона
	int waitTime; // бесплатное время ожидания, с
	boolean waitAtAddress; // ожидание от момента "По адресу"
	int cancelTime; // бесплатное время отмены заказа, с
	boolean allowSendMessage; // разрешен чат с водителем
	boolean allowCallDriver; // разрешен звонок водителю
	double minSurcharge; // минимальная доплата в форме заказа
	double surchargeStep; // шаг доплаты в форме заказа
	double minLat; // минимальная широта для вызова такси
	double maxLat; // максимальная широта для вызова такси
	double minLon; // минимальная долгота для вызова такси
	double maxLon; // максимальная долгота для вызова такси
	double centerLat; // координаты центровки, если не получилось определить
	double centerLon;
	String taxiPhone; // номер телефона для "Звонок оператору"
	boolean menuBonusCodeEnabled; // меню "Промокоды"
	boolean menuFaresEnabled; // меню "Тарифы"
	boolean menuFeedbackEnabled; // меню "Обратная связь"
	boolean menuShareEnabled; // меню "Поделиться"
	boolean menuCallOperatorEnabled; // меню "Звонок оператору"
	double referralReward; // вознаграждение за реферала
	double referrerReward; // вознаграждение при регистрации через рефералку
	String merchantId;
        	String googleApiKey;
	boolean allowSeeCars; // показывать машины на карте
	double maxBonusCount; // максимальное количество бонусов для расчета
        	boolean allowPartialBonus; // разрешить частичный расчет бонусами
	String firebaseLink;
        	String firebaseDomainUri;
	boolean allowCreateAdvanceOrder;
        	String welcomeText;
        	String cityName;
	boolean allowCreateOrderWithoutSecondAddress;
	Social socials;
	String referralCodeDescription;
}

Social {
        String twitter;
        String facebook;
        String vk;
        String odnoklassniki;
        String instagram;
        String youtube;
        String viber;
        String telegram;
}

GET_DRIVER_INFO - получить данные о водителе на карте
Запрос: { "command" : "GET_DRIVER_INFO", "data" : { "driverId" : 73 } }
driverId - id водителя, полученного из списка машин на карте
Ответ: {"command":"GET_DRIVER_INFO","data":{"driverId":0,"economy":false,"standard":true,"premium":false,"business":false,"economyPrice":0.0,"standardPrice":22.0,"premiumPrice":0.0,"businessPrice":0.0,"car":"Mercedes W123", "colorId":2, "car_number":"27709ХМ", "carPhoto":null, "rating":4.666666666666667, "ratingCount":9, "emptyTrunk":true, "lowLanding":true, "tinted":false, "receipt":false, "terminal":false, "conditioner":false, "animals":false, "childSeat":false }}
DriverData {
    boolean economy; // у водителя влючен класс Эконом
    boolean standard; // у водителя включен класс Стандарт
    boolean premium; // у водителя включен класс Премиум
    boolean business; // у водителя включен класс Бизнесс
    double economyPrice; // минимальная цена за Эконом
    double standardPrice; // минимальная цена за Стандарт
    double premiumPrice; // минимальная цена за Премиум
    double businessPrice; // минимальная цена за Бизнесс
    String car; // марка и модель авто
    int colorId; // id цвета авто
    String car_number; // гос номер авто
    String carPhoto; // фото авто в Base64
    double rating; // рейтинг водителя
    int ratingCount; // количество оценок водителя
    boolean emptyTrunk; // пустой багажник
    boolean lowLanding; // низкая посадка
    boolean tinted; // тонировка
    boolean receipt; // чек
    boolean terminal; // терминал
    boolean conditioner; // кондиционер
    boolean animals; // животные
    boolean childSeat; // детское кресло
}

ADD_CREDIT_CARD - добавить кредитку
Запрос: { "command" : "ADD_CREDIT_CARD", "data" : { "clientId" : 73, "lastDigits" : "1234", "cardType" : "visa", "cardToken" : "32wefrwewaeqwdewqr4r", "merchantOrderId" : "test7926651365", "amount" : "100", "currency" : "UAH" } }
Ответ:
{"command":"ADD_CREDIT_CARD","data":{"success":"Card added"}}

DELETE_CREDIT_CARD - удалить кредитку
Запрос: { "command" : "DELETE_CREDIT_CARD", "data" : { "clientId" : 73, "cardId" : "1" } }
Ответ:
{"command":"DELETE_CREDIT_CARD","data":{"success":"Card deleted"}}

CHECK_NON_COMFORTABLE_PLACE - получить список мест посадки
Запрос: { "command" : "CHECK_NON_COMFORTABLE_PLACE", "data" : { "taxiToken" : "700400", "lat0" : 49.432916, "lon0" : 26.983722, "lang" : "ru" } }
Ответ: {"command":"CHECK_NON_COMFORTABLE_PLACE","data":{"nonComfortablePlaces":[{"lat":49.4331421230961,"lon":26.982464796309237,"object":"Оазис со стороны РЫБАЛКО","street":"Бандеры улица","house":"2А-Р","distance":94.32647661601972},{"lat":49.432730752477525,"lon":26.983714596116805,"object":"Оазис с ПРИБУЖСКОЙ","street":"Бандеры улица","house":"2А-П","distance":20.605541770842326}]}}
NonComfortablePlace {
    double lat;
    double lon;
    String object;
    String street;
    String house;
    double distance;
}

ROUTE - прокладка маршрута между точками
Запрос: { "command" : "ROUTE", "data" : {  "taxiToken" : "700400", "text" : "26.9854056571013,49.4361317335069|27.0270022082452,49.415129179704" } }
Ответ: {"command":"ROUTE","data": GeoJSONObject }
Запрос на роутинг формируется в виде x1,y1|x2,y2|... Сначала указывается широта, потом долгота. Количество точек - неограничено, минимальное количество - 2.
Подсчет дистанции и времени на языке JS:
var totalDistance = 0; // дистанция в метрах
var totalTime = 0; // время в секундах
for (i = 0; i < response.features.length; i++) {
            feature = response.features[i];
            totalDistance += feature.properties.distance;
            totalTime += feature.properties.cost * 3600;
}

OBJECTS_IN_BOUNDS - список объектов в заданых границах
Запрос: { "command" : "OBJECTS_IN_BOUNDS", "data" : {  "taxiToken" : "700400", "lat1" : 49.432066, "lon1": 26.998500, "lat2": 49.433239, "lon2": 27.001491 } }
lat1, lon1 - координаты левой нижней точки экрана
lat2, lon2 - координаты правой верхней точки экрана
Ответ: { "command" : "OBJECTS_IN_BOUNDS", "data" : ArrayList<Address> }

CURRENT_ORDERS - сервер периодически отсылает список текущих заказов клиента
Ответ: { "command" : "CURRENT_ORDERS", "data" : ArrayList<CurrentOrder> }
CurrentOrder {
int id; // id заказа
int time; // приблизительное время подачи, мин
String orderTime; // время подачи для заказа DD-MM-YYYY HH24:MI
int statusId; // статус
double lat; // координаты водителя
double lon;
double bearing; // азимут	
}

CURRENT_MESSAGES - сервер периодически отсылает список текущих сообщений для клиента
Ответ: { "command" : "CURRENT_MESSAGES", "data" : ArrayList<Message> }
Message {
	int id; // id сообщение
	String dt; // время HH24:MI
	String from; // от кого
	String to; // кому
	String text; // текст
}

CONFIRM_MESSAGE - подтвердить полученное сообщение

Запрос: { "command" : "CONFIRM_MESSAGE", "data" : { "messageId" : 1234 } }
Ответ: { "command" : "CONFIRM_MESSAGE", "data" : Response }




Причины отмена заказа
Водитель попросил отменить
Заказал по ошибке
Слишком долго ждать
Уехал на другом такси
Водитель поехал не туда

Причины плохой оценки:
Грязная или нериятно пахнущая машина
Выбрал длинный маршрут или пропустил поворот
Ехал слишком медленно
Нарушал правила дорожного движения
Много разговаривал
Вел машину так, что клиента укачало
Приехал на машине, не соответсвующей требованиям заказа
Отказался помочь погрузить багаж
Попросил поставить хорошую оценку
Звонил без необходимости

Firebase notifications:
CAR_NOT_FOUND
ORDER_TAKEN
AT_ADDRESS
CLOSE_ORDER
TRIP_STARTED
ORDER_CANCELED

`;
