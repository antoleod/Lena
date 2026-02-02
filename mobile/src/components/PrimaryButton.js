import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

function PrimaryButton({ label, onPress, variant = 'primary' }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' && styles.secondary,
        pressed && styles.pressed
      ]}
    >
      <Text style={[styles.text, variant === 'secondary' && styles.textSecondary]}>{label}</Text>
    </Pressable>
  );
}

export default memo(PrimaryButton);

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#ff7aa2',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2
  },
  secondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0d7ff'
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff'
  },
  textSecondary: {
    color: '#4a3e72'
  },
  pressed: {
    transform: [{ scale: 0.98 }]
  }
});
