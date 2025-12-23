import React, { useState, forwardRef } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../styles';
import DeleteIcon from './DeleteIcon';

const TextField = forwardRef((
  {
    value = '',
    onChangeText,
    placeholder,
    disabled = false,
    secureTextEntry = false,
    autoFocus = false,
    placeholderTextColor,
    style,
    showClearButton = false,
    onClear,
    onSubmitEditing,
    returnKeyType = 'done',
    onFocus,
    onBlur,
  },
  ref
) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText('');
    }
  };

  const containerStyles = [styles.inputContainer];
  if (isFocused) {
    containerStyles.push(styles.inputContainerFocused);
  }
  if (showClearButton && value) {
    containerStyles.push(styles.inputContainerWithButton);
  }

  return (
    <View style={[styles.container, style]}>
      <View style={containerStyles}>
        <TextInput
          ref={ref}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || Colors.gray400}
          value={value}
          onChangeText={onChangeText}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          editable={!disabled}
          secureTextEntry={secureTextEntry}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />
        {showClearButton && value && !disabled ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <DeleteIcon width={20} height={20} color={Colors.gray300} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

TextField.displayName = 'TextField';

export default TextField;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: Colors.gray50,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 48,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: Colors.primary500,
  },
  inputContainerWithButton: {
    paddingRight: 0,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.gray900,
    padding: 0,
    margin: 0,
    outlineStyle: 'none',
  },
  clearButton: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
