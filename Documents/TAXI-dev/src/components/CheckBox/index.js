import React from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import CheckBox from 'react-native-check-box';

import { Images } from '../../helpers';
import style from './style';

const CustomCheckBox = ({ onClick, isChecked, checkedImage, uncheckedImage }) => {
  return (
    <View style={style.container}>
      <CheckBox
        onClick={onClick}
        isChecked={isChecked}
        checkedImage={checkedImage || <Image source={Images.CheckBoxFill} />}
        unCheckedImage={uncheckedImage || <Image source={Images.CheckBoxEmpty} />}
      />
    </View>
  );
};
export default CustomCheckBox;

CustomCheckBox.propTypes = {
  checkedImage: PropTypes.element,
  isChecked: PropTypes.bool,
  onClick: PropTypes.func,
  uncheckedImage: PropTypes.element,
};

CustomCheckBox.defaultProps = {
  checkedImage: <Image source={Images.CheckBoxFill} />,
  onClick: () => {},
  isChecked: false,
  uncheckedImage: <Image source={Images.CheckBoxEmpty} />,
};
