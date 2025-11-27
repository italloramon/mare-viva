import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const WaveFooter: React.FC = () => {
  return (
    <View style={styles.container}>
      <Svg
        width="100%"
        height="80"
        viewBox="0 0 375 80"
        style={styles.wave}
      >
        <Path
          d="M0,40 Q93.75,0 187.5,40 T375,40 L375,80 L0,80 Z"
          fill="#1E3A8A"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  wave: {
    position: 'absolute',
    bottom: 0,
  },
});

export default WaveFooter;


