import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "./AppStyles";

const ControlsOverlay = ({
  onShowShop,
  onShowEquipament,
  onShowInventory,
  onRefreshDungeons,
  onShowQuest
}) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity style={styles.controlButton} onPress={onShowShop}>
        <Text style={styles.buttonText}>🛒</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlButton} onPress={onShowEquipament}>
        <Text style={styles.buttonText}>⚔️</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlButton} onPress={onShowInventory}>
        <Text style={styles.buttonText}>🎒</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlButton} onPress={onRefreshDungeons}>
        <Text style={styles.buttonText}>🔄</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.controlButton} onPress={onShowQuest}>
        <Text style={styles.buttonText}>📋</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ControlsOverlay;