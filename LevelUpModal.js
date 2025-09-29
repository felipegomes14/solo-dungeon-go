import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const LevelUpModal = ({ visible, player, onDistributePoint, onClose }) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🎉 Level Up!</Text>
          <Text style={styles.subtitle}>Distribua seu ponto de status:</Text>
          <Text style={styles.pointsText}>Pontos disponíveis: {player.availablePoints}</Text>
          
          <View style={styles.statsContainer}>
            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('hp')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>❤️ HP +10</Text>
              <Text style={styles.statValue}>{player.maxHp}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('mp')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>🔵 MP +5</Text>
              <Text style={styles.statValue}>{player.maxMp}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('forca')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>💪 Força +1</Text>
              <Text style={styles.statValue}>{player.forca}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('velocidade')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>⚡ Velocidade +1</Text>
              <Text style={styles.statValue}>{player.velocidade}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('precisao')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>🎯 Precisão +1</Text>
              <Text style={styles.statValue}>{player.precisao}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.statButton}
              onPress={() => onDistributePoint('sorte')}
              disabled={player.availablePoints <= 0}
            >
              <Text style={styles.statText}>🍀 Sorte +1</Text>
              <Text style={styles.statValue}>{player.sorte}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  pointsText: {
    color: '#00BFFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#7f8c8d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LevelUpModal;