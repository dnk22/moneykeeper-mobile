import React, { memo, useCallback, useRef } from 'react';
import isEqual from 'react-fast-compare';
import { Text, TouchableHighlight, View } from 'react-native';
import RnKeyboard from 'rn-keyboard';
import { formatThousandNumber } from 'utils/math';
import styles from './styles';
import { BACK, CLEAR, DIVIDE, ENTER, MINUS, MULTIPLY, PLUS } from './type';

function KeyboardCalculator() {
  const renderActionButton = useCallback((value: string, actionKey: string) => {
    const onActionButtonPress = () => {
      switch (actionKey) {
        case CLEAR:
          onPushKeyboardEvent(CLEAR);
          break;

        case PLUS:
          onKeyboardButtonPress('+');
          break;

        case MINUS:
          onKeyboardButtonPress('-');
          break;

        case MULTIPLY:
          onKeyboardButtonPress('*');
          break;

        case DIVIDE:
          onKeyboardButtonPress('/');
          break;

        case BACK:
          onPushKeyboardEvent(BACK);
          break;
      }
    };
    return (
      <TouchableHighlight
        underlayColor={'rgb(242,242,242)'}
        style={styles.button}
        onPress={onActionButtonPress}
      >
        <Text>{value}</Text>
      </TouchableHighlight>
    );
  }, []);

  const renderNumberButton = useCallback((value: string) => {
    const onNumberButtonPress = () => {
      switch (value) {
        case ',':
          onKeyboardButtonPress(',');
          break;
        default:
          onPushKeyboardEvent(value);
          break;
      }
    };
    return (
      <TouchableHighlight
        underlayColor={'rgb(242,242,242)'}
        style={styles.button}
        onPress={onNumberButtonPress}
      >
        <Text>{value}</Text>
      </TouchableHighlight>
    );
  }, []);

  const onKeyboardButtonPress = (value: string) => {
    onPushKeyboardEvent(value);
  };

  const onPushKeyboardEvent = async (type: string) => {
    try {
      const inputId = RnKeyboard.getFocusId();
      switch (type) {
        case CLEAR:
          RnKeyboard.emit(CLEAR, '');
          break;
        case ENTER:
          await RnKeyboard.submit(inputId);
          break;
        case BACK:
          await RnKeyboard.backspace(inputId);
          break;
        default:
          await RnKeyboard.insert(inputId, type);
          break;
      }
    } catch (err) {
      /** @todo handle error here */
    }
  };

  const onHandleEnter = () => {
    onPushKeyboardEvent(ENTER);
  };

  return (
    <View>
      <View style={styles.calcRow}>
        {renderActionButton('C', CLEAR)}
        {renderActionButton('/', DIVIDE)}
        {renderActionButton('*', MULTIPLY)}
        {renderActionButton('⌫', BACK)}
      </View>
      <View style={styles.calcRow}>
        {renderNumberButton('7')}
        {renderNumberButton('8')}
        {renderNumberButton('9')}
        {renderActionButton('-', MINUS)}
      </View>
      <View style={styles.calcRow}>
        {renderNumberButton('4')}
        {renderNumberButton('5')}
        {renderNumberButton('6')}
        {renderActionButton('+', PLUS)}
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
            {renderNumberButton(',')}
          </View>
        </View>
        <TouchableHighlight
          style={[styles.enterButton]}
          onPress={onHandleEnter}
          underlayColor={'rgb(242,242,242)'}
        >
          <Text>Xong</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

export default memo(KeyboardCalculator, isEqual);
