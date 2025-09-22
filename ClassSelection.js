import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const ClassSelection = ({ onSelect }) => {
  const classSkills = {
    Guerreiro: [
      { name: "Corte Poderoso", level: 1, description: "Causa 150% de dano" },
      { name: "Fúria do Guerreiro", level: 15, description: "Dobra o ataque por 2 turnos" },
      { name: "Espada Divina", level: 30, description: "Causa 300% de dano" }
    ],
    Mago: [
      { name: "Bola de Fogo", level: 1, description: "Causa 180% de dano" },
      { name: "Escudo Arcano", level: 15, description: "Dobra a defesa por 2 turnos" },
      { name: "Meteoro", level: 30, description: "Causa 350% de dano" }
    ],
    Arqueiro: [
      { name: "Tiro Preciso", level: 1, description: "Causa 160% de dano" },
      { name: "Chuva de Flechas", level: 15, description: "Causa 220% de dano" },
      { name: "Tiro Perfurante", level: 30, description: "Ignora 50% da defesa" }
    ],
    Ladino: [
      { name: "Ataque Furtivo", level: 1, description: "Causa 200% de dano" },
      { name: "Veneno", level: 15, description: "Envenena por 3 turnos" },
      { name: "Evasão", level: 30, description: "80% de chance de esquiva" }
    ],
    Paladino: [
      { name: "Golpe Sagrado", level: 1, description: "Causa 170% de dano" },
      { name: "Cura Divina", level: 15, description: "Cura 40% do HP" },
      { name: "Proteção Celestial", level: 30, description: "Aumenta defesa em 250%" }
    ],
    Bárbaro: [
      { name: "Investida Feroz", level: 1, description: "Causa 140% de dano" },
      { name: "Fúria Berserker", level: 15, description: "Aumenta ataque em 250%" },
      { name: "Grito de Guerra", level: 30, description: "Dano em área" }
    ],
    Druida: [
      { name: "Garras da Fera", level: 1, description: "Causa 150% de dano" },
      { name: "Cura da Natureza", level: 15, description: "Cura 30% do HP" },
      { name: "Chamado dos Antigos", level: 30, description: "Invoca aliado" }
    ],
    Necromante: [
      { name: "Dreno de Vida", level: 1, description: "Rouba vida do inimigo" },
      { name: "Invocar Esqueleto", level: 15, description: "Invoca esqueleto aliado" },
      { name: "Explosão de Almas", level: 30, description: "Dano em área massivo" }
    ],
    Monge: [
      { name: "Punho de Aço", level: 1, description: "Causa 130% de dano" },
      { name: "Meditação", level: 15, description: "Regenera 20% de mana" },
      { name: "Punhos Furiosos", level: 30, description: "Ataca 3 vezes" }
    ],
    Bardo: [
      { name: "Canção de Batalha", level: 1, description: "Aumenta ataque do grupo" },
      { name: "Melodia Curativa", level: 15, description: "Cura o grupo" },
      { name: "Solo Épico", level: 30, description: "Aumenta todos os stats" }
    ],
    Caçador: [
      { name: "Tiro Certeiro", level: 1, description: "Causa 150% de dano" },
      { name: "Armadilha", level: 15, description: "Causa 180% de dano" },
      { name: "Chamado do Animal", level: 30, description: "Invoca animal" }
    ],
    Alquimista: [
      { name: "Poção Explosiva", level: 1, description: "Causa 160% de dano" },
      { name: "Poção de Força", level: 15, description: "Aumenta ataque em 80%" },
      { name: "Elixir Múltiplo", level: 30, description: "Múltiplos efeitos" }
    ]
  };

  const classes = [
    {
      name: "Guerreiro",
      description: "Mestre do combate corpo a corpo e defesa",
      bonusAtk: 15,
      bonusDef: 12,
      bonusHp: 35,
      bonusMana: 0,
      color: "#e74c3c",
      emoji: "⚔️",
      special: "Ataque Poderoso: +25% de dano crítico"
    },
    {
      name: "Mago",
      description: "Especialista em artes arcanas e magia elemental",
      bonusAtk: 22,
      bonusDef: 4,
      bonusHp: 15,
      bonusMana: 40,
      color: "#9b59b6",
      emoji: "🔮",
      special: "Bola de Fogo: Dano em área aumentado"
    },
    {
      name: "Arqueiro",
      description: "Precisão mortal à distância com arco e flecha",
      bonusAtk: 18,
      bonusDef: 8,
      bonusHp: 22,
      bonusMana: 15,
      color: "#27ae60",
      emoji: "🏹",
      special: "Tiro Certeiro: +30% de precisão"
    },
    {
      name: "Ladino",
      description: "Mestre da furtividade, venenos e ataques surpresa",
      bonusAtk: 17,
      bonusDef: 7,
      bonusHp: 20,
      bonusMana: 10,
      color: "#34495e",
      emoji: "🗡️",
      special: "Ataque Furtivo: Dano triplo ao surpreender"
    },
    {
      name: "Paladino",
      description: "Cavaleiro sagrado com bênçãos divinas",
      bonusAtk: 14,
      bonusDef: 16,
      bonusHp: 30,
      bonusMana: 25,
      color: "#f39c12",
      emoji: "🛡️",
      special: "Cura Divina: Regenera 10% de HP por turno"
    },
    {
      name: "Bárbaro",
      description: "Guerreiro tribal com fúria incontrolável",
      bonusAtk: 20,
      bonusDef: 8,
      bonusHp: 40,
      bonusMana: 5,
      color: "#d35400",
      emoji: "🪓",
      special: "Fúria Berserker: +40% de dano quando com pouca vida"
    },
    {
      name: "Druida",
      description: "Guardião da natureza com habilidades de transformação",
      bonusAtk: 12,
      bonusDef: 10,
      bonusHp: 25,
      bonusMana: 35,
      color: "#16a085",
      emoji: "🌿",
      special: "Forma Animal: Transforma-se em lobo ou urso"
    },
    {
      name: "Necromante",
      description: "Controlador das trevas e mestre dos mortos-vivos",
      bonusAtk: 19,
      bonusDef: 6,
      bonusHp: 18,
      bonusMana: 38,
      color: "#2c3e50",
      emoji: "💀",
      special: "Invocar Esqueletos: Aliados mortos-vivos em batalha"
    },
    {
      name: "Monge",
      description: "Mestre das artes marciais e disciplina espiritual",
      bonusAtk: 16,
      bonusDef: 14,
      bonusHp: 28,
      bonusMana: 20,
      color: "#e67e22",
      emoji: "🥋",
      special: "Golpes Rápidos: Ataque duas vezes por turno"
    },
    {
      name: "Bardo",
      description: "Encantador com habilidades musicais mágicas",
      bonusAtk: 13,
      bonusDef: 9,
      bonusHp: 22,
      bonusMana: 30,
      color: "#e84393",
      emoji: "🎵",
      special: "Canção de Batalha: Aumenta stats do grupo em 15%"
    },
    {
      name: "Caçador",
      description: "Rastreador especialista em armadilhas e animais",
      bonusAtk: 16,
      bonusDef: 11,
      bonusHp: 26,
      bonusMana: 12,
      color: "#8e44ad",
      emoji: "🎯",
      special: "Companheiro Animal: Um lobo ou falcão auxilia em batalha"
    },
    {
      name: "Alquimista",
      description: "Criador de poções e especialista em elementos",
      bonusAtk: 14,
      bonusDef: 8,
      bonusHp: 20,
      bonusMana: 32,
      color: "#00cec9",
      emoji: "🧪",
      special: "Poções Personalizadas: Efeitos únicos em batalha"
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Selecione sua Classe</Text>
      <Text style={styles.subtitle}>Escolha sabiamente, sua jornada depende disso!</Text>
      
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
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
                {cls.bonusMana > 0 && <Text style={styles.bonusText}>🔵 MP: +{cls.bonusMana}</Text>}
              </View>
              
              <View style={styles.specialContainer}>
                <Text style={styles.specialText}>✨ {cls.special}</Text>
              </View>

              <View style={styles.skillsContainer}>
                <Text style={styles.skillsTitle}>🎯 Habilidades:</Text>
                {classSkills[cls.name]?.map((skill, idx) => (
                  <Text key={idx} style={styles.skillInfo}>
                    • {skill.name} (Nv. {skill.level})
                  </Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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
    marginBottom: 20,
  },
  classesContainer: {
    gap: 15,
  },
  classCard: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    minHeight: 220,
  },
  classEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  className: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textAlign: 'center',
  },
  classDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  bonuses: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  bonusText: {
    color: 'white',
    fontSize: 11,
    marginBottom: 2,
  },
  specialContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: 'gold',
    marginBottom: 8,
  },
  specialText: {
    color: '#fffacd',
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  skillsContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 6,
  },
  skillsTitle: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  skillInfo: {
    color: 'white',
    fontSize: 9,
    marginBottom: 2,
    textAlign: 'center',
  }
});

export default ClassSelection;