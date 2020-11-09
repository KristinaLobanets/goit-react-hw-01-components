import React from 'react';
import { BackHandler, ToastAndroid } from 'react-native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Initial from './scenes/Initial';
import SignIn from './scenes/SignIn';
import PhoneQuery from './scenes/PhoneQuery';
import Home from './scenes/Home';
import RegisterProfile from './scenes/RegisterProfile';
import Address from './scenes/Address';
import MapFinder from './scenes/MapFinder';
import MapDirections from './scenes/MapDirections';
import SaveAddress from './scenes/SaveAddress';
import Rides from './scenes/Rides';
import CreditCards from './scenes/CreditCards';
import AddCreditCard from './scenes/AddCreditCard';
import Profile from './scenes/Profile';
import Settings from './scenes/Settings';
import ShareApp from './scenes/ShareApp';
import DefaultTariff from './scenes/DefaultTariff';
import SavedAddresses from './scenes/SavedAddresses';
import About from './scenes/About';
import Feedback from './scenes/Feedback';
import ActiveTrips from './scenes/ActiveTrips';
import Details from './scenes/Details';
import SearchHistory from './scenes/SearchHistory';

import { strings } from './helpers/localization';
import { setTo } from './actions';

class RouterComponent extends React.Component {
  backButtonPressedOnceToExit = false;

  static propTypes = {
    setTo: PropTypes.func.isRequired,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onHandleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onHandleBackButton);
  }

  onHandleBackButton = () => {
    if (Actions.currentScene === 'home') {
      if (this.backButtonPressedOnceToExit === true) {
        BackHandler.exitApp();
        this.props.setTo(undefined);
        return true;
      }
      this.backButtonPressedOnceToExit = true;
      ToastAndroid.show(strings.onQuitPress, ToastAndroid.SHORT);
      setTimeout(() => {
        this.backButtonPressedOnceToExit = false;
      }, 2000);
      return true;
    }
    Actions.pop();
    return true;
  };

  render() {
    return (
      <Router backAndroidHandler={this.onHandleBackButton}>
        <Scene key="root" hideNavBar>
          {/* Auth scenes */}
          <Scene key="init" initial component={Initial} />
          <Scene key="signin" component={SignIn} />
          <Scene key="phoneQuery" component={PhoneQuery} />
          <Scene key="registerProfile" component={RegisterProfile} />

          {/* Map scenes */}
          <Scene key="home" component={Home} type="reset" />
          <Scene key="mapFinder" component={MapFinder} />
          <Scene key="mapDir" component={MapDirections} />

          {/* Tabs scenes */}
          <Scene key="address" component={Address} />
          <Scene key="rides" component={Rides} />

          {/* Other scenes */}
          <Scene key="saveAddress" component={SaveAddress} />
          <Scene key="savedAddresses" component={SavedAddresses} />
          <Scene key="activeTrips" component={ActiveTrips} />
          <Scene key="details" component={Details} />
          <Scene key="searchHistory" component={SearchHistory} />

          {/* Profile scenes */}
          <Scene key="profile" component={Profile} />
          <Scene key="settings" component={Settings} />
          <Scene key="shareApp" component={ShareApp} />
          <Scene key="defaultTariff" component={DefaultTariff} />
          <Scene key="about" component={About} />
          <Scene key="feedback" component={Feedback} />

          {/* Payment scenes */}
          <Scene key="creditCards" component={CreditCards} />
          <Scene key="addCreditCard" component={AddCreditCard} />
        </Scene>
      </Router>
    );
  }
}

export default connect(null, { setTo })(RouterComponent);
