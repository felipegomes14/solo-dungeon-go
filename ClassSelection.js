import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ClassSelection = ({ onSelect }) => {
  const classes = [
    {
      name: "Guerreiro",
      description: "Especialista em combate corpo a corpo",
      bonusAtk: 15,
      bonusDef: 10,
      bonusHp: 30,
      color: "#e74c3c",
      emoji: "⚔️"
    },
    {
      name: "Mago",
      description: "Mestre das artes arcanas",
      bonusAtk: 20,
      bonusDef: 5,
      bonusHp: 15,
      bonusMana: 30,
      color: "#9b59b6",
      emoji: "🔮"
    },
    {
      name: "Arqueiro",
      description: "Precisão mortal à distância",
      bonusAtk: 18,
      bonusDef: 8,
      bonusHp: 20,
      color: "#27ae60",
      emoji: "🏹"
    },
    {
      name: "Ladino",
      description: "Mestre da furtividade e precisão",
      bonusAtk: 16,
      bonusDef: 6,
      bonusHp: 18,
      color: "#34495e",
      emoji: "🗡️"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Selecione sua Classe</Text>
      <Text style={styles.subtitle}>Escolha sabiamente, sua jornada depende disso!</Text>
      
      <View style={styles.classesContainer}>
        {classes.map((cls, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.classCard, { backgroundColor: cls.color }]}
            onPress={() => onSelect(cls)}
          >
            <Text style={styles.classEmoji}>{cls.emoji}</Text>
            <Text style={styles.className}>{cls.name}</Text>
            <Text style={styles.classDescription}>{cls.description}</Text>
            <View style={styles.bonuses}>
              <Text style={styles.bonusText}>⚔️ ATK: +{cls.bonusAtk}</Text>
              <Text style={styles.bonusText}>🛡️ DEF: +{cls.bonusDef}</Text>
              <Text style={styles.bonusText}>❤️ HP: +{cls.bonusHp}</Text>
              {cls.bonusMana && <Text style={styles.bonusText}>🔵 MP: +{cls.bonusMana}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  classesContainer: {
    flex: 1,
    gap: 20,
  },
  classCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  classEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  className: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  classDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
  },
  bonuses: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 8,
  },
  bonusText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 3,
  }
});

export default ClassSelection;