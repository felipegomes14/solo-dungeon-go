import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, Text, ActivityIndicator } from "react-native";
import MapView from "react-native-maps";

import useLocation from "./UseLocation";
import usePlayer from "./UsePlayer";
import useDungeons from "./UseDungeons";

import ClassSelection from "./ClassSelection";
import Combat from "./Combat";
import PuzzleGame from "./PuzzleGame";
import QuizGame from "./QuizGame";
import DungeonConfirmation from "./DungeonConfirmation";
import EquipamentScreen from "./EquipamentScreen";
import ShopScreen from "./ShopScreen";
import QuestDiaria from "./QuestDiaria";
import Menu from "./Menu";
import ErrorBoundary from './ErrorBoundary';

import DungeonMarkers from "./DungeonMarkers";
import RegenIndicator from "./RegenIndicator";

import { styles } from "./AppStyles";

export default function App() {
  const {
    location,
    isLoading: locationLoading,
    safeCoords
  } = useLocation();

  const {
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
    isLoading: playerLoading
  } = usePlayer();

  const {
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
  } = useDungeons();

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      setCurrentDungeon(null);
      setCurrentGame(null);
      setShowDungeonConfirm(false);
      setShowClassSelection(false);
      setShowInventory(false);
      setShowEquipament(false);
      setShowShop(false);
      setShowQuest(false);
    };
  }, []);

  const processarCompletarDungeon = (dungeon, recompensaExtra = {}) => {
    const recompensaTotal = completarDungeon(dungeon, recompensaExtra);
    
    ganharXp(recompensaTotal.xp);
    
    setPlayer(prev => ({
      ...prev,
      gold: (prev.gold || 0) + recompensaTotal.gold,
      inventory: [...(prev.inventory || []), ...recompensaTotal.itens]
    }));
    
    return recompensaTotal;
  };

  const voltarAoMapa = () => {
    setShowClassSelection(false);
    setShowInventory(false);
    setShowEquipament(false);
    setShowShop(false);
    setShowQuest(false);
    setCurrentDungeon(null);
    setCurrentGame(null);
    setShowDungeonConfirm(false);
  };

  if (locationLoading || playerLoading || appLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffcc00" />
        <Text style={{ color: '#fff', marginTop: 20, fontSize: 18 }}>Carregando Aventura...</Text>
      </View>
    );
  }

  if (!safeCoords) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#ff0000', fontSize: 20 }}>❌ Erro de Localização</Text>
        <Text style={{ color: '#fff', marginTop: 10 }}>Verifique as permissões de GPS</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={mapKey}
        style={styles.map}
        initialRegion={safeCoords}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <DungeonMarkers 
          dungeons={dungeons} 
          onPress={handleDungeonPress} 
        />
      </MapView>

      <RegenIndicator 
        player={player}
        currentDungeon={currentDungeon}
        currentGame={currentGame}
        isInCombat={isInCombat}
      />

      <Menu
        player={player}
        setPlayer={setPlayer}
        level={level}
        xp={xp}
        dungeons={dungeons}
        onRefreshDungeons={() => gerarDungeons(safeCoords.latitude, safeCoords.longitude)}
        onShowMap={voltarAoMapa}
        onShowClassSelection={() => setShowClassSelection(true)}
        onShowQuest={() => setShowQuest(true)}
      />

      <Modal visible={showClassSelection} animationType="slide">
        <ClassSelection
          onSelect={(cls) => {
            setPlayerClass(cls);
            setShowClassSelection(false);
            setPlayer(prev => ({
              ...prev,
              atk: (prev.atk || 10) + cls.bonusAtk,
              def: (prev.def || 5) + cls.bonusDef,
              maxHp: (prev.maxHp || 100) + cls.bonusHp,
              hp: (prev.maxHp || 100) + cls.bonusHp,
              maxMana: (prev.maxMana || 50) + (cls.bonusMana || 0),
              mana: (prev.maxMana || 50) + (cls.bonusMana || 0)
            }));
            Alert.alert("🏆 Classe Escolhida!", `Você agora é um ${cls.name}!`);
          }}
        />
      </Modal>

      <Modal visible={showInventory} animationType="slide">
        <EquipamentScreen
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
          onClose={() => {
            setCurrentDungeon(null);
            resetarSeMorto();
            sairDoCombate();
          }}
          onComplete={(recompensaExtra) => {
            processarCompletarDungeon(currentDungeon, recompensaExtra);
            setCurrentDungeon(null);
            sairDoCombate();
          }}
          onCombatStart={entrarEmCombate}
        />
      </Modal>

      <Modal visible={!!currentGame} animationType="slide">
        {currentGame?.type === "puzzle" && (
          <PuzzleGame
            dungeon={currentGame.dungeon}
            onClose={() => setCurrentGame(null)}
            onComplete={(recompensaExtra) => {
              processarCompletarDungeon(currentGame.dungeon, recompensaExtra);
              setCurrentGame(null);
            }}
          />
        )}
        {currentGame?.type === "quiz" && (
          <QuizGame
            dungeon={currentGame.dungeon}
            onClose={() => setCurrentGame(null)}
            onComplete={(recompensaExtra) => {
              processarCompletarDungeon(currentGame.dungeon, recompensaExtra);
              setCurrentGame(null);
            }}
          />
        )}
      </Modal>

      <QuestDiaria
        player={player}
        setPlayer={setPlayer}
        visible={showQuest}
        onClose={() => setShowQuest(false)}
      />
    </View>
  );
}