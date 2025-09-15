import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PuzzleGame = ({ dungeon, onClose, onComplete }) => {
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [targetNumber] = useState(24);

  const numbers = [2, 3, 4, 6, 8, 12];

  const handleNumberSelect = (number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 3) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const checkSolution = () => {
    if (selectedNumbers.length !== 3) {
      Alert.alert('Selecione 3 números!');
      return;
    }

    const product = selectedNumbers.reduce((a, b) => a * b, 1);
    if (product === targetNumber) {
      setPuzzleSolved(true);
      Alert.alert('🎉 Puzzle resolvido!', 'Você ganhou recompensas!');
      
      const recompensa = {
        xp: dungeon.difficulty * 20,
        gold: dungeon.difficulty * 15,
        itens: [{ type: 'potion', name: 'Poção de Cura', effect: 'heal', value: 30 }]
      };
      
      setTimeout(() => onComplete(recompensa), 1500);
    } else {
      Alert.alert('❌ Incorreto', `Produto: ${product}. Tente novamente!`);
      setSelectedNumbers([]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Quebra-Cabeça da Dungeon {dungeon.rank}</Text>
      <Text style={styles.instruction}>Selecione 3 números que multiplicados resultem em {targetNumber}</Text>

      <View style={styles.numbersContainer}>
        {numbers.map((number) => (
          <TouchableOpacity
            key={number}
            style={[
              styles.numberButton,
              selectedNumbers.includes(number) && styles.selectedNumber
            ]}
            onPress={() => handleNumberSelect(number)}
          >
            <Text style={styles.numberText}>{number}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.selectedText}>
        Selecionados: {selectedNumbers.join(' × ')}
      </Text>

      <TouchableOpacity 
        style={styles.checkButton}
        onPress={checkSolution}
        disabled={puzzleSolved}
      >
        <Text style={styles.checkButtonText}>
          {puzzleSolved ? '✅ Resolvido' : '✅ Verificar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>Fugir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50'
  },
  instruction: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#34495e'
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20
  },
  numberButton: {
    width: 60,
    height: 60,
    backgroundColor: '#3498db',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderWidth: 3,
    borderColor: '#2980b9'
  },
  selectedNumber: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b'
  },
  numberText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  selectedText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  checkButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  checkButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
  }
});

export default PuzzleGame;