/**
 * O See – Mobile Campus Navigator
 * User Flow: Age Selection → User Type → Home Screen
 * React Native Expo (JavaScript)
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
  FlatList,
  Modal,
  Switch,
  Platform,
  Easing,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
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
  maroon:       '#6B0F1A',
  maroonDark:   '#3D0009',
  maroonLight:  '#B03045',
  maroonFaint:  'rgba(107,15,26,0.07)',
  maroonBorder: 'rgba(107,15,26,0.18)',
  white:        '#FFFFFF',
  offWhite:     '#FAF7F2',
  black:        '#1A1A1A',
  charcoal:     '#374151',
  gray:         '#9CA3AF',
  grayMid:      '#6B7280',
  grayLight:    '#E5E7EB',
  grayFaint:    '#F9FAFB',
  gold:         '#C9A96E',
  goldFaint:    'rgba(201,169,110,0.12)',
  goldBorder:   'rgba(201,169,110,0.35)',
};

const { width: SW, height: SH } = Dimensions.get('window');

// ─── Font size scales per age range ──────────────────────────────────────────
const FONT_SCALE = {
  '18-30': { xs: 13,  sm: 14.5, md: 16.5, lg: 20,  xl: 24,  xxl: 31, hero: 39 },
  '30-40': { xs: 14, sm: 15.5, md: 17.5, lg: 21,  xl: 25,  xxl: 27, hero: 40 },
  '40+':   { xs: 15, sm: 16.5, md: 18.5, lg: 22,  xl: 26,  xxl: 33, hero: 41 },
};

// ─── Sample nodes data ────────────────────────────────────────────────────────
const NODES = [
  { id: '1',  room: 'Room 101',              floor: '1st Floor', building: 'Main Building',   has360: true  },
  { id: '2',  room: 'Room 102',              floor: '1st Floor', building: 'Main Building',   has360: false },
  { id: '3',  room: 'Room 201',              floor: '2nd Floor', building: 'Main Building',   has360: true  },
  { id: '4',  room: 'Room 202',              floor: '2nd Floor', building: 'Main Building',   has360: false },
  { id: '5',  room: 'Room 301',              floor: '3rd Floor', building: 'Main Building',   has360: false },
  { id: '6',  room: 'Room 401',              floor: '4th Floor', building: 'Ipil Building',   has360: true  },
  { id: '7',  room: 'Room 402',              floor: '4th Floor', building: 'Ipil Building',   has360: false },
  { id: '8',  room: 'Admin Office',          floor: '1st Floor', building: 'Main Building',   has360: true  },
  { id: '9',  room: 'Registrar',             floor: '1st Floor', building: 'Main Building',   has360: false },
  { id: '10', room: 'Guidance Office',       floor: '2nd Floor', building: 'Main Building',   has360: false },
  { id: '11', room: 'Library',               floor: '2nd Floor', building: 'Main Building',   has360: true  },
  { id: '12', room: 'Computer Laboratory 1', floor: '3rd Floor', building: 'Tech Building',   has360: true  },
  { id: '13', room: 'Computer Laboratory 2', floor: '3rd Floor', building: 'Tech Building',   has360: false },
  { id: '14', room: 'Science Laboratory',    floor: '2nd Floor', building: 'Science Building', has360: true },
  { id: '15', room: 'Auditorium',            floor: 'Ground',    building: 'Main Building',   has360: true  },
  { id: '16', room: 'Cafeteria',             floor: 'Ground',    building: 'Annex Building',  has360: false },
  { id: '17', room: 'Gymnasium',             floor: 'Ground',    building: 'Sports Complex',  has360: true  },
  { id: '18', room: 'Medical Clinic',        floor: 'Ground',    building: 'Annex Building',  has360: false },
  { id: '19', room: 'Chapel',               floor: 'Ground',    building: 'Campus Grounds',  has360: true  },
  { id: '20', room: 'Main Entrance',         floor: 'Ground',    building: 'Gate',            has360: true  },
  { id: '21', room: 'Faculty Room',          floor: '2nd Floor', building: 'Main Building',   has360: false },
  { id: '22', room: 'Acacia Hall',           floor: 'Ground',    building: 'Acacia Building', has360: true  },
  { id: '23', room: 'Parking Area',          floor: 'Ground',    building: 'Campus Grounds',  has360: false },
  { id: '24', room: 'Student Lounge',        floor: '1st Floor', building: 'Annex Building',  has360: false },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const IconSettings = ({ size = 20, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color} strokeWidth="1.6" />
  </Svg>
);

const IconBack = ({ size = 20, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 5l-7 7 7 7" stroke={color} strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconReload = ({ size = 20, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M1 4v6h6M23 20v-6h-6" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"
      stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconPin = ({ size = 16, color = C.gold }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={color} strokeWidth="1.8" fill={color + '20'} />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

const IconFlag = ({ size = 16, color = C.maroonLight }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 21V4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M4 4l10 3-10 3" stroke={color} strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" fill={color + '20'} />
  </Svg>
);

const IconSwap = ({ size = 16, color = C.maroon }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M7 16V4m0 0L3 8m4-4l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconArrow = ({ size = 16, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2.2"
      strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const IconSearch = ({ size = 16, color = C.gray }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.7" />
    <Line x1="16.5" y1="16.5" x2="22" y2="22" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
  </Svg>
);

const IconEye360 = ({ size = 16, color = C.maroon }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
    <Path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" stroke={color} strokeWidth="1.6" />
  </Svg>
);

const IconClose = ({ size = 20, color = C.charcoal }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const IconDownload = ({ size = 16, color = C.white }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M7 10l5 5 5-5M12 15V3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — Age Selection
// ─────────────────────────────────────────────────────────────────────────────
function AgeSelectionScreen({ onNext }) {
  const [selected, setSelected] = useState(null);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const ages = [
    { key: '18-30', label: '18 – 30',  sub: 'Young Adult',  emoji: '🎓' },
    { key: '30-40', label: '30 – 40',  sub: 'Professional', emoji: '💼' },
    { key: '40+',   label: '40 +',     sub: 'Senior',       emoji: '🌟' },
  ];
  return (
    
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

      {/* Top maroon band */}
      <LinearGradient colors={[C.maroonDark, C.maroon]} style={s.topBand}>
        <View style={s.logoRow}>
          <View style={s.logoRing}><Text style={s.logoLetter}>O</Text></View>
          <View style={s.headerCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={s.logoTitle}>O</Text>
              <Text style={[s.logoTitle, { marginLeft: 3 }]}>SEE</Text>
            </View>
            <Text style={[h.headerSub, { fontSize: 9, marginLeft: 3 }]}>
              Campus Navigator
            </Text>
          </View>
          
        </View>
      </LinearGradient>
      <View style={s.topAccent} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Animated.View style={[s.ageBody, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Step indicator */}
          <View style={s.stepRow}>
            <View style={[s.stepDot, s.stepDotActive]} />
            <View style={s.stepLine} />
            <View style={s.stepDot} />
          </View>
          <Text style={s.stepLabel}>Step 1 of 2</Text>

          <Text style={s.ageTitle} >How old are you?</Text>
          <Text style={s.ageSub}>
            We'll adjust the display to make navigation easier for you.
          </Text>

          <View style={s.ageOptions}>
            {ages.map(a => (
              <TouchableOpacity
                key={a.key}
                style={[s.ageCard, selected === a.key && s.ageCardSelected]}
                onPress={() => setSelected(a.key)}
                activeOpacity={0.8}
              >
                <Text style={s.ageEmoji}>{a.emoji}</Text>
                <Text style={[s.ageLabel, selected === a.key && s.ageLabelSelected]}>
                  {a.label}
                </Text>
                <Text style={[s.ageSublabel, selected === a.key && { color: C.maroon }]}>
                  {a.sub}
                </Text>
                {selected === a.key && <View style={s.ageCheckDot} />}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[s.nextBtn]}
            onPress={() => selected && onNext(selected)}
            activeOpacity={selected ? 0.85 : 1}
          >
            <LinearGradient
              colors={selected ? [C.maroon, C.maroonLight] : [C.grayLight, C.grayLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={s.nextBtnGrad}
            >
              <Text style={[s.nextBtnText, !selected && { color: C.gray }]}>Next</Text>
              <IconArrow size={16} color={selected ? C.white : C.gray} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={s.hintText}>
            Please select your age range to continue
          </Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — User Type Selection
// ─────────────────────────────────────────────────────────────────────────────
function UserTypeScreen({ ageRange, onBack, onFinish }) {
  const [selected, setSelected] = useState(null);
  const F = FONT_SCALE[ageRange];
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const types = [
    { key: 'student',  label: 'Student',          emoji: '📚', desc: 'Currently enrolled student' },
    { key: 'teacher',  label: 'Teacher',           emoji: '🏫', desc: 'Faculty member / instructor' },
    { key: 'faculty',  label: 'Faculty / Staff',   emoji: '🏛️', desc: 'Non-teaching staff member'  },
    { key: 'guest',    label: 'Guest',             emoji: '🤝', desc: 'Invited guest'    },
    { key: 'visitor',  label: 'Visitor',           emoji: '👤', desc: 'Walk-in campus visitor'      },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

      <LinearGradient colors={[C.maroonDark, C.maroon]} style={s.topBand}>
        <View style={s.logoRow}>
          <View style={s.logoRing}><Text style={s.logoLetter}>O</Text></View>
          <View style={s.headerCenter}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={s.logoTitle}>O</Text>
              <Text style={[s.logoTitle, { marginLeft: 3 }]}>SEE</Text>
            </View>
            <Text style={[h.headerSub, { fontSize: 9, marginLeft: 3 }]}>
              Campus Navigator
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View style={s.topAccent} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <Animated.View style={[s.ageBody, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Step indicator */}
          <View style={s.stepRow}>
            <View style={[s.stepDot, s.stepDotDone]}>
              <Text style={{ color: C.white, fontSize: 8, fontFamily: 'Montserrat_700Bold' }}>✓</Text>
            </View>
            <View style={[s.stepLine, { backgroundColor: C.maroon }]} />
            <View style={[s.stepDot, s.stepDotActive]} />
          </View>
          <Text style={s.stepLabel}>Step 2 of 2</Text>

          <Text style={[s.ageTitle, { fontSize: F.xl }]}>Who are you?</Text>
          <Text style={[s.ageSub, { fontSize: F.sm }]}>
            This helps us personalize your campus experience.
          </Text>

          <View style={s.typeList}>
            {types.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[s.typeCard, selected === t.key && s.typeCardSelected]}
                onPress={() => setSelected(t.key)}
                activeOpacity={0.8}
              >
                <Text style={[s.typeEmoji, { fontSize: F.xl }]}>{t.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[s.typeLabel, { fontSize: F.md }, selected === t.key && { color: C.maroon }]}>
                    {t.label}
                  </Text>
                  <Text style={[s.typeDesc, { fontSize: F.xs }]}>{t.desc}</Text>
                </View>
                <View style={[s.typeRadio, selected === t.key && s.typeRadioSelected]}>
                  {selected === t.key && <View style={s.typeRadioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.finishRow}>
            <TouchableOpacity style={s.backBtn} onPress={onBack} activeOpacity={0.75}>
              <IconBack size={18} color={C.maroon} />
              <Text style={[s.backBtnText, { fontSize: F.sm }]}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.finishBtn]}
              onPress={() => selected && onFinish(selected)}
              activeOpacity={selected ? 0.85 : 1}
            >
              <LinearGradient
                colors={selected ? [C.maroon, C.maroonLight] : [C.grayLight, C.grayLight]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={s.finishBtnGrad}
              >
                <Text style={[s.finishBtnText, { fontSize: F.md }]}>
                  Finish
                </Text>
                <IconArrow size={16} color={selected ? C.white : C.gray} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={[s.hintText, { fontSize: F.xs, textAlign: 'center' }]}>
            Please select your user type to continue
          </Text>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NODE PICKER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function NodePickerModal({ visible, title, onSelect, onClose, F }) {
  const [query, setQuery] = useState('');

  const filtered = query.trim().length === 0
    ? NODES
    : NODES.filter(n =>
        n.room.toLowerCase().includes(query.toLowerCase()) ||
        n.building.toLowerCase().includes(query.toLowerCase()) ||
        n.floor.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={nm.root}>
        <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

        {/* Modal header */}
        <LinearGradient colors={[C.maroonDark, C.maroon]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={nm.header}>
          <TouchableOpacity style={nm.closeBtn} onPress={() => { setQuery(''); onClose(); }} activeOpacity={0.75}>
            <IconClose size={20} color={C.white} />
          </TouchableOpacity>
          <Text style={[nm.headerTitle, { fontSize: 24 }]}>{title}</Text>
          <View style={{ width: 36 }} />
        </LinearGradient>
        <View style={nm.headerAccent} />

        {/* Search */}
        <View style={nm.searchWrap}>
          <View style={nm.searchBox}>
            <IconSearch size={16} color={C.gray} />
            <TextInput
              style={[nm.searchInput, { fontSize: F.md }]}
              placeholder="Search by room name, number or building..."
              placeholderTextColor={C.gray}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              selectionColor={C.maroon}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                <IconClose size={14} color={C.gray} />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[nm.resultCount, { fontSize: F.xs }]}>
            {filtered.length} location{filtered.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        {/* List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={nm.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[nm.nodeItem, index === filtered.length - 1 && { borderBottomWidth: 0 }]}
              onPress={() => { setQuery(''); onSelect(item); }}
              activeOpacity={0.75}
            >
              {/* Icon */}
              <View style={nm.nodeIconWrap}>
                <IconPin size={18} color={C.maroon} />
              </View>

              {/* Info */}
              <View style={nm.nodeInfo}>
                <Text style={[nm.nodeRoom, { fontSize: F.md }]} numberOfLines={1}>
                  {item.room}
                </Text>
                <View style={nm.nodeMeta}>
                  <View style={nm.nodeMetaBadge}>
                    <Text style={[nm.nodeMetaText, { fontSize: F.xs }]}>{item.floor}</Text>
                  </View>
                  <Text style={[nm.nodeMetaSep, { fontSize: F.xs }]}>·</Text>
                  <Text style={[nm.nodeBuilding, { fontSize: F.xs }]} numberOfLines={1}>
                    {item.building}
                  </Text>
                </View>
              </View>

              {/* 360 eye button */}
              {item.has360 && (
                <TouchableOpacity style={nm.eyeBtn} activeOpacity={0.75}>
                  <IconEye360 size={16} color={C.maroon} />
                  <Text style={[nm.eyeBtnText, { fontSize: F.xs }]}>360°</Text>
                </TouchableOpacity>
              )}

              <View style={nm.nodeChevron}>
                <IconArrow size={14} color={C.grayLight} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SettingsModal({ visible, onClose, F }) {
  const [hdQuality,    setHdQuality]    = useState(false);
  const [forceOffline, setForceOffline] = useState(false);
  const [autoSync,     setAutoSync]     = useState(true);
  const [wifiOnly,     setWifiOnly]     = useState(false);

  // Track if any change was made from defaults
  const [initial] = useState({ hdQuality: false, forceOffline: false, autoSync: true, wifiOnly: false });
  const hasChanges =
    hdQuality    !== initial.hdQuality    ||
    forceOffline !== initial.forceOffline ||
    autoSync     !== initial.autoSync     ||
    wifiOnly     !== initial.wifiOnly;

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <View style={sm.root}>
        <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

        {/* Header */}
        <LinearGradient colors={[C.maroonDark, C.maroon]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sm.header}>
          <TouchableOpacity style={sm.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <IconClose size={20} color={C.white} />
          </TouchableOpacity>
          <Text style={[sm.headerTitle, { fontSize: 24 }]}>Settings</Text>
          <View style={{ width: 36 }} />
        </LinearGradient>
        <View style={sm.headerAccent} />

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}
          contentContainerStyle={sm.scrollContent}>

          {/* ── 360° Image Quality ──────────────────────────────────────── */}
          <View style={sm.section}>
            <Text style={[sm.sectionTitle, { fontSize: F.sm }]}>360° Image Quality</Text>
            <Text style={[sm.sectionDesc, { fontSize: F.xs }]}>
              HD provides sharper panoramic views but uses more data.
            </Text>
            <View style={sm.toggleRow}>
              <TouchableOpacity
                style={[sm.qualityBtn, !hdQuality && sm.qualityBtnActive]}
                onPress={() => setHdQuality(false)}
                activeOpacity={0.8}
              >
                <Text style={[sm.qualityBtnText, { fontSize: F.sm }, !hdQuality && sm.qualityBtnTextActive]}>
                  SD
                </Text>
                <Text style={[sm.qualityBtnSub, { fontSize: F.xs }, !hdQuality && { color: C.white }]}>
                  Default
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[sm.qualityBtn, hdQuality && sm.qualityBtnActive]}
                onPress={() => setHdQuality(true)}
                activeOpacity={0.8}
              >
                <Text style={[sm.qualityBtnText, { fontSize: F.sm }, hdQuality && sm.qualityBtnTextActive]}>
                  HD
                </Text>
                <Text style={[sm.qualityBtnSub, { fontSize: F.xs }, hdQuality && { color: C.white }]}>
                  High Quality
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={sm.divider} />

          {/* ── Force Offline Mode ──────────────────────────────────────── */}
          <View style={sm.section}>
            <View style={sm.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={[sm.settingLabel, { fontSize: F.md }]}>Force Offline Mode</Text>
                <Text style={[sm.settingDesc, { fontSize: F.xs }]}>
                  Use only downloaded map data, no internet required.
                </Text>
              </View>
              <Switch
                value={forceOffline}
                onValueChange={setForceOffline}
                trackColor={{ false: C.grayLight, true: C.maroon + '80' }}
                thumbColor={forceOffline ? C.maroon : C.gray}
                ios_backgroundColor={C.grayLight}
              />
            </View>
          </View>

          <View style={sm.divider} />

          {/* ── Offline Resources ───────────────────────────────────────── */}
          <View style={sm.section}>
            <Text style={[sm.sectionTitle, { fontSize: F.sm }]}>Offline Resources</Text>
            <Text style={[sm.sectionDesc, { fontSize: F.xs }]}>
              Manage how map data is downloaded and stored on your device.
            </Text>

            {/* Auto-sync */}
            <View style={[sm.settingRow, { marginTop: 14 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[sm.settingLabel, { fontSize: F.md }]}>Auto-sync</Text>
                <Text style={[sm.settingDesc, { fontSize: F.xs }]}>
                  Automatically update map data in the background.
                </Text>
              </View>
              <Switch
                value={autoSync}
                onValueChange={setAutoSync}
                trackColor={{ false: C.grayLight, true: C.maroon + '80' }}
                thumbColor={autoSync ? C.maroon : C.gray}
                ios_backgroundColor={C.grayLight}
              />
            </View>

            {/* Wi-Fi only */}
            <View style={[sm.settingRow, { marginTop: 14 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[sm.settingLabel, { fontSize: F.md }]}>Wi-Fi Only</Text>
                <Text style={[sm.settingDesc, { fontSize: F.xs }]}>
                  Only sync and download when connected to Wi-Fi.
                </Text>
              </View>
              <Switch
                value={wifiOnly}
                onValueChange={setWifiOnly}
                trackColor={{ false: C.grayLight, true: C.maroon + '80' }}
                thumbColor={wifiOnly ? C.maroon : C.gray}
                ios_backgroundColor={C.grayLight}
              />
            </View>

            {/* Download all */}
            <TouchableOpacity style={sm.downloadBtn} activeOpacity={0.85}>
              <LinearGradient colors={[C.maroonDark, C.maroon]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={sm.downloadBtnGrad}>
                <IconDownload size={16} color={C.white} />
                <Text style={[sm.downloadBtnText, { fontSize: F.md }]}>
                  Download All Resources
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Apply button */}
        <View style={sm.applyWrap}>
          <TouchableOpacity
            style={[sm.applyBtn]}
            onPress={() => hasChanges && onClose()}
            activeOpacity={hasChanges ? 0.85 : 1}
          >
            <LinearGradient
              colors={hasChanges ? [C.maroon, C.maroonLight] : [C.grayLight, C.grayLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={sm.applyBtnGrad}
            >
              <Text style={[sm.applyBtnText, { fontSize: F.md }, !hasChanges && { color: C.gray }]}>
                Apply Changes
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — Home Screen
// ─────────────────────────────────────────────────────────────────────────────
function HomeScreen({ ageRange, userType, onBack }) {
  const F = FONT_SCALE[ageRange];
  const [startNode,      setStartNode]      = useState(null);
  const [destNode,       setDestNode]       = useState(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDestPicker,  setShowDestPicker]  = useState(false);
  const [showSettings,   setShowSettings]    = useState(false);
  const [startLayout, setStartLayout] = useState(null);
  const [destLayout,  setDestLayout]  = useState(null);

  const canFind = startNode && destNode;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const btnScale  = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleSwap = () => {
    const tmp = startNode;
    setStartNode(destNode);
    setDestNode(tmp);
  };

  const handleFindPath = () => {
    if (!canFind) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.96, duration: 90, useNativeDriver: true }),
      Animated.spring(btnScale, { toValue: 1, tension: 200, friction: 5, useNativeDriver: true }),
    ]).start();
  };

  const userTypeLabel = {
    student: 'Student', teacher: 'Teacher',
    faculty: 'Faculty/Staff', guest: 'Guest', visitor: 'Visitor',
  }[userType] || '';

  return (
    <View style={h.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.maroonDark} />

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <Animated.View style={[h.header, { opacity: fadeAnim }]}>
        <LinearGradient colors={[C.maroonDark, C.maroon]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={h.headerGrad}>

          {/* Back */}
          <TouchableOpacity style={h.headerBtn} onPress={onBack} activeOpacity={0.75}>
            <IconBack size={19} color={C.white} />
          </TouchableOpacity>

          {/* Title */}
          <View style={h.headerCenter}>
            <Text style={[h.headerTitle, { fontSize: 24 }]}>Find Your Way</Text>
            <Text style={[h.headerSub, { fontSize: 9 }]}>OSMEÑA COLLEGES</Text>
          </View>

          {/* Reload */}
          <TouchableOpacity style={h.headerBtn} activeOpacity={0.75}>
            <IconReload size={18} color={C.white} />
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity style={h.headerBtn} onPress={() => setShowSettings(true)} activeOpacity={0.75}>
            <IconSettings size={19} color={C.white} />
          </TouchableOpacity>
        </LinearGradient>
        <View style={h.headerAccent} />
      </Animated.View>

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <View style={h.body}>
        <Animated.View style={[h.bodyInner, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Greeting chip */}
          <View style={h.greetRow}>
            <View style={h.greetChip}>
              <Text style={[h.greetChipText, { fontSize: F.xs }]}>
                👋  Welcome, {userTypeLabel}
              </Text>
            </View>
          </View>

          {/* Compass watermark */}
          <View style={h.compassWrap} pointerEvents="none">
            <View style={h.compassOuter} />
            <View style={h.compassInner} />
            <View style={h.compassH} />
            <View style={h.compassV} />
            <View style={h.compassCenter} />
            <Text style={[h.compassDir, { top: 8 }]}>N</Text>
            <Text style={[h.compassDir, { bottom: 8 }]}>S</Text>
            <Text style={[h.compassDir, { right: 10 }]}>E</Text>
            <Text style={[h.compassDir, { left: 10 }]}>W</Text>
          </View>

          <Text style={[h.heroSub, { fontSize: 14 }]}>
            Enter your starting point and destination{'\n'}to find the best path on campus.
          </Text>

          {/* ── ROUTE CARD ──────────────────────────────────────────────── */}
          <View style={h.card}>

            {/* Card label */}
            <View style={h.cardLabel}>
              <View style={h.cardLabelDot} />
              <Text style={[h.cardLabelText, { fontSize: F.xs }]}>Route Planner</Text>
              <View style={h.cardLabelLine} />
            </View>

            {/* Starting Point button */}
            <View 
              style={h.inputRow}
              onLayout={e => setStartLayout(e.nativeEvent.layout)}
            >
              <View style={h.inputIconCircle}>
                <IconPin size={17} color={C.gold} />
              </View>
              <TouchableOpacity
                style={[h.inputBtn, startNode && h.inputBtnFilled]}
                onPress={() => setShowStartPicker(true)}
                activeOpacity={0.8}
              >
                <View style={h.inputBtnInner}>
                  <Text style={[h.inputBtnLabel, { fontSize: F.xs }]}>Starting Point</Text>
                  <Text
                    style={[
                      h.inputBtnValue,
                      { fontSize: F.md },
                      !startNode && h.inputBtnPlaceholder,
                    ]}
                    numberOfLines={1}
                  >
                    {startNode ? startNode.room : 'Where are you now?'}
                  </Text>
                  {startNode && (
                    <Text style={[h.inputBtnBuilding, { fontSize: F.xs }]} numberOfLines={1}>
                      {startNode.floor} · {startNode.building}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Dynamic Connector */}
            {startLayout && destLayout && (() => {
              const startCenterY = startLayout.y + startLayout.height / 2;
              const destCenterY  = destLayout.y  + destLayout.height  / 2;
              const iconHalf = 30;
              const top    = startCenterY + iconHalf;
              const height = destCenterY - startCenterY - iconHalf * 2;
              const left   = 18 + 22 - 1;

              return (
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    left,
                    top,
                    height,
                    width: 2,
                    alignItems: 'center',
                    zIndex: 0,
                  }}
                >
                  <View style={h.connectorDotGold} />
                  <View style={{ flex: 1, width: 1.5, backgroundColor: C.grayLight }} />
                  <View style={h.connectorDotMaroon} />
                </View>
              );
            })()}

            {/* Swap row */}
            <View style={h.swapRow}>
              <View style={h.swapLine} />
              <TouchableOpacity style={h.swapBtn} onPress={handleSwap} activeOpacity={0.7}>
                <IconSwap size={15} color={C.maroon} />
              </TouchableOpacity>
              <View style={h.swapLine} />
            </View>

            {/* Destination Point button */}
            <View 
              style={h.inputRow}
              onLayout={e => setDestLayout(e.nativeEvent.layout)}
            >
              <View style={[h.inputIconCircle, h.inputIconCircleDest]}>
                <IconFlag size={17} color={C.maroonLight} />
              </View>
              <TouchableOpacity
                style={[h.inputBtn, destNode && h.inputBtnFilled]}
                onPress={() => setShowDestPicker(true)}
                activeOpacity={0.8}
              >
                <View style={h.inputBtnInner}>
                  <Text style={[h.inputBtnLabel, { fontSize: F.xs }]}>Destination Point</Text>
                  <Text
                    style={[
                      h.inputBtnValue,
                      { fontSize: F.md },
                      !destNode && h.inputBtnPlaceholder,
                    ]}
                    numberOfLines={1}
                  >
                    {destNode ? destNode.room : 'Where do you want to go?'}
                  </Text>
                  {destNode && (
                    <Text style={[h.inputBtnBuilding, { fontSize: F.xs }]} numberOfLines={1}>
                      {destNode.floor} · {destNode.building}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>

            {/* Hint */}
            <Text style={[h.hintTxt, { fontSize: F.xs }]}>
              {canFind
                ? '✓  Route ready — tap Find Path to navigate'
                : 'Tap a field above to select a location'}
            </Text>

            {/* Find Path button */}
            <Animated.View style={{ transform: [{ scale: btnScale }] }}>
              <TouchableOpacity
                onPress={handleFindPath}
                activeOpacity={canFind ? 0.85 : 1}
              >
                <LinearGradient
                  colors={canFind ? [C.maroon, C.maroonLight] : [C.grayLight, C.grayLight]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[h.findBtn, { height: 50 + (F.md - 12.5) * 1.5 }]}
                >
                  <Text style={[h.findBtnText, { fontSize: F.md }, !canFind && { color: C.gray }]}>
                    Find Path
                  </Text>
                  <View style={[h.findBtnIcon, !canFind && h.findBtnIconOff]}>
                    <IconArrow size={16} color={canFind ? C.white : C.gray} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

          </View>
        </Animated.View>
      </View>

      {/* Modals */}
      <NodePickerModal
        visible={showStartPicker}
        title="Select Starting Point"
        onSelect={(node) => { setStartNode(node); setShowStartPicker(false); }}
        onClose={() => setShowStartPicker(false)}
        F={F}
      />
      <NodePickerModal
        visible={showDestPicker}
        title="Select Destination"
        onSelect={(node) => { setDestNode(node); setShowDestPicker(false); }}
        onClose={() => setShowDestPicker(false)}
        F={F}
      />
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        F={F}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — Navigation controller
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,    setScreen]    = useState('age');   // 'age' | 'type' | 'home'
  const [ageRange,  setAgeRange]  = useState(null);
  const [userType,  setUserType]  = useState(null);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    CormorantGaramond_600SemiBold,
    CormorantGaramond_700Bold,
  });

  if (!fontsLoaded) return null;

  if (screen === 'age') {
    return (
      <AgeSelectionScreen
        onNext={(age) => { setAgeRange(age); setScreen('type'); }}
      />
    );
  }
  if (screen === 'type') {
    return (
      <UserTypeScreen
        ageRange={ageRange}
        onBack={() => setScreen('age')}
        onFinish={(type) => { setUserType(type); setScreen('home'); }}
      />
    );
  }
  return (
    <HomeScreen
      ageRange={ageRange}
      userType={userType}
      onBack={() => setScreen('type')}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// STYLES
// ═════════════════════════════════════════════════════════════════════════════

// ── Shared / Onboarding ──────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  topBand: {
    paddingTop:    Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  topAccent: { height: 3, backgroundColor: C.gold, opacity: 0.55 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoRing: {
    width: 42, height: 42, borderRadius: 21,
    borderWidth: 1.5, borderColor: C.gold,
    backgroundColor: 'rgba(201,169,110,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  logoLetter: { fontFamily: 'CormorantGaramond_700Bold', fontSize: 28, color: C.gold, lineHeight: 32 },
  logoTitle:  { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: C.white, letterSpacing: 6 },

  ageBody: { paddingHorizontal: 22, paddingTop: 24, paddingBottom: 16 },

  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  stepDot: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: C.grayLight,
    backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center',
  },
  stepDotActive: { borderColor: C.maroon, backgroundColor: C.maroon },
  stepDotDone:   { borderColor: C.maroon, backgroundColor: C.maroon },
  stepLine: { flex: 1, height: 2, backgroundColor: C.grayLight, marginHorizontal: 6 },
  stepLabel: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10,
    color: C.gray, letterSpacing: 0.5, marginBottom: 18,
  },

  ageTitle: {
    fontFamily: 'CormorantGaramond_700Bold', fontSize: 31,
    color: C.maroon, letterSpacing: 0.3, lineHeight: 32, marginBottom: 6,
  },
  ageSub: {
    fontFamily: 'Montserrat_400Regular', fontSize: 13,
    color: C.grayMid, lineHeight: 17, letterSpacing: 0.2, marginBottom: 24,
  },

  ageOptions: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  ageCard: {
    flex: 1, backgroundColor: C.white,
    borderRadius: 16, borderWidth: 2, borderColor: C.grayLight,
    padding: 14, alignItems: 'center', gap: 5,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2,
  },
  ageCardSelected: { borderColor: C.maroon},
  ageEmoji:        { fontSize: 26 },
  ageLabel: {
    fontFamily: 'Montserrat_700Bold', fontSize: 16.5,
    color: C.black, letterSpacing: 0.3,
  },
  ageLabelSelected: { color: C.maroon },
  ageSublabel: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10,
    color: C.gray, letterSpacing: 0.3,
  },
  ageCheckDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: C.maroon, marginTop: 2,
  },

  nextBtn: { borderRadius: 14, overflow: 'hidden' },
  nextBtnOff: { backgroundColor: C.grayFaint, borderWidth: 1, borderColor: C.grayLight },
  nextBtnGrad: {
    height: 52, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  nextBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14,
    color: C.white, letterSpacing: 3, textTransform: 'uppercase',
  },
  hintText: {
    fontFamily: 'Montserrat_400Regular', fontSize: 12,
    color: C.gray, textAlign: 'center', marginTop: 10, letterSpacing: 0.3,
  },

  typeList: { gap: 8, marginBottom: 20 },
  typeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: C.white, borderRadius: 14,
    borderWidth: 1.5, borderColor: C.grayLight,
    padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  typeCardSelected: { borderColor: C.maroon},
  typeEmoji: { fontSize: 24, flexShrink: 0 },
  typeLabel: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 13.5,
    color: C.black, letterSpacing: 0.2, lineHeight: 18,
  },
  typeDesc: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.gray, letterSpacing: 0.2, marginTop: 2,
  },
  typeRadio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: C.grayLight,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  typeRadioSelected: { borderColor: C.maroon },
  typeRadioInner: {
    width: 10, height: 10, borderRadius: 5, backgroundColor: C.maroon,
  },

  finishRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 16, paddingVertical: 14,
    borderRadius: 13, borderWidth: 1.5, borderColor: C.maroonBorder,
    backgroundColor: C.maroonFaint,
  },
  backBtnText: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 13,
    color: C.maroon, letterSpacing: 0.5,
  },
  finishBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
  finishBtnOff: { backgroundColor: C.grayFaint, borderWidth: 1, borderColor: C.grayLight },
  finishBtnGrad: {
    height: 57, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  finishBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 14,
    color: C.white, letterSpacing: 3, textTransform: 'uppercase',
  },

  footerTxt: {
    fontFamily: 'Montserrat_400Regular', fontSize: 9.5,
    color: C.gray, letterSpacing: 1, textTransform: 'uppercase',
  },
});

// ── Node Picker Modal ─────────────────────────────────────────────────────────
const nm = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 14, paddingHorizontal: 14, gap: 8,
  },
  headerAccent: { height: 3, backgroundColor: C.gold, opacity: 0.55 },
  headerTitle: {
    flex: 1, fontFamily: 'CormorantGaramond_700Bold', fontSize: 20,
    color: C.white, textAlign: 'center', letterSpacing: 0.3,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  searchWrap: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 48, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.grayLight,
    backgroundColor: C.grayFaint, paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1, fontFamily: 'Montserrat_400Regular',
    fontSize: 13, color: C.black, paddingVertical: 0,
  },
  resultCount: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10,
    color: C.gray, marginTop: 8, marginLeft: 2, letterSpacing: 0.3,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 24 },
  nodeItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: C.grayFaint,
  },
  nodeIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: C.maroonFaint,
    borderWidth: 1, borderColor: C.maroonBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  nodeInfo: { flex: 1 },
  nodeRoom: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 13.5,
    color: C.black, letterSpacing: 0.2, marginBottom: 4,
  },
  nodeMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nodeMetaBadge: {
    backgroundColor: C.maroonFaint, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
    borderWidth: 1, borderColor: C.maroonBorder,
  },
  nodeMetaText: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 9,
    color: C.maroon, letterSpacing: 0.3,
  },
  nodeMetaSep: { color: C.grayLight, fontSize: 10 },
  nodeBuilding: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.grayMid, flex: 1, letterSpacing: 0.2,
  },
  eyeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: C.maroonFaint, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 5,
    borderWidth: 1, borderColor: C.maroonBorder, flexShrink: 0,
  },
  eyeBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 8.5,
    color: C.maroon, letterSpacing: 0.5,
  },
  nodeChevron: { flexShrink: 0, opacity: 0.4 },
});

