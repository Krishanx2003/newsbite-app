

import { CategoryTabs } from '@/components/CategoryTabs';

import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  
  return (
    <View style={styles.container}>
      {/* <Header /> */}
      <CategoryTabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});