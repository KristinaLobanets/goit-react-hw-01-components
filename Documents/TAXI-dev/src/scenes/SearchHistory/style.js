import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  searchInputsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    paddingBottom: 16,
    marginHorizontal: 16,
  },
  pointAContainer: {
    backgroundColor: colors.lightGrey,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  pointBContainer: {
    backgroundColor: colors.lightGrey,
    marginTop: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dotContainer: {
    width: 24,
    alignItems: 'center',
  },
  timeSearchContainer: {
    marginHorizontal: 16,
    flexDirection: 'row',
  },
  timeFromContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    flex: 1,
    paddingVertical: 12,
    marginRight: 24,
  },
  timeToContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    flex: 1,
    paddingVertical: 12,
  },
  timeTouchable: {
    paddingTop: 12,
  },
  carTouchable: {
    paddingBottom: 12,
    marginTop: 12,
  },
  carTypeContainer: {
    paddingTop: 16,
    flex: 1,
  },
  carTypeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginHorizontal: 16,
  },
  bottomBar: {
    backgroundColor: colors.lightGrey,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  bottomBigText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: 'Montserrat-Medium',
  },
  bottomButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orange,
  },
  bottomButtonText: {
    color: colors.textEnv,
  },
  subtitle: {
    backgroundColor: colors.backgroundGrey,
    marginBottom: 12,
    marginHorizontal: 12,
  },
  header: {
    backgroundColor: colors.backgroundGrey,
    height: 90,
  },
});

export default style;
