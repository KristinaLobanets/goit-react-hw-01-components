import React, { Component } from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Contacts from 'react-native-contacts';
import { styleConstants, Images, colors, strings } from '../../helpers';
import { chooseContact } from '../../actions';
import { Header, Text, Icon, TextInput, ArrowRight } from '../../components';
import style from './style';

class ContactsList extends Component {
  static propTypes = {
    user: PropTypes.object,
    chooseContact: PropTypes.func,
    contact: PropTypes.object,
    onBack: PropTypes.func,
    showNumberForm: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      denied: false,
      search: '',
      filtered: [],
    };
  }

  componentDidMount() {
    this.getAccessToContacts();
  }

  getAccessToContacts = async () => {
    if (Platform.OS === 'ios') {
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        // contacts returned
        this.setState({ contacts });
      });
    } else if (Platform.OS === 'android') {
      try {
        const granted =
          Platform.Version > 22
            ? await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                buttonPositive: 'Ok',
              })
            : PermissionsAndroid.RESULTS.GRANTED;
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
              this.setState({ denied: true });
            } else {
              // contacts returned in Array
              // eslint-disable-next-line no-lonely-if
              if (contacts.length > 0) {
                const data = this.getData(contacts);
                this.setState({ contacts: data });
              }
            }
          });
        } else {
          this.setState({ denied: true });
        }
      } catch (err) {
        this.setState({ denied: true });
      }
    }
  };

  getData = array => {
    return array
      .filter(
        el =>
          el.phoneNumbers[0] &&
          el.phoneNumbers[0].number
            .split('-')
            .join('')
            .split(' ')
            .join('') !== this.props.user.phone
      )
      .sort((a, b) => {
        if (a.givenName < b.givenName) return -1;
        if (a.givenName > b.givenName) return 1;
        return 0;
      });
  };

  handleContactPress = contact => {
    if (this.props.contact.recordID === contact.recordID) {
      return this.props.chooseContact({});
    }
    this.props.chooseContact(contact).then(() => this.props.onBack());
  };

  handleSearch = value => {
    this.setState({ search: value }, () => this.searchContact(this.state.contacts));
  };

  searchContact = () => {
    const { contacts } = this.state;
    if (this.state.search.length) {
      const filtered = contacts.filter(el => {
        return (
          el.givenName.toLowerCase().includes(this.state.search.toLowerCase()) ||
          (el.familyName
            ? el.familyName.toLowerCase().includes(this.state.search.toLowerCase())
            : false) ||
          (el.middleName
            ? el.middleName.toLowerCase().includes(this.state.search.toLowerCase())
            : false)
        );
      });
      return this.setState({ filtered });
    }
  };

  handleClearSearch = () => {
    if (this.state.search) {
      this.setState({ search: '' });
    }
  };

  keyExtractor = item => item.recordID.toString();

  renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styleConstants.flexStartRow,
          style.friendItem,
          this.props.contact && item.recordID === this.props.contact.recordID
            ? style.friendActiveItem
            : null,
        ]}
        onPress={() => this.handleContactPress(item)}
      >
        <View style={styleConstants.flexStartRow}>
          <Image
            source={item.thumbnailPath ? { uri: item.thumbnailPath } : Images.SmallAvatar}
            style={style.friendImage}
          />
          <View style={styleConstants.flex}>
            <Text smallBlackText>
              {`${item.givenName}${item.middleName ? ` ${item.middleName}` : ''}${
                item.familyName ? ` ${item.familyName}` : ''
              }`}
            </Text>
            <Text>
              {item.phoneNumbers[0]
                ? item.phoneNumbers[0].number
                    .split('-')
                    .join('')
                    .split(' ')
                    .join('')
                : ''}
            </Text>
          </View>
        </View>
        {this.props.contact && item.recordID === this.props.contact.recordID && (
          <Icon name="saved" color={colors.green} />
        )}
      </TouchableOpacity>
    );
  };

  renderHeader = () => {
    const { contact } = this.props;
    return (
      <TouchableOpacity
        style={[
          styleConstants.flexStartRow,
          style.friendItem,
          contact.recordID ? style.friendActiveItem : null,
        ]}
        onPress={() => this.handleContactPress({})}
      >
        <View style={styleConstants.flexStartRow}>
          <Image
            source={
              this.props.contact.thumbnailPath ? { uri: contact.thumbnailPath } : Images.SmallAvatar
            }
            style={style.friendImage}
          />
          <View style={styleConstants.flex}>
            <Text smallBlackText>
              {`${contact.givenName}${contact.middleName ? ` ${contact.middleName}` : ''}${
                contact.familyName ? ` ${contact.familyName}` : ''
              }`}
            </Text>
            {contact.recordID !== contact.givenName && (
              <Text>
                {contact.phoneNumbers[0]
                  ? contact.phoneNumbers[0].number
                      .split('-')
                      .join('')
                      .split(' ')
                      .join('')
                  : ''}
              </Text>
            )}
          </View>
        </View>
        {this.props.contact && contact.recordID === this.props.contact.recordID && (
          <Icon name="saved" color={colors.green} />
        )}
      </TouchableOpacity>
    );
  };

  render() {
    const data = this.state.search ? this.state.filtered : this.state.contacts;
    return (
      <View style={style.friendList}>
        <Header onPressBack={this.props.onBack} />
        <View
          style={{
            position: 'absolute',
            bottom: 42,
            right: 20,
            zIndex: 20,
          }}
        >
          <ArrowRight
            mci
            icon="plus"
            onPress={this.props.showNumberForm}
            buttonStyle={{ width: 42, height: 42 }}
          />
        </View>
        {this.state.denied ? (
          <View style={styleConstants.flexCenter}>
            <Text>Access denied</Text>
          </View>
        ) : (
          <View style={styleConstants.flex}>
            <TextInput
              ref={ref => (this.input = ref)}
              value={this.state.search}
              textInputStyle={style.friendSearchInput}
              placeholder={strings.search}
              onChangeText={this.handleSearch}
            />
            {!!this.state.search && (
              <TouchableOpacity
                style={style.friendClearSearchIcon}
                onPress={this.handleClearSearch}
              >
                <Icon name="remove" color={colors.iconGrey} />
              </TouchableOpacity>
            )}
            <View style={style.friendSearchSeparator} />
            <FlatList
              renderItem={this.renderItem}
              keyExtractor={this.keyExtractor}
              data={
                this.props.contact && this.props.contact.recordID
                  ? data.filter(el => el.recordID !== this.props.contact.recordID)
                  : data
              }
              extraData={this.props}
              contentContainerStyle={style.friendListInner}
              ListFooterComponent={<View style={style.friendListFooter} />}
              ListHeaderComponent={
                this.props.contact && this.props.contact.recordID ? this.renderHeader : null
              }
              ListEmptyComponent={
                <View style={styleConstants.flexCenter}>
                  <Text>{strings.noContacts}</Text>
                </View>
              }
            />
          </View>
        )}
      </View>
    );
  }
}

export default connect(({ user, orders }) => ({ user, contact: orders.contact }), {
  chooseContact,
})(ContactsList);
