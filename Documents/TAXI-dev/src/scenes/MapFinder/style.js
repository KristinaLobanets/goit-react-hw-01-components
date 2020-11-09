import { StyleSheet, Platform } from 'react-native';
import { colors, Dimension } from '../../helpers';

const style = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  rootContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: Dimension.IsIphoneX() ? 20 : Platform.OS === 'ios' ? 10 : 0,
    backgroundColor: colors.white,
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  addressContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    marginHorizontal: 16,
  },
  addressText: {
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
  },
  geobuttonWrap: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginTop: 16,
  },
  geobutton: {
    height: 36,
    width: 36,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  iconMarker: {
    marginHorizontal: 16,
  },
  marker: {
    position: 'absolute',
    bottom: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default style;
