import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "./AppStyles";

const PlayerHUD = ({ player, level, xp, dungeons }) => {
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const mpPercentage = (player.mana / player.maxMana) * 100;
  const xpPercentage = (xp / (level * 100)) * 100;

  return (
    <View style={styles.playerHUD}>
      {/* Header com Level e Ouro */}
      <View style={styles.hudHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
        <View style={styles.goldContainer}>
          <Text style={styles.goldIcon}>💰</Text>
          <Text style={styles.goldText}>{player.gold}</Text>
        </View>
      </View>

      {/* Barra de HP */}
      <View style={styles.statRow}>
        <Text style={styles.statIcon}>❤️</Text>
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${hpPercentage}%`,
                  backgroundColor: hpPercentage > 30 ? '#FF6B6B' : '#FF4757'
                }
              ]} 
            />
          </View>
          <Text style={styles.barText}>
            {player.hp}/{player.maxHp}
          </Text>
        </View>
      </View>

      {/* Barra de MP */}
      <View style={styles.statRow}>
        <Text style={styles.statIcon}>🔵</Text>
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${mpPercentage}%`,
                  backgroundColor: '#4ECDC4'
                }
              ]} 
            />
          </View>
          <Text style={styles.barText}>
            {player.mana}/{player.maxMana}
          </Text>
        </View>
      </View>

      {/* Barra de XP */}
      <View style={styles.statRow}>
        <Text style={styles.statIcon}>⭐</Text>
        <View style={styles.barContainer}>
          <View style={styles.barBackground}>
            <View 
              style={[
                styles.barFill, 
                { 
                  width: `${xpPercentage}%`,
                  backgroundColor: '#FFD93D'
                }
              ]} 
            />
          </View>
          <Text style={styles.barText}>
            {xp}/{level * 100} XP
          </Text>
        </View>
      </View>

      {/* Stats de Ataque e Defesa */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⚔️</Text>
          <Text style={styles.statValue}>{player.atk}</Text>
          <Text style={styles.statLabel}>ATQ</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🛡️</Text>
          <Text style={styles.statValue}>{player.def}</Text>
          <Text style={styles.statLabel}>DEF</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏰</Text>
          <Text style={styles.statValue}>{dungeons.length}</Text>
          <Text style={styles.statLabel}>DUN</Text>
        </View>
      </View>
    </View>
  );
};

export default PlayerHUD;