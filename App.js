import React, { useState, useEffect } from 'react';
import { View, Modal, Alert, Text } from "react-native";
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
import ErrorBoundary from './ErrorBoundary';

import PlayerHUD from "./PlayerHUD";
import ControlsOverlay from "./ControlsOverlay";
import DungeonMarkers from "./DungeonMarkers";
import RegenIndicator from "./RegenIndicator";

import { styles } from "./AppStyles";

export default function App() {
  const {
    location,
    isLoading,
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
    isInCombat
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

  useEffect(() => {
    return () => {
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
      gold: prev.gold + recompensaTotal.gold,
      inventory: [...prev.inventory, ...recompensaTotal.itens]
    }));
    
    return recompensaTotal;
  };

  if (isLoading) {
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

      <ControlsOverlay
        onShowShop={() => setShowShop(true)}
        onShowEquipament={() => setShowEquipament(true)}
        onShowInventory={() => setShowInventory(true)}
        onRefreshDungeons={() => gerarDungeons(safeCoords.latitude, safeCoords.longitude)}
        onShowQuest={() => setShowQuest(true)}
      />

      <PlayerHUD
        player={player}
        level={level}
        xp={xp}
        dungeons={dungeons}
      />

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

      <Modal visible={showQuest} animationType="slide">
        <QuestDiaria
          player={player}
          setPlayer={setPlayer}
          visible={showQuest}
          onClose={() => setShowQuest(false)}
        />
      </Modal>

      <ErrorBoundary onBack={() => setShowQuest(false)}>
        <QuestDiaria
          player={player}
          setPlayer={setPlayer}
          visible={showQuest}
          onClose={() => setShowQuest(false)}
        />
      </ErrorBoundary>
    </View>
  );
}