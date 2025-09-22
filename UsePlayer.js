import React, { useState, useEffect } from "react";
import { Alert } from "react-native";

const usePlayer = () => {
  // Sistema de habilidades por classe e nível
  const classSkills = {
    Guerreiro: [
      {
        id: 1,
        name: "Corte Poderoso",
        levelRequired: 1,
        manaCost: 15,
        effect: "attack",
        value: 1.5,
        description: "Corte que causa 150% de dano",
        icon: "⚔️"
      },
      {
        id: 2,
        name: "Fúria do Guerreiro",
        levelRequired: 15,
        manaCost: 30,
        effect: "buff",
        value: 2.0,
        description: "Dobra o ataque por 2 turnos",
        icon: "🔥"
      },
      {
        id: 3,
        name: "Espada Divina",
        levelRequired: 30,
        manaCost: 50,
        effect: "attack",
        value: 3.0,
        description: "Ataque sagrado que causa 300% de dano",
        icon: "✨"
      }
    ],
    Mago: [
      {
        id: 1,
        name: "Bola de Fogo",
        levelRequired: 1,
        manaCost: 20,
        effect: "attack",
        value: 1.8,
        description: "Bola de fogo que causa 180% de dano",
        icon: "🔥"
      },
      {
        id: 2,
        name: "Escudo Arcano",
        levelRequired: 15,
        manaCost: 25,
        effect: "defense",
        value: 2.0,
        description: "Dobra a defesa por 2 turnos",
        icon: "🛡️"
      },
      {
        id: 3,
        name: "Meteoro",
        levelRequired: 30,
        manaCost: 60,
        effect: "attack",
        value: 3.5,
        description: "Invoca um meteoro que causa 350% de dano",
        icon: "☄️"
      }
    ],
    Arqueiro: [
      {
        id: 1,
        name: "Tiro Preciso",
        levelRequired: 1,
        manaCost: 12,
        effect: "attack",
        value: 1.6,
        description: "Tiro certeiro que causa 160% de dano",
        icon: "🎯"
      },
      {
        id: 2,
        name: "Chuva de Flechas",
        levelRequired: 15,
        manaCost: 35,
        effect: "attack",
        value: 2.2,
        description: "Múltiplos tiros que causam 220% de dano",
        icon: "🏹"
      },
      {
        id: 3,
        name: "Tiro Perfurante",
        levelRequired: 30,
        manaCost: 40,
        effect: "attack",
        value: 2.8,
        description: "Tiro que ignora 50% da defesa",
        icon: "💘"
      }
    ],
    Ladino: [
      {
        id: 1,
        name: "Ataque Furtivo",
        levelRequired: 1,
        manaCost: 18,
        effect: "attack",
        value: 2.0,
        description: "Ataque surpresa que causa 200% de dano",
        icon: "🗡️"
      },
      {
        id: 2,
        name: "Veneno",
        levelRequired: 15,
        manaCost: 25,
        effect: "dot",
        value: 0.3,
        description: "Envenena o inimigo por 3 turnos",
        icon: "☠️"
      },
      {
        id: 3,
        name: "Evasão",
        levelRequired: 30,
        manaCost: 35,
        effect: "dodge",
        value: 0.8,
        description: "80% de chance de esquiva por 2 turnos",
        icon: "🌀"
      }
    ],
    Paladino: [
      {
        id: 1,
        name: "Golpe Sagrado",
        levelRequired: 1,
        manaCost: 20,
        effect: "attack",
        value: 1.7,
        description: "Golpe abençoado que causa 170% de dano",
        icon: "✝️"
      },
      {
        id: 2,
        name: "Cura Divina",
        levelRequired: 15,
        manaCost: 30,
        effect: "heal",
        value: 0.4,
        description: "Cura 40% do HP máximo",
        icon: "💖"
      },
      {
        id: 3,
        name: "Proteção Celestial",
        levelRequired: 30,
        manaCost: 45,
        effect: "defense",
        value: 2.5,
        description: "Aumenta defesa em 250% por 2 turnos",
        icon: "🌟"
      }
    ],
    Bárbaro: [
      {
        id: 1,
        name: "Investida Feroz",
        levelRequired: 1,
        manaCost: 10,
        effect: "attack",
        value: 1.4,
        description: "Investida que causa 140% de dano",
        icon: "🪓"
      },
      {
        id: 2,
        name: "Fúria Berserker",
        levelRequired: 15,
        manaCost: 40,
        effect: "buff",
        value: 2.5,
        description: "Aumenta ataque em 250% mas reduz defesa",
        icon: "💢"
      },
      {
        id: 3,
        name: "Grito de Guerra",
        levelRequired: 30,
        manaCost: 30,
        effect: "aoe",
        value: 1.2,
        description: "Dano em área que afeta todos os inimigos",
        icon: "📢"
      }
    ],
    Druida: [
      {
        id: 1,
        name: "Garras da Fera",
        levelRequired: 1,
        manaCost: 15,
        effect: "attack",
        value: 1.5,
        description: "Ataque animal que causa 150% de dano",
        icon: "🐾"
      },
      {
        id: 2,
        name: "Cura da Natureza",
        levelRequired: 15,
        manaCost: 25,
        effect: "heal",
        value: 0.3,
        description: "Cura 30% do HP máximo",
        icon: "🌿"
      },
      {
        id: 3,
        name: "Chamado dos Antigos",
        levelRequired: 30,
        manaCost: 50,
        effect: "summon",
        value: 1.0,
        description: "Invoca um aliado da natureza",
        icon: "🌳"
      }
    ],
    Necromante: [
      {
        id: 1,
        name: "Dreno de Vida",
        levelRequired: 1,
        manaCost: 15,
        effect: "lifesteal",
        value: 1.2,
        description: "Causa dano e cura 50% do valor",
        icon: "💀"
      },
      {
        id: 2,
        name: "Invocar Esqueleto",
        levelRequired: 15,
        manaCost: 35,
        effect: "summon",
        value: 1.0,
        description: "Invoca um esqueleto aliado",
        icon: "🦴"
      },
      {
        id: 3,
        name: "Explosão de Almas",
        levelRequired: 30,
        manaCost: 60,
        effect: "aoe",
        value: 2.0,
        description: "Dano em área massivo",
        icon: "👻"
      }
    ],
    Monge: [
      {
        id: 1,
        name: "Punho de Aço",
        levelRequired: 1,
        manaCost: 12,
        effect: "attack",
        value: 1.3,
        description: "Golpe rápido que causa 130% de dano",
        icon: "👊"
      },
      {
        id: 2,
        name: "Meditação",
        levelRequired: 15,
        manaCost: 0,
        effect: "regen",
        value: 0.2,
        description: "Regenera 20% de mana",
        icon: "🧘"
      },
      {
        id: 3,
        name: "Punhos Furiosos",
        levelRequired: 30,
        manaCost: 40,
        effect: "multihit",
        value: 0.8,
        description: "Ataca 3 vezes com 80% de dano cada",
        icon: "🥊"
      }
    ],
    Bardo: [
      {
        id: 1,
        name: "Canção de Batalha",
        levelRequired: 1,
        manaCost: 20,
        effect: "buff",
        value: 1.2,
        description: "Aumenta ataque do grupo em 20%",
        icon: "🎵"
      },
      {
        id: 2,
        name: "Melodia Curativa",
        levelRequired: 15,
        manaCost: 25,
        effect: "heal",
        value: 0.25,
        description: "Cura 25% do HP do grupo",
        icon: "🎶"
      },
      {
        id: 3,
        name: "Solo Épico",
        levelRequired: 30,
        manaCost: 45,
        effect: "buff",
        value: 1.5,
        description: "Aumenta todos os stats em 50%",
        icon: "🎻"
      }
    ],
    Caçador: [
      {
        id: 1,
        name: "Tiro Certeiro",
        levelRequired: 1,
        manaCost: 14,
        effect: "attack",
        value: 1.5,
        description: "Tiro preciso que causa 150% de dano",
        icon: "🎯"
      },
      {
        id: 2,
        name: "Armadilha",
        levelRequired: 15,
        manaCost: 30,
        effect: "trap",
        value: 1.8,
        description: "Armadilha que causa 180% de dano",
        icon: "🪤"
      },
      {
        id: 3,
        name: "Chamado do Animal",
        levelRequired: 30,
        manaCost: 40,
        effect: "summon",
        value: 1.2,
        description: "Invoca um animal companheiro",
        icon: "🐺"
      }
    ],
    Alquimista: [
      {
        id: 1,
        name: "Poção Explosiva",
        levelRequired: 1,
        manaCost: 18,
        effect: "attack",
        value: 1.6,
        description: "Arremessa poção que causa 160% de dano",
        icon: "🧪"
      },
      {
        id: 2,
        name: "Poção de Força",
        levelRequired: 15,
        manaCost: 25,
        effect: "buff",
        value: 1.8,
        description: "Aumenta ataque em 80%",
        icon: "💪"
      },
      {
        id: 3,
        name: "Elixir Múltiplo",
        levelRequired: 30,
        manaCost: 50,
        effect: "multi",
        value: 1.0,
        description: "Aplica vários efeitos aleatórios",
        icon: "🌈"
      }
    ]
  };

  const [player, setPlayer] = useState({
    hp: 100,
    maxHp: 100,
    atk: 10,
    def: 5,
    level: 1,
    xp: 0,
    gold: 1000,
    mana: 50,
    maxMana: 50,
    inventory: [
      {
        id: 1,
        type: "poção",
        name: "Poção de Cura",
        effect: "cura",
        value: 30
      },
      {
        id: 2,
        type: "poção",
        name: "Poção de Mana",
        effect: "mana",
        value: 20
      }
    ],
    equipament: {},
    skills: [],
    playerClass: null
  });

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerClass, setPlayerClassState] = useState(null);
  const [showClassSelection, setShowClassSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);

  // Regeneração de HP e MP apenas fora do combate
  useEffect(() => {
    let regenInterval;
    
    if (!isInCombat) {
      regenInterval = setInterval(() => {
        setPlayer(prev => {
          const shouldRegenHp = prev.hp < prev.maxHp;
          const shouldRegenMana = prev.mana < prev.maxMana;
          
          if (shouldRegenHp || shouldRegenMana) {
            return {
              ...prev,
              hp: shouldRegenHp ? Math.min(prev.maxHp, prev.hp + 5) : prev.hp,
              mana: shouldRegenMana ? Math.min(prev.maxMana, prev.mana + 3) : prev.mana
            };
          }
          return prev;
        });
      }, 1000);
    }

    return () => {
      if (regenInterval) {
        clearInterval(regenInterval);
      }
    };
  }, [isInCombat]);

  const entrarEmCombate = () => {
    setIsInCombat(true);
  };

  const sairDoCombate = () => {
    setIsInCombat(false);
  };

  const ganharXp = (quantidade) => {
    let novoXp = xp + quantidade;
    let novoLevel = level;
    let newPlayer = { ...player };

    if (novoXp >= level * 100) {
      novoLevel++;
      const xpRestante = novoXp - (level * 100);
      novoXp = xpRestante;

      newPlayer = {
        ...newPlayer,
        maxHp: newPlayer.maxHp + 20,
        hp: newPlayer.maxHp + 20,
        atk: newPlayer.atk + 5,
        def: newPlayer.def + 2,
        maxMana: newPlayer.maxMana + 10,
        mana: newPlayer.maxMana + 10,
        level: novoLevel
      };

      // Verificar e adicionar novas habilidades ao subir de nível
      if (player.playerClass && classSkills[player.playerClass]) {
        const novasHabilidades = classSkills[player.playerClass].filter(
          skill => skill.levelRequired === novoLevel
        );
        
        if (novasHabilidades.length > 0) {
          newPlayer.skills = [...newPlayer.skills, ...novasHabilidades];
          Alert.alert("🎉 Nova Habilidade!", 
            `Você aprendeu: ${novasHabilidades[0].name} - ${novasHabilidades[0].description}`);
        }
      }

      Alert.alert("🎉 Level Up!", `Você alcançou o nível ${novoLevel}!`);

      if (novoLevel === 3 && !playerClass) {
        setShowClassSelection(true);
      }
    }

    setXp(novoXp);
    setLevel(novoLevel);
    setPlayer(newPlayer);
  };

  const setPlayerClass = (cls) => {
    setPlayer(prev => ({
      ...prev,
      playerClass: cls.name,
      atk: prev.atk + cls.bonusAtk,
      def: prev.def + cls.bonusDef,
      maxHp: prev.maxHp + cls.bonusHp,
      hp: prev.maxHp + cls.bonusHp,
      maxMana: prev.maxMana + (cls.bonusMana || 0),
      mana: prev.maxMana + (cls.bonusMana || 0),
      skills: classSkills[cls.name] ? [classSkills[cls.name][0]] : []
    }));
    
    setPlayerClassState(cls);
    Alert.alert("🏆 Classe escolhida!", `Você agora é ${cls.name}`);
  };

  const resetarSeMorto = () => {
    if (player.hp <= 0) {
      setPlayer(prev => ({
        ...prev,
        hp: prev.maxHp / 2,
        mana: prev.maxMana / 2
      }));
    }
  };

  return {
    player,
    setPlayer,
    xp,
    level,
    playerClass,
    setPlayerClass,
    showClassSelection,
    setShowClassSelection,
    showInventory,
    setShowInventory,
    ganharXp,
    resetarSeMorto,
    entrarEmCombate,
    sairDoCombate,
    isInCombat,
    classSkills
  };
};

export default usePlayer;