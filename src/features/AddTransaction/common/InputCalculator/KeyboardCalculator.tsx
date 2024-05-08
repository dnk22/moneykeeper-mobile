import React, { useCallback, useEffect, useState } from 'react';
import TouchableHighlight from 'components/TouchableHighlight';
import { Text, View } from 'react-native';
import RnKeyboard from 'rn-keyboard';
import styles from './styles';
import {
  CLEAR,
  ENTER,
  OPERATOR,
  BACKSPACE,
  DECIMAL,
  ActionsProps,
  ISINCLUDEOPEARATORS,
  CALCULATE,
  NUMBER,
} from './type';

type onPushKeyboardEventProps = {
  value: string;
  type: ActionsProps | typeof NUMBER | typeof ENTER;
};

const EnterButton = () => {
  const [isHasOperator, setIsHasOperator] = useState(false);
  useEffect(() => {
    const changeSubmitEvent = RnKeyboard.addListener(ISINCLUDEOPEARATORS, (value: boolean) => {
      setIsHasOperator(value);
    });
    return () => {
      changeSubmitEvent.remove();
    };
  }, []);
  const onEnter = async () => {
    if (isHasOperator) {
      RnKeyboard.emit(ENTER, '');
      return;
    }
    const inputId = RnKeyboard.getFocusId();
    await RnKeyboard.submit(inputId);
  };
  return (
    <TouchableHighlight style={[styles.enterButton]} onPress={onEnter}>
      <Text>{isHasOperator ? '=' : 'Xong'}</Text>
    </TouchableHighlight>
  );
};

function KeyboardCalculator() {
  const renderButton = useCallback((value: string, type: ActionsProps | typeof NUMBER) => {
    return (
      <TouchableHighlight
        style={styles.button}
        onPress={() => onPushKeyboardEvent({ value, type })}
      >
        <Text>{value}</Text>
      </TouchableHighlight>
    );
  }, []);

  const onPushKeyboardEvent = async ({ value, type }: onPushKeyboardEventProps) => {
    const inputId = RnKeyboard.getFocusId();
    try {
      switch (type) {
        case OPERATOR:
          keyboardEventEmit(OPERATOR, value);
          break;
        case CLEAR:
          keyboardEventEmit(CLEAR, '');
          break;
        case BACKSPACE:
          await RnKeyboard.backspace(inputId);
          break;
        case NUMBER:
          keyboardEventEmit(NUMBER, value);
          break;
        default:
          break;
      }
    } catch (err) {
      /** @todo handle error here */
    }
  };

  const keyboardEventEmit = (name: string, value: string) => {
    RnKeyboard.emit(name, value);
  };
  return (
    <View>
      <View style={[styles.calcRow]}>
        {renderButton('C', 'C')}
        {renderButton('÷', OPERATOR)}
        {renderButton('×', OPERATOR)}
        {renderButton('⌫', BACKSPACE)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('7', NUMBER)}
        {renderButton('8', NUMBER)}
        {renderButton('9', NUMBER)}
        {renderButton('-', OPERATOR)}
      </View>
      <View style={styles.calcRow}>
        {renderButton('4', NUMBER)}
        {renderButton('5', NUMBER)}
        {renderButton('6', NUMBER)}
        {renderButton('+', OPERATOR)}
      </View>
      <View style={styles.calcRow}>
        <View style={{ flex: 3 }}>
          <View style={styles.calcRow}>
            {renderButton('1', NUMBER)}
            {renderButton('2', NUMBER)}
            {renderButton('3', NUMBER)}
          </View>
          <View style={styles.calcRow}>
            {renderButton('0', NUMBER)}
            {renderButton('000', NUMBER)}
            {renderButton(',', DECIMAL)}
          </View>
        </View>
        <EnterButton />
      </View>
    </View>
  );
}

export default KeyboardCalculator;
