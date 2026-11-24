// A small box with a label and a value (used in the info bar).
import { StyleSheet, Text, View } from 'react-native';

import { ORANGE } from './colors';

export default function InfoBox({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderColor: ORANGE, borderWidth: 1, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, alignItems: 'center' },
  label: { fontSize: 11, color: '#777' },
  value: { fontSize: 16, fontWeight: 'bold', color: ORANGE },
});
