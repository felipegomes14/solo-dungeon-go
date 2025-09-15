import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Modal, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

// CORREÇÃO: Use ./ (ponto-barra) para caminhos relativos
import ClassSelection from "./ClassSelection";
import Inventory from "./Inventory";
import Combat from "./Combat";
import PuzzleGame from "./PuzzleGame";
import QuizGame from "./QuizGame";
import DungeonConfirmation from "./DungeonConfirmation";
import EquipamentScreen from "./EquipamentScreen";
import ShopScreen from "./ShopScreen";

export default function App() {
  const [location, setLocation] = useState(null);
  const [dungeons, setDungeons] = useState([]);
  const [currentDungeon, setCurrentDungeon] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [showDungeonConfirm, setShowDungeonConfirm] = useState(false);
  const [showEquipament, setShowEquipament] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerClass, setPlayerClass] = useState(null);

  const [showClassSelection, setShowClassSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

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
        type: "potion", 
        name: "Poção de Cura", 
        effect: "heal", 
        value: 30 
      },
      { 
        id: 2, 
        type: "potion", 
        name: "Poção de Mana", 
        effect: "mana", 
        value: 20 
      }
    ],
    equipament: {}
  });

  // Regeneração de HP
  useEffect(() => {
    const hpRegenInterval = setInterval(() => {
      if (player.hp < player.maxHp && !currentDungeon && !currentGame) {
        setPlayer(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + 10)
        }));
      }
    }, 1000);

    return () => clearInterval(hpRegenInterval);
  }, [player.hp, player.maxHp, currentDungeon, currentGame]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "O app precisa de acesso ao GPS!");
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(pos.coords);
      gerarDungeons(pos.coords.latitude, pos.coords.longitude);

      const dungeonInterval = setInterval(() => {
        gerarDungeons(pos.coords.latitude, pos.coords.longitude);
      }, 3 * 60 * 1000);

      return () => clearInterval(dungeonInterval);
    })();
  }, []);

  const ranks = [
    { rank: "F", color: "gray", difficulty: 1 },
    { rank: "E", color: "green", difficulty: 2 },
    { rank: "D", color: "blue", difficulty: 3 },
    { rank: "C", color: "purple", difficulty: 4 },
    { rank: "B", color: "orange", difficulty: 5 },
    { rank: "A", color: "red", difficulty: 6 },
  ];

  const dungeonTypes = ["combat", "combat", "combat"];

  const getDungeonRewards = (dungeon) => {
    const baseXP = dungeon.difficulty * 20;
    const baseGold = dungeon.difficulty * 15;
    
    return {
      xp: baseXP,
      gold: baseGold,
      itens: [
        { 
          id: Date.now() + 1, 
          type: 'potion', 
          name: 'Poção de Cura', 
          effect: 'heal', 
          value: 30 
        }
      ]
    };
  };

  const gerarDungeons = (lat, lon) => {
    const novas = [];
    for (let i = 0; i < 3; i++) {
      const r = ranks[Math.floor(Math.random() * ranks.length)];
      const dungeonType = "combat";
      const rewards = getDungeonRewards({ ...r, type: dungeonType });
      
      novas.push({
        id: Date.now() + i,
        latitude: lat + (Math.random() - 0.5) * 0.015,
        longitude: lon + (Math.random() - 0.5) * 0.015,
        title: `Dungeon ${r.rank}`,
        description: `Dungeon ${r.rank}`,
        rank: r.rank,
        color: r.color,
        difficulty: r.difficulty,
        type: dungeonType,
        completed: false,
        rewards: rewards
      });
    }
    
    setDungeons(novas);
    setMapKey(prev => prev + 1);

    setTimeout(() => {
      setDungeons(prev => prev.filter(d => !novas.includes(d)));
    }, 5 * 60 * 1000);
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

  const completarDungeon = (dungeon, recompensaExtra) => {
    const recompensaBase = dungeon.rewards;
    const recompensaTotal = {
      ...recompensaBase,
      ...recompensaExtra
    };
    
    setDungeons(prev => prev.map(d => 
      d.id === dungeon.id ? { ...d, completed: true, color: "green" } : d
    ));
    
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + recompensaTotal.gold,
      xp: prev.xp + recompensaTotal.xp,
      inventory: [...prev.inventory, ...recompensaTotal.itens]
    }));
    
    ganharXp(recompensaTotal.xp);
    
    Alert.alert(
      "🎉 Dungeon Concluída!",
      `Recompensas:\n+${recompensaTotal.xp} XP\n+${recompensaTotal.gold} Ouro\n+${recompensaTotal.itens.length} Itens`
    );
  };

  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={mapKey}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {dungeons.map((d) => (
          <Marker
            key={d.id}
            coordinate={{ latitude: d.latitude, longitude: d.longitude }}
            title={d.title}
            description={d.description}
            onPress={() => handleDungeonPress(d)}
          >
            <View style={[
              styles.markerContainer, 
              { backgroundColor: d.completed ? 'green' : d.color },
              d.completed && styles.completedMarker
            ]}>
              <Text style={styles.markerText}>
                {d.completed ? '✓' : d.rank}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {player.hp < player.maxHp && !currentDungeon && !currentGame && (
        <View style={styles.regenIndicator}>
          <Text style={styles.regenText}>❤️ Regenerando +10 HP/s</Text>
        </View>
      )}

      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.shopButton}
          onPress={() => setShowShop(true)}
        >
          <Text style={styles.buttonText}>🛒</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.equipamentButton}
          onPress={() => setShowEquipament(true)}
        >
          <Text style={styles.buttonText}>⚔️</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.inventoryButton}
          onPress={() => setShowInventory(true)}
        >
          <Text style={styles.buttonText}>🎒</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={() => location && gerarDungeons(location.latitude, location.longitude)}
        >
          <Text style={styles.buttonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.infoText}>Lv.{level}</Text>
        <Text style={styles.infoText}>XP: {xp}/{level * 100}</Text>
        <Text style={styles.infoText}>HP: {player.hp}/{player.maxHp}</Text>
        <Text style={styles.infoText}>MP: {player.mana}/{player.maxMana}</Text>
        <Text style={styles.infoText}>ATK: {player.atk}</Text>
        <Text style={styles.infoText}>DEF: {player.def}</Text>
        <Text style={styles.infoText}>💰: {player.gold}</Text>
      </View>

      <Modal visible={showClassSelection} animationType="slide">
        <ClassSelection
          onSelect={(cls) => {
            setPlayerClass(cls);
            setShowClassSelection(false);
            setPlayer(prev => ({
              ...prev,
              atk: prev.atk + cls.bonusAtk,
              def: prev.def + cls.bonusDef,
              maxHp: prev.maxHp + cls.bonusHp,
              hp: prev.maxHp + cls.bonusHp
            }));
            Alert.alert("🏆 Classe escolhida!", `Você agora é ${cls.name}`);
          }}
        />
      </Modal>

      <Modal visible={showInventory} animationType="slide">
        <Inventory
          player={player}
          setPlayer={setPlayer}
          onClose={() => setShowInventory(false)}
        />
      </Modal>

      <Modal visible={showEquipament} animationType="slide">
        <EquipamentScreen
          player={player}
          setPlayer={setPlayer}
          onClose={() => setShowEquipament(false)}
        />
      </Modal>

      <Modal visible={showShop} animationType="slide">
        <ShopScreen
          player={player}
          setPlayer={setPlayer}
          onClose={() => setShowShop(false)}
        />
      </Modal>

      <Modal visible={showDungeonConfirm} animationType="slide" transparent={true}>
        <DungeonConfirmation
          dungeon={selectedDungeon}
          onConfirm={() => entrarDungeon(selectedDungeon)}
          onCancel={() => setShowDungeonConfirm(false)}
        />
      </Modal>

      <Modal visible={!!currentDungeon} animationType="slide">
        <Combat
          dungeon={currentDungeon}
          player={player}
          setPlayer={setPlayer}
          ganharXp={ganharXp}
          onClose={() => setCurrentDungeon(null)}
          onComplete={(recompensaExtra) => {
            completarDungeon(currentDungeon, recompensaExtra);
            setCurrentDungeon(null);
          }}
        />
      </Modal>

      <Modal visible={!!currentGame} animationType="slide">
        {currentGame?.type === "puzzle" && (
          <PuzzleGame
            dungeon={currentGame.dungeon}
            onClose={() => setCurrentGame(null)}
            onComplete={(recompensaExtra) => {
              completarDungeon(currentGame.dungeon, recompensaExtra);
              setCurrentGame(null);
            }}
          />
        )}
        {currentGame?.type === "quiz" && (
          <QuizGame
            dungeon={currentGame.dungeon}
            onClose={() => setCurrentGame(null)}
            onComplete={(recompensaExtra) => {
              completarDungeon(currentGame.dungeon, recompensaExtra);
              setCurrentGame(null);
            }}
          />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  regenIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    padding: 10,
    borderRadius: 20,
  },
  regenText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 10
  },
  shopButton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  equipamentButton: {
    backgroundColor: '#9b59b6',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inventoryButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshButton: {
    backgroundColor: '#FF9500',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  playerInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  completedMarker: {
    opacity: 0.6
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});