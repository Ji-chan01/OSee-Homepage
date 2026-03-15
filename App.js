/**
 * O See – Mobile Campus Navigator
 * Home Screen – React Native Expo (JavaScript)
 *
 * Same dependencies as SplashScreen.js
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Easing,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import {
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from '@expo-google-fonts/cormorant-garamond';

// ─── Theme ────────────────────────────────────────────────────────────────────
const C = {
  maroon:      '#6B0F1A',
  maroonDark:  '#3D0009',
  maroonLight: '#B03045',
  white:       '#FFFFFF',
  offWhite:    '#FAF7F2',
  black:       '#1A1A1A',
  gray:        '#9CA3AF',
  grayMid:     '#6B7280',
  grayLight:   '#E5E7EB',
  grayFaint:   '#F9FAFB',
  gold:        '#C9A96E',
  goldDim:     'rgba(201,169,110,0.5)',
};

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconPin = ({ size = 18, color = C.gold }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color} strokeWidth="1.8" fill={color + '20'}
    />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.6" />
  </Svg>
);

const IconFlag = ({ size = 18, color = C.maroonLight }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path
      d="M4 4l10 3-10 3"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
      fill={color + '20'}
    />
  </Svg>
);

const IconSettings = ({ size = 20, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color} strokeWidth="1.6"
    />
  </Svg>
);

const IconArrow = ({ size = 17, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12h14M13 6l6 6-6 6"
      stroke={color} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

const IconSwap = ({ size = 16, color = C.maroon }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 16V4m0 0L3 8m4-4l4 4"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M17 8v12m0 0l4-4m-4 4l-4-4"
      stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  // ── State ─────────────────────────────────────────────────────────────────────
  const [startText, setStartText] = useState('');
  const [destText,  setDestText]  = useState('');

  // Button enabled only when BOTH fields have text
  const canFind = startText.trim().length > 0 && destText.trim().length > 0;

  // ── Animations ────────────────────────────────────────────────────────────────
  const headerY  = useRef(new Animated.Value(-20)).current;
  const headerOp = useRef(new Animated.Value(0)).current;
  const cardY    = useRef(new Animated.Value(30)).current;
  const cardOp   = useRef(new Animated.Value(0)).current;
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerY,  { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(headerOp, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(150),
        Animated.parallel([
          Animated.timing(cardY,  { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(cardOp, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      ]),
    ]).start();
  }, []);

  const handleFindPath = () => {
    if (!canFind) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 90,  useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const handleSwap = () => {
    const tmp = startText;
    setStartText(destText);
    setDestText(tmp);
  };

  if (!fontsLoaded) return null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.header,
            { transform: [{ translateY: headerY }], opacity: headerOp },
          ]}
        >
          <LinearGradient
            colors={[C.maroonDark, C.maroon]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
          >
            {/* Left: logo + title */}
            <View style={styles.headerLeft}>
              <View style={styles.logoMark}>
                <Text style={styles.logoText}>O</Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>Find Your Way</Text>
                <Text style={styles.headerSub}>Osmena Colleges</Text>
              </View>
            </View>

            {/* Right: settings */}
            <TouchableOpacity style={styles.settingsBtn} activeOpacity={0.75}>
              <IconSettings size={19} color={C.white} />
            </TouchableOpacity>
          </LinearGradient>

          {/* Gold accent underline */}
          <View style={styles.headerAccent} />
        </Animated.View>

        {/* ── BODY — plain white ───────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* Compass watermark + tagline */}
          <View style={styles.topSection}>
            <View style={styles.compassWrap}>
              <View style={styles.compassOuter} />
              <View style={styles.compassInner} />
              <View style={styles.compassH} />
              <View style={styles.compassV} />
              {/* Center dot */}
              <View style={styles.compassCenter} />
              <Text style={[styles.compassDir, { top: 6 }]}>N</Text>
              <Text style={[styles.compassDir, { bottom: 6 }]}>S</Text>
              <Text style={[styles.compassDir, { right: 8 }]}>E</Text>
              <Text style={[styles.compassDir, { left: 8 }]}>W</Text>
            </View>
            {/* <Text style={styles.topTitle}>O See</Text> */}
            <Text style={styles.topSubtitle}>
              Enter your starting point and destination{'\n'}to navigate across campus.
            </Text>
          </View>

          {/* ── ROUTE CARD ──────────────────────────────────────────────────── */}
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateY: cardY }], opacity: cardOp },
            ]}
          >
            {/* Card label */}
            <View style={styles.cardLabel}>
              <View style={styles.cardLabelDot} />
              <Text style={styles.cardLabelText}>Route Planner</Text>
              <View style={styles.cardLabelLine} />
            </View>

            {/* ── Starting Point ─────────────────────────────────────────── */}
            <View style={styles.inputBlock}>
              <View style={styles.inputIconCircle}>
                <IconPin size={17} color={C.gold} />
              </View>
              <View style={styles.inputInner}>
                <Text style={styles.inputLabel}>Starting Point</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Where are you now?"
                  placeholderTextColor={C.gray}
                  value={startText}
                  onChangeText={setStartText}
                  selectionColor={C.maroon}
                  returnKeyType="next"
                />
              </View>
            </View>

            {/* ── Swap + separator ───────────────────────────────────────── */}
            <View style={styles.swapRow}>
              <View style={styles.swapLine} />
              <TouchableOpacity
                style={styles.swapBtn}
                onPress={handleSwap}
                activeOpacity={0.7}
              >
                <IconSwap size={15} color={C.maroon} />
              </TouchableOpacity>
              <View style={styles.swapLine} />
            </View>

            {/* ── Destination Point ──────────────────────────────────────── */}
            <View style={styles.inputBlock}>
              <View style={[styles.inputIconCircle, styles.inputIconCircleDest]}>
                <IconFlag size={17} color={C.maroonLight} />
              </View>
              <View style={styles.inputInner}>
                <Text style={styles.inputLabel}>Destination Point</Text>
                <TextInput
                  style={styles.inputField}
                  placeholder="Where do you want to go?"
                  placeholderTextColor={C.gray}
                  value={destText}
                  onChangeText={setDestText}
                  selectionColor={C.maroon}
                  returnKeyType="done"
                  onSubmitEditing={handleFindPath}
                />
              </View>
            </View>

            {/* ── Hint ───────────────────────────────────────────────────── */}
            <Text style={styles.hintText}>
              {canFind
                ? '✓  Route is ready — tap Find Path to navigate'
                : 'Fill in both fields to enable navigation'}
            </Text>

            {/* ── FIND PATH BUTTON ───────────────────────────────────────── */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                onPress={handleFindPath}
                activeOpacity={canFind ? 0.85 : 1}
                disabled={!canFind}
              >
                {canFind ? (
                  <LinearGradient
                    colors={[C.maroon, C.maroonLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.findBtn}
                  >
                    <Text style={styles.findBtnText}>Find Path</Text>
                    <View style={styles.findBtnIconWrap}>
                      <IconArrow size={16} color={C.white} />
                    </View>
                  </LinearGradient>
                ) : (
                  <View style={[styles.findBtn, styles.findBtnOff]}>
                    <Text style={[styles.findBtnText, styles.findBtnTextOff]}>
                      Find Path
                    </Text>
                    <View style={[styles.findBtnIconWrap, styles.findBtnIconWrapOff]}>
                      <IconArrow size={16} color={C.gray} />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>

          </Animated.View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  root: {
    flex: 1,
    backgroundColor: C.white,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    zIndex: 10,
    shadowColor: C.maroonDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop:        Platform.OS === 'ios' ? 54 : 44,
    paddingBottom:     16,
    paddingHorizontal: 20,
  },
  headerAccent: {
    height: 2.5,
    backgroundColor: C.gold,
    opacity: 0.7,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.gold,
    backgroundColor: 'rgba(201,169,110,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 26,
    color: C.gold,
    lineHeight: 30,
  },
  headerTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 22,
    color: C.white,
    letterSpacing: 0.3,
    lineHeight: 25,
  },
  headerSub: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 8,
    color: 'rgba(201,169,110,0.85)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  settingsBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Body ──────────────────────────────────────────────────────────────────
  body: {
    flex: 1,
    backgroundColor: C.white,
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 24,
  },

  // ── Top section ───────────────────────────────────────────────────────────
  topSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  compassWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  compassOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(107,15,26,0.1)',
  },
  compassInner: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(107,15,26,0.07)',
    borderStyle: 'dashed',
  },
  compassH: {
    position: 'absolute',
    width: 80,
    height: 1,
    backgroundColor: 'rgba(107,15,26,0.07)',
  },
  compassV: {
    position: 'absolute',
    width: 1,
    height: 80,
    backgroundColor: 'rgba(107,15,26,0.07)',
  },
  compassCenter: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.gold,
    opacity: 0.5,
  },
  compassDir: {
    position: 'absolute',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 7.5,
    color: C.maroon,
    opacity: 0.3,
    letterSpacing: 1,
  },
  topTitle: {
    fontFamily: 'CormorantGaramond_700Bold',
    fontSize: 24,
    color: C.maroon,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  topSubtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    color: C.grayMid,
    textAlign: 'center',
    lineHeight: 17,
    letterSpacing: 0.2,
  },

  // ── Card ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.grayLight,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  cardLabelDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.gold,
  },
  cardLabelText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 9.5,
    color: C.maroon,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  cardLabelLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.grayLight,
  },

  // ── Input blocks ──────────────────────────────────────────────────────────
  inputBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  inputIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201,169,110,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(201,169,110,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  inputIconCircleDest: {
    backgroundColor: 'rgba(176,48,69,0.06)',
    borderColor: 'rgba(176,48,69,0.15)',
  },
  inputInner: {
    flex: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: C.grayLight,
    paddingBottom: 8,
    paddingTop: 2,
  },
  inputLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 8.5,
    color: C.gray,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  inputField: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13.5,
    color: C.black,
    paddingVertical: 0,
    letterSpacing: 0.2,
  },

  // ── Swap row ──────────────────────────────────────────────────────────────
  swapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 10,
    paddingLeft: 58,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.grayLight,
  },
  swapBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: C.grayLight,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  // ── Hint ──────────────────────────────────────────────────────────────────
  hintText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 10,
    color: C.gray,
    textAlign: 'center',
    letterSpacing: 0.2,
    marginTop: 14,
    marginBottom: 4,
    opacity: 0.8,
  },

  // ── Find Path button ──────────────────────────────────────────────────────
  findBtn: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 14,
  },
  findBtnOff: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: C.grayLight,
  },
  findBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12.5,
    color: C.white,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  findBtnTextOff: {
    color: C.gray,
  },
  findBtnIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findBtnIconWrapOff: {
    backgroundColor: C.grayLight,
  },
});