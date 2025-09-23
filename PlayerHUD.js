import React from "react";
import { View, Text } from "react-native";
import { styles } from "./AppStyles";

const PlayerHUD = ({ player, level, xp, dungeons }) => {
  // Usar os valores do player se as props separadas não forem fornecidas
  const currentLevel = level || player?.level || 1;
  const currentXp = xp !== undefined ? xp : (player?.xp || 0);
  const currentDungeons = dungeons || [];
  
  // Garantir valores padrão para evitar erros
  const safePlayer = {
    hp: player?.hp || 100,
    maxHp: player?.maxHp || 100,
    mana: player?.mana || 50,
    maxMana: player?.maxMana || 50,
    atk: player?.atk || 10,
    def: player?.def || 5,
    gold: player?.gold || 0,
    ...player
  };
  
  const hpPercentage = (safePlayer.hp / safePlayer.maxHp) * 100;
  const mpPercentage = (safePlayer.mana / safePlayer.maxMana) * 100;
  const xpPercentage = (currentXp / (currentLevel * 100)) * 100;

  return (
    <View style={styles.playerHUD}>
      {/* Header com Level e Ouro */}
      <View style={styles.hudHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{currentLevel}</Text>
        </View>
        <View style={styles.goldContainer}>
          <Text style={styles.goldIcon}>💰</Text>
          <Text style={styles.goldText}>{safePlayer.gold}</Text>
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
            {safePlayer.hp}/{safePlayer.maxHp}
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
            {safePlayer.mana}/{safePlayer.maxMana}
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
            {currentXp}/{currentLevel * 100} XP
          </Text>
        </View>
      </View>

      {/* Stats de Ataque e Defesa */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>⚔️</Text>
          <Text style={styles.statValue}>{safePlayer.atk}</Text>
          <Text style={styles.statLabel}>ATQ</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🛡️</Text>
          <Text style={styles.statValue}>{safePlayer.def}</Text>
          <Text style={styles.statLabel}>DEF</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🏰</Text>
          <Text style={styles.statValue}>{currentDungeons.length}</Text>
          <Text style={styles.statLabel}>DUN</Text>
        </View>
      </View>
    </View>
  );
};

export default PlayerHUD;