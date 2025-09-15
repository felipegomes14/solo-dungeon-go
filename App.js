import React, { useState, useEffect } from "react";
import { StyleSheet, View, Alert, Modal, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import ClassSelection from "./ClassSelection";
import Inventory from "./Inventory";
import Combat from "./Combat";

export default function App() {
  const [location, setLocation] = useState(null);
  const [dungeons, setDungeons] = useState([]);
  const [currentDungeon, setCurrentDungeon] = useState(null);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [playerClass, setPlayerClass] = useState(null);

  const [showClassSelection, setShowClassSelection] = useState(false);
  const [showInventory, setShowInventory] = useState(false);

  const [player, setPlayer] = useState({
    hp: 100,
    maxHp: 100,
    atk: 10,
    level: 1,
    xp: 0,
    gold: 0,
    inventory: ["Poção de Cura"], // começa com item para evitar undefined
  });

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

      // Geração periódica de dungeons
      const dungeonInterval = setInterval(() => {
        gerarDungeons(pos.coords.latitude, pos.coords.longitude);
      }, 5 * 60 * 1000); // 5 min

      return () => clearInterval(dungeonInterval);
    })();
  }, []);

  const ranks = [
    { rank: "F", color: "gray" },
    { rank: "E", color: "green" },
    { rank: "D", color: "blue" },
    { rank: "C", color: "purple" },
    { rank: "B", color: "orange" },
    { rank: "A", color: "red" },
    { rank: "S", color: "black" },
    { rank: "SS", color: "gold" },
  ];

  const gerarDungeons = (lat, lon) => {
    const novas = [];
    for (let i = 0; i < 3; i++) {
      const r = ranks[Math.floor(Math.random() * ranks.length)];
      novas.push({
        id: Date.now() + i,
        latitude: lat + (Math.random() - 0.5) * 0.01,
        longitude: lon + (Math.random() - 0.5) * 0.01,
        title: `Dungeon Rank ${r.rank}`,
        description: `Um portal rank ${r.rank} apareceu!`,
        rank: r.rank,
        color: r.color,
      });
    }
    setDungeons(novas);

    // Dungeons somem após 1 min
    setTimeout(() => {
      setDungeons([]);
    }, 60 * 1000);
  };

  const entrarDungeon = (dungeon) => {
    setCurrentDungeon(dungeon);
  };

  const ganharXp = (quantidade) => {
    let novoXp = xp + quantidade;
    let novoLevel = level;
    let newPlayer = { ...player };

    if (novoXp >= level * 100) {
      novoXp = 0;
      novoLevel++;
      newPlayer.hp = newPlayer.maxHp;
      Alert.alert("🎉 Level Up!", `Você alcançou o nível ${novoLevel}!`);

      if (novoLevel === 5 && !playerClass) {
        setShowClassSelection(true);
      }
    }

    setXp(novoXp);
    setLevel(novoLevel);
    setPlayer(newPlayer);
  };

  if (!location) return null;

  return (
    <View style={styles.container}>
      {/* MAPA */}
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Jogador */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Você"
          description={`Nível ${level} | Classe: ${
            playerClass ? playerClass.name : "Iniciante"
          }`}
          pinColor="blue"
        />

        {/* Dungeons */}
        {dungeons.map((d) => (
          <Marker
            key={d.id}
            coordinate={{ latitude: d.latitude, longitude: d.longitude }}
            title={d.title}
            description={d.description}
            pinColor={d.color}
            onPress={() => entrarDungeon(d)}
          />
        ))}
      </MapView>

      {/* Botão Inventário */}
      <View style={styles.inventoryButton}>
        <Button title="🎒 Inventário" onPress={() => setShowInventory(true)} />
      </View>

      {/* Escolha de classe */}
      <Modal visible={showClassSelection} animationType="slide">
        <ClassSelection
          onSelect={(cls) => {
            setPlayerClass(cls);
            setShowClassSelection(false);
            Alert.alert("🏆 Classe escolhida!", `Você agora é ${cls.name}`);
          }}
        />
      </Modal>

      {/* Inventário */}
      <Modal visible={showInventory} animationType="slide">
        <Inventory
          player={player} // <-- AGORA PASSANDO player
          onClose={() => setShowInventory(false)}
        />
        <Button title="Fechar" onPress={() => setShowInventory(false)} />
      </Modal>

      {/* Combate */}
      <Modal visible={!!currentDungeon} animationType="slide">
        <Combat
          dungeon={currentDungeon}
          player={player}
          setPlayer={setPlayer}
          ganharXp={ganharXp}
          onClose={() => setCurrentDungeon(null)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inventoryButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },
});
