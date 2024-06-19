// DualTextView.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DualTextView = ({ leftChild, rightChild, separation }) => {
  return (
    <View style={[styles.container, {marginHorizontal: separation}]}>
      <View style={[styles.child, styles.leftChild]}>
        {leftChild}
      </View>
      <View style={[styles.child, styles.rightChild]}>
        {rightChild}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  child: {
    flex: 1,
  },
  leftChild: {
    alignItems: 'flex-start',

  },
  rightChild: {
    alignItems: 'flex-end',

  },
});

export default DualTextView;