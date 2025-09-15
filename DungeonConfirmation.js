import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const DungeonConfirmation = ({ dungeon, onConfirm, onCancel }) => {
  const getTypeDescription = (type) => {
    switch(type) {
      case 'combat': return 'Combate contra monstros';
      case 'puzzle': return 'Desafio de quebra-cabeça';
      case 'quiz': return 'Teste de conhecimento';
      default: return 'Desafio misterioso';
    }
  };

  const getDifficultyText = (difficulty) => {
    if (difficulty <= 2) return 'Fácil';
    if (difficulty <= 4) return 'Médio';
    if (difficulty <= 6) return 'Difícil';
    return 'Extremo';
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>🏰 Entrar na Dungeon?</Text>
        
        <View style={styles.dungeonInfo}>
          <Text style={styles.dungeonName}>Rank: {dungeon.rank}</Text>
          <Text style={styles.dungeonType}>{getTypeDescription(dungeon.type)}</Text>
          <Text style={styles.difficulty}>Dificuldade: {getDifficultyText(dungeon.difficulty)}</Text>
        </View>

        <View style={styles.rewardsSection}>
          <Text style={styles.rewardsTitle}>🎁 Recompensas:</Text>
          <Text style={styles.rewardItem}>XP: +{dungeon.rewards.xp}</Text>
          <Text style={styles.rewardItem}>Ouro: +{dungeon.rewards.gold}</Text>
          <Text style={styles.rewardItem}>Itens: {dungeon.rewards.itens.length}x</Text>
          {dungeon.rewards.itens.map((item, index) => (
            <Text key={index} style={styles.itemDetail}>   - {item.name}</Text>
          ))}
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠️ Você perderá a dungeon se fugir ou morrer!
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.buttonText}>✅ Sim, Entrar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.buttonText}>❌ Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  container: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    maxWidth: 400
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50'
  },
  dungeonInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 10
  },
  dungeonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5
  },
  dungeonType: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5
  },
  difficulty: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: 'bold'
  },
  rewardsSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff8e1',
    borderRadius: 10
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d35400',
    marginBottom: 10
  },
  rewardItem: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 3
  },
  itemDetail: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  warning: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 8
  },
  warningText: {
    fontSize: 12,
    color: '#c62828',
    textAlign: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 8,
    marginRight: 10
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default DungeonConfirmation;