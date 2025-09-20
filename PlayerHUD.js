import React from "react";
import { View, Text } from "react-native";
import { styles } from "./AppStyles";

const PlayerHUD = ({ player, level, xp, dungeons }) => {
  return (
    <View style={styles.playerInfo}>
      <Text style={styles.infoText}>Lv.{level}</Text>
      <Text style={styles.infoText}>XP: {xp}/{level * 100}</Text>
      <Text style={styles.infoText}>HP: {player.hp}/{player.maxHp}</Text>
      <Text style={styles.infoText}>MP: {player.mana}/{player.maxMana}</Text>
      <Text style={styles.infoText}>ATQ: {player.atk}</Text>
      <Text style={styles.infoText}>DEF: {player.def}</Text>
      <Text style={styles.infoText}>💰: {player.gold}</Text>
      <Text style={styles.infoText}>Dungeons: {dungeons.length}</Text>
    </View>
  );
};

export default PlayerHUD;