// ── Settings Modal ────────────────────────────────────────────────────────────
const sm = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 14, paddingHorizontal: 14, gap: 8,
  },
  headerAccent: { height: 3, backgroundColor: C.gold, opacity: 0.55 },
  headerTitle: {
    flex: 1, fontFamily: 'CormorantGaramond_700Bold', fontSize: 20,
    color: C.white, textAlign: 'center', letterSpacing: 0.3,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: 18, paddingTop: 18, paddingBottom: 8 },
  section: { marginBottom: 6 },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold', fontSize: 11,
    color: C.charcoal, letterSpacing: 0.5, marginBottom: 4,
  },
  sectionDesc: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.gray, lineHeight: 15, letterSpacing: 0.2, marginBottom: 12,
  },
  divider: { height: 1, backgroundColor: C.grayLight, marginVertical: 16 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  qualityBtn: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    borderColor: C.grayLight, backgroundColor: C.grayFaint,
    paddingVertical: 12, alignItems: 'center', gap: 2,
  },
  qualityBtnActive: { borderColor: C.maroon, backgroundColor: C.maroon },
  qualityBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 15,
    color: C.charcoal, letterSpacing: 1,
  },
  qualityBtnTextActive: { color: C.white },
  qualityBtnSub: {
    fontFamily: 'Montserrat_400Regular', fontSize: 9.5,
    color: C.gray, letterSpacing: 0.3,
  },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  settingLabel: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 13,
    color: C.charcoal, letterSpacing: 0.2,
  },
  settingDesc: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.gray, lineHeight: 15, letterSpacing: 0.2, marginTop: 2,
  },
  downloadBtn: {
    borderRadius: 12, overflow: 'hidden', marginTop: 16,
    shadowColor: C.maroon, shadowOpacity: 0.2,
    shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4,
  },
  downloadBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    height: 48, gap: 10,
  },
  downloadBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 13,
    color: C.white, letterSpacing: 1,
  },
  applyWrap: {
    paddingHorizontal: 18,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    borderTopWidth: 1, borderTopColor: C.grayLight,
    backgroundColor: C.white,
  },
  applyBtn: { borderRadius: 14, overflow: 'hidden' },
  applyBtnOff: { backgroundColor: C.grayFaint, borderWidth: 1, borderColor: C.grayLight },
  applyBtnGrad: {
    height: 52, alignItems: 'center', justifyContent: 'center',
  },
  applyBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 13.5,
    color: C.white, letterSpacing: 2.5, textTransform: 'uppercase',
  },
  applyHint: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.gray, textAlign: 'center', marginTop: 8, letterSpacing: 0.3,
  },
});

