import { useState, useEffect } from "react";
import { Alert } from "react-native";

const usePlayer = () => {
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
    equipament: {}
  });

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerClass, setPlayerClass] = useState(null);
  const [showClassSelection, setShowClassSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);

  // Regeneração de HP e MP apenas fora do combate
  useEffect(() => {
    const regenInterval = setInterval(() => {
      if (!isInCombat) {
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
      }
    }, 1000);

    return () => clearInterval(regenInterval);
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

      Alert.alert("🎉 Level Up!", `Você alcançou o nível ${novoLevel}!`);

      if (novoLevel === 3 && !playerClass) {
        setShowClassSelection(true);
      }
    }

    setXp(novoXp);
    setLevel(novoLevel);
    setPlayer(newPlayer);
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
    isInCombat
  };
};

export default usePlayer;