import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const classes = [
  {
    name: "Guerreiro",
    description: "Especialista em combate corpo a corpo",
    bonusForca: 5,
    bonusVelocidade: 0,
    bonusPrecisao: 1,
    bonusSorte: 0,
    bonusHp: 30,
    bonusMp: 10,
    icon: "⚔️"
  },
  {
    name: "Mago",
    description: "Mestre das artes arcanas",
    bonusForca: 0,
    bonusVelocidade: 1,
    bonusPrecisao: 2,
    bonusSorte: 3,
    bonusHp: 10,
    bonusMp: 40,
    icon: "🔮"
  },
  {
    name: "Arqueiro",
    description: "Atirador preciso à distância",
    bonusForca: 1,
    bonusVelocidade: 3,
    bonusPrecisao: 5,
    bonusSorte: 1,
    bonusHp: 20,
    bonusMp: 15,
    icon: "🏹"
  },
  {
    name: "Ladino",
    description: "Especialista em furtividade e agilidade",
    bonusForca: 1,
    bonusVelocidade: 5,
    bonusPrecisao: 3,
    bonusSorte: 2,
    bonusHp: 15,
    bonusMp: 20,
    icon: "🗡️"
  },
  {
    name: "Paladino",
    description: "Guerreiro sagrado com poderes de cura",
    bonusForca: 3,
    bonusVelocidade: 1,
    bonusPrecisao: 2,
    bonusSorte: 1,
    bonusHp: 25,
    bonusMp: 20,
    icon: "✝️"
  },
  {
    name: "Bárbaro",
    description: "Berserker com fúria incontrolável",
    bonusForca: 6,
    bonusVelocidade: 2,
    bonusPrecisao: 0,
    bonusSorte: 0,
    bonusHp: 35,
    bonusMp: 5,
    icon: "🪓"
  },
  {
    name: "Druida",
    description: "Guardião da natureza com poderes animais",
    bonusForca: 1,
    bonusVelocidade: 2,
    bonusPrecisao: 2,
    bonusSorte: 2,
    bonusHp: 20,
    bonusMp: 25,
    icon: "🌿"
  },
  {
    name: "Necromante",
    description: "Mestre da morte e invocação",
    bonusForca: 0,
    bonusVelocidade: 1,
    bonusPrecisao: 3,
    bonusSorte: 4,
    bonusHp: 15,
    bonusMp: 35,
    icon: "💀"
  },
  {
    name: "Monge",
    description: "Mestre das artes marciais e meditação",
    bonusForca: 2,
    bonusVelocidade: 4,
    bonusPrecisao: 3,
    bonusSorte: 1,
    bonusHp: 20,
    bonusMp: 20,
    icon: "🧘"
  },
  {
    name: "Bardo",
    description: "Artista com poderes de inspiração",
    bonusForca: 0,
    bonusVelocidade: 2,
    bonusPrecisao: 2,
    bonusSorte: 4,
    bonusHp: 15,
    bonusMp: 25,
    icon: "🎵"
  },
  {
    name: "Caçador",
    description: "Rastreador e mestre de armadilhas",
    bonusForca: 2,
    bonusVelocidade: 3,
    bonusPrecisao: 4,
    bonusSorte: 2,
    bonusHp: 20,
    bonusMp: 15,
    icon: "🎯"
  },
  {
    name: "Alquimista",
    description: "Mestre de poções e transformações",
    bonusForca: 0,
    bonusVelocidade: 1,
    bonusPrecisao: 3,
    bonusSorte: 5,
    bonusHp: 15,
    bonusMp: 30,
    icon: "🧪"
  }
];

const ClassSelection = ({ onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha sua Classe</Text>
      <Text style={styles.subtitle}>Selecione uma classe para começar sua aventura</Text>
      
      <ScrollView style={styles.classesContainer}>
        {classes.map((cls, index) => (
          <TouchableOpacity
            key={index}
            style={styles.classCard}
            onPress={() => onSelect(cls)}
          >
            <Text style={styles.classIcon}>{cls.icon}</Text>
            <View style={styles.classInfo}>
              <Text style={styles.className}>{cls.name}</Text>
              <Text style={styles.classDescription}>{cls.description}</Text>
              <View style={styles.bonuses}>
                <Text style={styles.bonusText}>💪 +{cls.bonusForca} Força</Text>
                <Text style={styles.bonusText}>⚡ +{cls.bonusVelocidade} Velocidade</Text>
                <Text style={styles.bonusText}>🎯 +{cls.bonusPrecisao} Precisão</Text>
                <Text style={styles.bonusText}>🍀 +{cls.bonusSorte} Sorte</Text>
                <Text style={styles.bonusText}>❤️ +{cls.bonusHp} HP</Text>
                <Text style={styles.bonusText}>🔵 +{cls.bonusMp} MP</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#FFD700'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#cccccc'
  },
  classesContainer: {
    flex: 1
  },
  classCard: {
    backgroundColor: '#2d2d4d',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B0082'
  },
  classIcon: {
    fontSize: 40,
    marginRight: 15
  },
  classInfo: {
    flex: 1
  },
  className: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5
  },
  classDescription: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 10
  },
  bonuses: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  bonusText: {
    fontSize: 12,
    color: '#00BFFF',
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  }
});

export default ClassSelection;