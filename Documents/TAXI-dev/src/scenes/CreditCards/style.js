import { StyleSheet } from 'react-native';
import { colors } from '../../helpers';

const style = StyleSheet.create({
  header: {
    padding: 0,
    marginBottom: 23,
    marginHorizontal: 16,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 30,
  },
  button: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 19,
  },
  stub: {
    alignItems: 'center',
    marginVertical: 44,
  },
  stubText: {
    textAlign: 'center',
  },

  bonusesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bonusesString: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: colors.black,
    marginTop: 5,
  },
  bonusesWrap: {
    justifyContent: 'space-between',
  },
  line: {
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginVertical: 16,
  },

  // Card.js
  card: {
    borderRadius: 10,
    paddingVertical: 19,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardImage: {
    height: 9,
    width: 31,
    marginHorizontal: 16,
  },
  cardText: {
    fontSize: 16,
    color: colors.textEnv,
  },
  cardIcon: {
    marginHorizontal: 21,
  },
  promoTab: {
    flex: 1,
    marginTop: 24,
  },
  promoText: {
    paddingVertical: 36,
    paddingHorizontal: 16,
  },
  promoLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    marginHorizontal: 16,
  },
  promoInput: {
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.lightGrey,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  promoInputWrap: {
    paddingVertical: 18,
  },
  promoButton: {
    marginBottom: 36,
    marginHorizontal: 16,
    paddingVertical: 12,
  },
});

export default style;
