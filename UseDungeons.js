import { useState, useEffect } from "react";
import { Alert } from "react-native";

const ranks = [
  { rank: "F", color: "gray", difficulty: 1 },
  { rank: "E", color: "green", difficulty: 2 },
  { rank: "D", color: "blue", difficulty: 3 },
  { rank: "C", color: "purple", difficulty: 4 },
  { rank: "B", color: "orange", difficulty: 5 },
  { rank: "A", color: "red", difficulty: 6 },
  { rank: "S", color: "gold", difficulty: 7 },
  { rank: "SS", color: "cyan", difficulty: 8 },
  { rank: "SSS", color: "magenta", difficulty: 9 }
];

const useDungeons = () => {
  const [dungeons, setDungeons] = useState([]);
  const [currentDungeon, setCurrentDungeon] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [showDungeonConfirm, setShowDungeonConfirm] = useState(false);
  const [showEquipament, setShowEquipament] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showQuest, setShowQuest] = useState(false);

  const getDungeonType = () => {
    const random = Math.random();
    if (random < 0.5) return "combat";
    if (random < 0.75) return "puzzle";
    return "quiz";
  };

  const getDungeonRewards = (dungeon) => {
    const baseXP = dungeon.difficulty * 25;
    const baseGold = dungeon.difficulty * 20;

    let itens = [];

    if (dungeon.type === "combat") {
      itens = [{
        id: Date.now() + 1,
        type: 'poção',
        name: 'Poção de Cura',
        effect: 'cura',
        value: 30 + dungeon.difficulty * 5
      }];
    } else if (dungeon.type === "puzzle") {
      itens = [{
        id: Date.now() + 1,
        type: 'scroll',
        name: 'Pergaminho da Sabedoria',
        effect: 'xp',
        value: 15 + dungeon.difficulty * 3
      }];
    } else if (dungeon.type === "quiz") {
      itens = [{
        id: Date.now() + 1,
        type: 'livro',
        name: 'Livro do Conhecimento',
        effect: 'mana',
        value: 25 + dungeon.difficulty * 4
      }];
    }

    return { xp: baseXP, gold: baseGold, itens };
  };

  const gerarDungeons = (lat, lon) => {
    const novas = [];
    const numDungeons = 25;

    for (let i = 0; i < numDungeons; i++) {
      const r = ranks[Math.floor(Math.random() * ranks.length)];
      const dungeonType = getDungeonType();
      const rewards = getDungeonRewards({ ...r, type: dungeonType });

      const offsetLat = (Math.random() - 0.5) * 0.1;
      const offsetLon = (Math.random() - 0.5) * 0.1;
      const dungeonLat = lat + offsetLat + (Math.random() - 0.5) * 0.005;
      const dungeonLon = lon + offsetLon + (Math.random() - 0.5) * 0.005;

      const novaDungeon = {
        id: Date.now() + i,
        latitude: dungeonLat,
        longitude: dungeonLon,
        title: `${dungeonType === 'combat' ? '⚔️' : dungeonType === 'puzzle' ? '🧩' : '❓'} Dungeon ${r.rank}`,
        description: `${dungeonType.charAt(0).toUpperCase() + dungeonType.slice(1)} Dungeon ${r.rank}`,
        rank: r.rank,
        color: r.color,
        difficulty: r.difficulty,
        type: dungeonType,
        completed: false,
        rewards: rewards
      };

      novas.push(novaDungeon);
    }

    setDungeons(novas);
    setMapKey(prev => prev + 1);

    setTimeout(() => {
      setDungeons(prev => prev.filter(d => !novas.includes(d)));
    }, 10 * 60 * 1000);
  };

  const handleDungeonPress = (dungeon) => {
    if (dungeon.completed) {
      Alert.alert("Dungeon Concluída", "Esta dungeon já foi completada!");
      return;
    }
    setSelectedDungeon(dungeon);
    setShowDungeonConfirm(true);
  };

  const entrarDungeon = (dungeon) => {
    setShowDungeonConfirm(false);
    if (dungeon.type === "combat") {
      setCurrentDungeon(dungeon);
    } else if (dungeon.type === "puzzle") {
      setCurrentGame({ type: "puzzle", dungeon: dungeon });
    } else if (dungeon.type === "quiz") {
      setCurrentGame({ type: "quiz", dungeon: dungeon });
    }
  };

  const completarDungeon = (dungeon, recompensaExtra) => {
    const recompensaBase = dungeon.rewards;
    const recompensaTotal = { ...recompensaBase, ...recompensaExtra };

    setDungeons(prev => prev.map(d =>
      d.id === dungeon.id ? { ...d, completed: true, color: "green" } : d
    ));

    Alert.alert(
      "🎉 Dungeon Concluída!",
      `Recompensas:\n+${recompensaTotal.xp} XP\n+${recompensaTotal.gold} Ouro\n+${recompensaTotal.itens.length} Itens`
    );

    return recompensaTotal;
  };

  return {
    dungeons,
    currentDungeon,
    setCurrentDungeon,
    currentGame,
    setCurrentGame,
    selectedDungeon,
    setSelectedDungeon,
    showDungeonConfirm,
    setShowDungeonConfirm,
    showEquipament,
    setShowEquipament,
    showShop,
    setShowShop,
    showQuest,
    setShowQuest,
    mapKey,
    handleDungeonPress,
    entrarDungeon,
    completarDungeon,
    gerarDungeons
  };
};

export default useDungeons;