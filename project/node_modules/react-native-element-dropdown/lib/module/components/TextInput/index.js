function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { Image, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { styles } from './styles';
const ic_close = require('../../assets/close.png');
const TextInputComponent = props => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = _value => {},
    renderLeftIcon,
    renderRightIcon
  } = props;
  const [text, setText] = useState('');
  useEffect(() => {
    if (value) {
      setText(value);
    }
  }, [value]);
  const onChange = text => {
    setText(text);
    onChangeText(text);
  };
  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon();
      }
      if (text.length > 0) {
        return /*#__PURE__*/React.createElement(TouchableOpacity, {
          onPress: () => onChange('')
        }, /*#__PURE__*/React.createElement(Image, {
          source: ic_close,
          style: StyleSheet.flatten([styles.icon, iconStyle])
        }));
      }
      return null;
    }
    return null;
  };
  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  };
  return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, null, /*#__PURE__*/React.createElement(View, {
    style: [style]
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.textInput
  }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), /*#__PURE__*/React.createElement(TextInput, _extends({}, props, {
    style: StyleSheet.flatten([styles.input, inputStyle, font()]),
    value: text,
    placeholder: placeholder,
    placeholderTextColor: placeholderTextColor,
    onChangeText: onChange
  })), _renderRightIcon())));
};
export default TextInputComponent;
//# sourceMappingURL=index.js.map