import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, StatusBar } from "react-native";
import { useFonts } from 'expo-font';

export default function IntroScreen() {

  const [loaded] = useFonts({
      'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
    });

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* left yellow circle */}
      <View style={[styles.circle, styles.circleLeft]} />

      {/* right pale circle (partially off-screen) */}
      <View style={[styles.circle, styles.circleRight]} />

      {/* Bottom-left text block */}
      <Animated.View
        style={[
          styles.textBlock,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.title}>Mind{"\n"}Margin</Text>

        <View style={{ height: 18 }} />
         <Text style={[styles.subtitle, { fontFamily: 'Montserrat-Bold' }]}>
            <Text style={{ opacity: 0.3 }}>Exploring Minds,{"\n"}Inspiring 
            Sentences.</Text>{"\n"}What's yours?
          </Text>
{/* 
        <Text style={styles.subStrong}>Exploring Mind</Text>
        <Text style={styles.sub}>Inspiring Sentence</Text>
        <Text style={styles.sub}>What’s yours?</Text> */}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFEFEF",
  },

  circle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  circleLeft: {
    left: 30,
    bottom: 280,
    backgroundColor: "#FFF45A", // 밝은 노랑
  },
  circleRight: {
    right: -140,
    bottom: 280,
    backgroundColor: "#F5F1C6", // 연노랑
  },

  textBlock: {
    position: "absolute",
    left: 30,
    bottom: 110,
  },
  title: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 54,
    fontWeight: "800",
    color: "#111111",
    lineHeight:56,
    letterSpacing:-1.5,
  },
   subtitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    fontWeight: '800',
    color: '#666666ff',
    lineHeight: 32,
    marginBottom: 30,
    marginTop:20,
    letterSpacing:-1.5,
  },
  subStrong: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing:-1.5,
    color: "#111111",
  },
  sub: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.4,
    color: "#9C9C9C",
    marginTop: 6,
  },
});
