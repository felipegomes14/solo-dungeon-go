import React from "react";
import { Marker } from "react-native-maps";
import { View, Text } from "react-native";
import { styles } from "./AppStyles";

const DungeonMarkers = ({ dungeons, onPress }) => {
  return dungeons.map((d) => (
    <Marker
      key={d.id}
      coordinate={{ latitude: d.latitude, longitude: d.longitude }}
      title={d.title}
      description={d.description}
      onPress={() => onPress(d)}
    >
      <View style={[
        styles.markerContainer,
        { backgroundColor: d.completed ? 'green' : d.color },
        d.completed && styles.completedMarker
      ]}>
        <Text style={styles.markerText}>
          {d.completed ? '✓' : d.rank}
        </Text>
      </View>
    </Marker>
  ));
};

export default DungeonMarkers;