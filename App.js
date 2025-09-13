import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
const dungeonsFixas = [
  {
    id: 1,
    latitude: -23.55052, // São Paulo
    longitude: -46.633308,
    title: "Dungeon São Paulo",
    description: "Portal misterioso em São Paulo",
    color: "red",
  },
  {
    id: 2,
    latitude: 40.712776, // Nova York
    longitude: -74.005974,
    title: "Dungeon Nova York",
    description: "Portal misterioso em Nova York",
    color: "purple",
  },
  {
    id: 3,
    latitude: 48.856613, // Paris
    longitude: 2.352222,
    title: "Dungeon Paris",
    description: "Portal misterioso em Paris",
    color: "green",
  },
  // Adicione mais dungeons fixas aqui
];