// ── Home Screen ───────────────────────────────────────────────────────────────
const h = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.white },
  header: {
    shadowColor: C.maroonDark, shadowOpacity: 0.22,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 8,
  },
  headerGrad: {
    flexDirection: 'row', alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    paddingBottom: 12, paddingHorizontal: 8, gap: 2,
  },
  headerAccent: { height: 3, backgroundColor: C.gold, opacity: 0.55 },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerCenter: { flex: 1, marginLeft: 12, alignItems: 'flex-start' },
  headerTitle: {
    fontFamily: 'CormorantGaramond_700Bold', fontSize: 20,
    color: C.white, letterSpacing: 0.3, lineHeight: 23,
  },
  headerSub: {
    fontFamily: 'Montserrat_400Regular', fontSize: 8,
    color: 'rgba(201,169,110,0.8)', letterSpacing: 2, textTransform: 'uppercase',
  },

  body: { flex: 1, backgroundColor: C.white },
  bodyInner: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },

  greetRow: { alignItems: 'flex-start', marginBottom: 16 },
  greetChip: {
    backgroundColor: C.maroonFaint, borderRadius: 20,
    borderWidth: 1, borderColor: C.maroonBorder,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  greetChipText: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 10,
    color: C.maroon, letterSpacing: 0.3,
  },

  compassWrap: {
    width: 80, height: 80,
    alignSelf: 'center', alignItems: 'center',
    justifyContent: 'center', marginBottom: 10,
  },
  compassOuter: {
    position: 'absolute', width: 80, height: 80,
    borderRadius: 40, borderWidth: 1, borderColor: 'rgba(107,15,26,0.1)',
  },
  compassInner: {
    position: 'absolute', width: 52, height: 52,
    borderRadius: 26, borderWidth: 1,
    borderColor: 'rgba(107,15,26,0.07)', borderStyle: 'dashed',
  },
  compassH: { position: 'absolute', width: 80, height: 1, backgroundColor: 'rgba(107,15,26,0.07)' },
  compassV: { position: 'absolute', width: 1, height: 80, backgroundColor: 'rgba(107,15,26,0.07)' },
  compassCenter: {
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.gold, opacity: 0.5,
  },
  compassDir: {
    position: 'absolute', fontFamily: 'Montserrat_700Bold',
    fontSize: 7.5, color: C.maroon, opacity: 0.3, letterSpacing: 1,
  },

  heroTitle: {
    fontFamily: 'CormorantGaramond_700Bold', fontSize: 26,
    color: C.maroon, letterSpacing: 0.5,
    textAlign: 'center', marginBottom: 6,
  },
  heroSub: {
    fontFamily: 'Montserrat_400Regular', fontSize: 11,
    color: C.grayMid, textAlign: 'center',
    lineHeight: 17, letterSpacing: 0.2, marginBottom: 22,
  },

  // Card
  card: {
    backgroundColor: C.white, borderRadius: 20,
    borderWidth: 1, borderColor: C.grayLight,
    padding: 18,
    shadowColor: '#000', shadowOpacity: 0.07,
    shadowRadius: 16, shadowOffset: { width: 0, height: 4 }, elevation: 4,
  },
  cardLabel: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16,
  },
  cardLabelDot: {
    width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.gold,
  },
  cardLabelText: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 9.5,
    color: C.maroon, letterSpacing: 2.5, textTransform: 'uppercase',
  },
  cardLabelLine: { flex: 1, height: 1, backgroundColor: C.grayLight },

  connectorDotGold: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: C.gold, marginBottom: 2,
  },

  connectorDotMaroon: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: C.maroonLight, marginTop: 2,
  },

  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 12, zIndex: 1 },
  inputIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: C.goldFaint, borderWidth: 1, borderColor: C.goldBorder,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  inputIconCircleDest: {
    backgroundColor: C.maroonFaint, borderColor: C.maroonBorder
  },
  inputBtn: {
    flex: 1, minHeight: 56, borderRadius: 12,
    borderWidth: 1.5, borderColor: C.grayLight,
    backgroundColor: C.grayFaint, paddingHorizontal: 14, justifyContent: 'center',
  },
  inputBtnFilled: {
    borderColor: C.maroonBorder, backgroundColor: C.maroonFaint,
  },
  inputBtnInner: { gap: 2 },
  inputBtnLabel: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 8.5,
    color: C.gray, letterSpacing: 1.8, textTransform: 'uppercase',
  },
  inputBtnValue: {
    fontFamily: 'Montserrat_600SemiBold', fontSize: 13.5,
    color: C.black, letterSpacing: 0.2,
  },
  inputBtnPlaceholder: { color: C.gray, fontFamily: 'Montserrat_400Regular' },
  inputBtnBuilding: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10,
    color: C.grayMid, letterSpacing: 0.2,
  },

  swapRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginVertical: 10, paddingLeft: 56,
  },
  swapLine: { flex: 1, height: 1, backgroundColor: C.grayLight },
  swapBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5, borderColor: C.grayLight,
    backgroundColor: C.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },

  hintTxt: {
    fontFamily: 'Montserrat_400Regular', fontSize: 10.5,
    color: C.gray, textAlign: 'center',
    marginTop: 12, marginBottom: 4, letterSpacing: 0.2,
  },

  findBtn: {
    height: 52, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10, marginTop: 12,
    shadowColor: C.maroon, shadowOpacity: 0.28,
    shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5,
  },
  findBtnOff: {
    backgroundColor: C.grayFaint, borderWidth: 1,
    borderColor: C.grayLight, shadowOpacity: 0, elevation: 0,
  },
  findBtnText: {
    fontFamily: 'Montserrat_700Bold', fontSize: 13.5,
    color: C.white, letterSpacing: 3, textTransform: 'uppercase',
  },
  findBtnIcon: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  findBtnIconOff: { backgroundColor: C.grayLight },
});