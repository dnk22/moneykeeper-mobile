import React, { useEffect, useState } from 'react';
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
  OperatorProps,
  CHANGESUBMIT,
  CALCULATE,
} from './type';

function KeyboardCalculator() {
  const [isHasOperator, setIsHasOperator] = useState(false);
  const renderActionButton = (value: string, type?: OperatorProps) => {
    const onActionButtonPress = () => {
      onPushKeyboardEvent(value, type || OPERATOR);
    };
    return (
      <TouchableHighlight style={styles.button} onPress={onActionButtonPress}>
        <Text>{value}</Text>
      </TouchableHighlight>
    );
  };

  const renderNumberButton = (value: string) => {
    const onNumberButtonPress = () => {
      onPushKeyboardEvent(value);
    };
    return (
      <TouchableHighlight style={styles.button} onPress={onNumberButtonPress}>
        <Text>{value}</Text>
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    const changeSubmitEvent = RnKeyboard.addListener(CHANGESUBMIT, (value: boolean) => {
      setIsHasOperator(value);
    });
    return () => {
      changeSubmitEvent.remove();
    };
  }, []);

  const onPushKeyboardEvent = async (value: string, type?: OperatorProps) => {
    try {
      const inputId = RnKeyboard.getFocusId();
      switch (type) {
        case OPERATOR:
          RnKeyboard.emit(OPERATOR, value);
          break;
        case CLEAR:
          RnKeyboard.emit(CLEAR, '');
          break;
        case BACKSPACE:
          await RnKeyboard.backspace(inputId);
          break;
        case ENTER:
          if (isHasOperator) {
            RnKeyboard.emit(CALCULATE, '');
            break;
          }
          await RnKeyboard.submit(inputId);
          break;
        default:
          await RnKeyboard.insert(inputId, value);
          break;
      }
    } catch (err) {
      /** @todo handle error here */
    }
  };

  return (
    <View>
      <View style={[styles.calcRow]}>
        {renderActionButton('C', CLEAR)}
        {renderActionButton('/')}
        {renderActionButton('*')}
        {renderActionButton('⌫', BACKSPACE)}
      </View>
      <View style={styles.calcRow}>
        {renderNumberButton('7')}
        {renderNumberButton('8')}
        {renderNumberButton('9')}
        {renderActionButton('-')}
      </View>
      <View style={styles.calcRow}>
        {renderNumberButton('4')}
        {renderNumberButton('5')}
        {renderNumberButton('6')}
        {renderActionButton('+')}
      </View>
      <View style={styles.calcRow}>
        <View style={{ flex: 3 }}>
          <View style={styles.calcRow}>
            {renderNumberButton('1')}
            {renderNumberButton('2')}
            {renderNumberButton('3')}
          </View>
          <View style={styles.calcRow}>
            {renderNumberButton('0')}
            {renderNumberButton('000')}
            {renderActionButton(',', DECIMAL)}
          </View>
        </View>
        <TouchableHighlight
          style={[styles.enterButton]}
          onPress={() => onPushKeyboardEvent('', ENTER)}
        >
          <Text>{isHasOperator ? '=' : 'Xong'}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default KeyboardCalculator;
