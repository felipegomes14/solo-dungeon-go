import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Modal } from 'react-native';

export default function Combat({ dungeon, player, setPlayer, ganharXp, onClose, onComplete, onCombatStart }) {
  const [monsters, setMonsters] = useState([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isDefending, setIsDefending] = useState(false);
  const [combatStatus, setCombatStatus] = useState('ongoing');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeoutIds, setTimeoutIds] = useState([]);
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [activeBuffs, setActiveBuffs] = useState([]);

  useEffect(() => {
    return () => {
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [timeoutIds]);

  const monsterTemplates = {
    'F': { name: "Goblin", hp: 30, atk: 8, def: 2, xp: 15, gold: 10 },
    'E': { name: "Orc", hp: 50, atk: 12, def: 3, xp: 25, gold: 20 },
    'D': { name: "Esqueleto", hp: 70, atk: 15, def: 4, xp: 35, gold: 30 },
    'C': { name: "Lobisomem", hp: 90, atk: 18, def: 5, xp: 45, gold: 40 },
    'B': { name: "Vampiro", hp: 120, atk: 22, def: 6, xp: 60, gold: 50 },
    'A': { name: "Demônio", hp: 150, atk: 25, def: 8, xp: 80, gold: 70 },
    'S': { name: "Dragão", hp: 200, atk: 30, def: 10, xp: 100, gold: 100 }
  };

  // Inicializar combate
  useEffect(() => {
    if (dungeon) {
      const monsterCount = Math.min(3, 1 + Math.floor(dungeon.difficulty / 2));
      const newMonsters = [];
      
      for (let i = 0; i < monsterCount; i++) {
        const template = monsterTemplates[dungeon.rank] || monsterTemplates['F'];
        newMonsters.push({
          ...template,
          currentHp: template.hp,
          id: i
        });
      }
      
      setMonsters(newMonsters);
      setCurrentMonsterIndex(0);
      setCombatLog([`⚔️ Combate iniciado na ${dungeon.title}!`]);
      setIsPlayerTurn(true);
      setCombatStatus('ongoing');
      setIsProcessing(false);
      setIsDefending(false);
      
      onCombatStart();
    }
  }, [dungeon]);

  const currentMonster = monsters[currentMonsterIndex];

  const addToLog = (message) => {
    setCombatLog(prev => [message, ...prev.slice(0, 8)]);
  };

  const addTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    setTimeoutIds(prev => [...prev, timeoutId]);
    return timeoutId;
  };

  const playerAttack = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing' || !currentMonster) return;
    
    setIsProcessing(true);
    
    const playerAtk = Number(player.atk) || 10;
    const monsterDef = Number(currentMonster.def) || 2;
    
    const baseDamage = playerAtk;
    const critChance = 0.2;
    const isCrit = Math.random() < critChance;
    const damage = isCrit ? Math.floor(baseDamage * 1.5) : baseDamage;
    
    const actualDamage = Math.max(1, damage - monsterDef);
    const currentMonsterHp = Number(currentMonster.currentHp) || 0;
    const newMonsterHp = Math.max(0, currentMonsterHp - actualDamage);

    addToLog(isCrit ? 
      `💥 CRÍTICO! ${actualDamage} de dano!` :
      `⚔️ Você causou ${actualDamage} de dano!`
    );

    const newMonsters = monsters.map((monster, index) => 
      index === currentMonsterIndex 
        ? { ...monster, currentHp: newMonsterHp }
        : monster
    );
    
    setMonsters(newMonsters);

    if (newMonsterHp <= 0) {
      addToLog(`🎯 ${currentMonster.name} derrotado!`);
      
      if (currentMonsterIndex < monsters.length - 1) {
        addTimeout(() => {
          setCurrentMonsterIndex(prev => prev + 1);
          addToLog(`🐺 Próximo: ${monsters[currentMonsterIndex + 1]?.name}`);
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }, 1000);
      } else {
        addTimeout(() => victory(), 1000);
      }
    } else {
      setIsPlayerTurn(false);
      addTimeout(() => monsterTurn(), 1000);
    }
  };

  const playerDefend = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing') return;
    
    setIsProcessing(true);
    addToLog("🛡️ Você se defendeu!");
    setIsDefending(true);
    setIsPlayerTurn(false);
    
    addTimeout(() => {
      monsterTurn();
    }, 1000);
  };

  const useSkill = (skill) => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing' || !currentMonster) return;
    
    const playerMana = Number(player.mana) || 0;
    if (playerMana < skill.manaCost) {
      addToLog(`❌ Mana insuficiente para ${skill.name}!`);
      return;
    }

    setIsProcessing(true);
    setShowSkillsModal(false);
    
    setPlayer(prev => ({
      ...prev,
      mana: Math.max(0, (Number(prev.mana) || 0) - skill.manaCost)
    }));

    addToLog(`✨ ${skill.name}! (-${skill.manaCost} MP)`);

    if (skill.effect === 'attack') {
      const playerAtk = Number(player.atk) || 10;
      const monsterDef = Number(currentMonster.def) || 2;
      
      const skillDamage = Math.floor(playerAtk * skill.value);
      const actualDamage = Math.max(1, skillDamage - monsterDef);
      const currentMonsterHp = Number(currentMonster.currentHp) || 0;
      const newMonsterHp = Math.max(0, currentMonsterHp - actualDamage);

      addToLog(`💥 Causou ${actualDamage} de dano!`);

      const newMonsters = monsters.map((monster, index) => 
        index === currentMonsterIndex 
          ? { ...monster, currentHp: newMonsterHp }
          : monster
      );
      
      setMonsters(newMonsters);

      if (newMonsterHp <= 0) {
        addToLog(`🎯 ${currentMonster.name} derrotado!`);
        
        if (currentMonsterIndex < monsters.length - 1) {
          addTimeout(() => {
            setCurrentMonsterIndex(prev => prev + 1);
            addToLog(`🐺 Próximo: ${monsters[currentMonsterIndex + 1]?.name}`);
            setIsPlayerTurn(true);
            setIsProcessing(false);
          }, 1000);
        } else {
          addTimeout(() => victory(), 1000);
        }
      } else {
        setIsPlayerTurn(false);
        addTimeout(() => monsterTurn(), 1000);
      }
    } else if (skill.effect === 'buff') {
      const newBuff = {
        type: 'attack',
        value: skill.value,
        duration: 2,
        name: skill.name
      };
      setActiveBuffs(prev => [...prev, newBuff]);
      addToLog(`⚡ ${skill.name} ativado! Ataque aumentado.`);
      setIsPlayerTurn(false);
      addTimeout(() => monsterTurn(), 1000);
    } else if (skill.effect === 'defense') {
      const newBuff = {
        type: 'defense',
        value: skill.value,
        duration: 2,
        name: skill.name
      };
      setActiveBuffs(prev => [...prev, newBuff]);
      addToLog(`🛡️ ${skill.name} ativado! Defesa aumentada.`);
      setIsPlayerTurn(false);
      addTimeout(() => monsterTurn(), 1000);
    } else if (skill.effect === 'heal') {
      const healAmount = Math.floor(player.maxHp * skill.value);
      setPlayer(prev => ({
        ...prev,
        hp: Math.min(prev.maxHp, prev.hp + healAmount)
      }));
      addToLog(`💖 ${skill.name}! +${healAmount} HP`);
      setIsPlayerTurn(false);
      addTimeout(() => monsterTurn(), 1000);
    }
  };

  const monsterTurn = () => {
    if (combatStatus !== 'ongoing' || !currentMonster) {
      setIsProcessing(false);
      return;
    }

    const monsterAtk = Number(currentMonster.atk) || 8;
    const playerDefValue = Number(player.def) || 5;
    
    const defenseBonus = isDefending ? playerDefValue * 2 : playerDefValue;
    const monsterDamage = Math.max(1, monsterAtk - defenseBonus);
    const actualDamage = isDefending ? Math.floor(monsterDamage / 2) : monsterDamage;

    const playerHp = Number(player.hp) || 0;
    const newHp = Math.max(0, playerHp - actualDamage);

    addToLog(isDefending ? 
      `🛡️ ${currentMonster.name} causou ${actualDamage} de dano (defendido!)` :
      `👹 ${currentMonster.name} causou ${actualDamage} de dano!`
    );

    setPlayer(prev => ({
      ...prev,
      hp: newHp
    }));

    if (newHp <= 0) {
      addToLog('💀 Você foi derrotado!');
      setCombatStatus('lost');
    }

    setIsDefending(false);
    setIsPlayerTurn(true);
    setIsProcessing(false);
  };

  const victory = () => {
    setCombatStatus('won');
    const totalXp = monsters.reduce((sum, m) => sum + (Number(m.xp) || 0), 0);
    const totalGold = monsters.reduce((sum, m) => sum + (Number(m.gold) || 0), 0);
    
    addToLog(`🎉 Vitória! +${totalXp} XP e +${totalGold} de ouro!`);
    
    const recompensa = {
      xp: totalXp,
      gold: totalGold,
      itens: [
        { type: 'poção', name: 'Poção de Cura', effect: 'cura', value: 30 },
        { type: 'poção', name: 'Poção de Mana', effect: 'mana', value: 20 }
      ]
    };
    
    ganharXp(totalXp);
    
    addTimeout(() => {
      setPlayer(prev => ({
        ...prev,
        gold: (Number(prev.gold) || 0) + totalGold,
        inventory: [...prev.inventory, ...recompensa.itens]
      }));
      onComplete(recompensa);
    }, 2000);
  };

  const useItem = (item) => {
    if (isProcessing || combatStatus !== 'ongoing') return;

    setIsProcessing(true);

    if (item.type === 'potion' || item.type === 'poção') {
      const healValue = Number(item.value) || 30;
      
      if (item.effect === 'heal' || item.effect === 'cura') {
        setPlayer(prev => {
          const currentHp = Number(prev.hp) || 0;
          const maxHp = Number(prev.maxHp) || 100;
          const newHp = Math.min(maxHp, currentHp + healValue);
          
          const itemIndex = prev.inventory.findIndex(invItem => invItem === item);
          const newInventory = [...prev.inventory];
          if (itemIndex !== -1) {
            newInventory.splice(itemIndex, 1);
          }

          return {
            ...prev,
            hp: newHp,
            inventory: newInventory
          };
        });
        addToLog(`🧪 Usou ${item.name}! +${healValue} HP`);
      } 
      else if (item.effect === 'mana') {
        setPlayer(prev => {
          const currentMana = Number(prev.mana) || 0;
          const maxMana = Number(prev.maxMana) || 50;
          const newMana = Math.min(maxMana, currentMana + healValue);
          
          const itemIndex = prev.inventory.findIndex(invItem => invItem === item);
          const newInventory = [...prev.inventory];
          if (itemIndex !== -1) {
            newInventory.splice(itemIndex, 1);
          }

          return {
            ...prev,
            mana: newMana,
            inventory: newInventory
          };
        });
        addToLog(`🧪 Usou ${item.name}! +${healValue} MP`);
      }
    } else if (item.type === 'scroll' || item.type === 'pergaminho') {
      const xpValue = Number(item.value) || 50;
      addToLog(`📜 ${item.name} usado! +${xpValue} XP`);
      ganharXp(xpValue);
      setPlayer(prev => {
        const itemIndex = prev.inventory.findIndex(invItem => invItem === item);
        const newInventory = [...prev.inventory];
        if (itemIndex !== -1) {
          newInventory.splice(itemIndex, 1);
        }

        return {
          ...prev,
          inventory: newInventory
        };
      });
    }

    setIsPlayerTurn(false);
    addTimeout(() => {
      monsterTurn();
      setIsProcessing(false);
    }, 1000);
  };

  const flee = () => {
    if (isProcessing) return;
    
    if (Math.random() < 0.7) {
      addToLog('🏃‍♂️ Fuga bem-sucedida!');
      onClose();
    } else {
      addToLog('❌ Falha na fuga!');
      setIsPlayerTurn(false);
      addTimeout(() => monsterTurn(), 1000);
    }
  };

  const renderSkills = () => {
    return player.skills.map((skill, index) => (
      <TouchableOpacity 
        key={index}
        style={[
          styles.skillButton,
          (Number(player.mana) || 0) < skill.manaCost && styles.disabledButton
        ]}
        onPress={() => useSkill(skill)}
        disabled={(Number(player.mana) || 0) < skill.manaCost}
      >
        <Text style={styles.skillIcon}>{skill.icon}</Text>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillCost}>{skill.manaCost} MP</Text>
      </TouchableOpacity>
    ));
  };

  const renderItems = () => {
    return player.inventory.map((item, index) => (
      <TouchableOpacity 
        key={index}
        style={styles.itemButton}
        onPress={() => {
          useItem(item);
          setShowItemsModal(false);
        }}
      >
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemEffect}>
          {item.effect === 'cura' ? `+${item.value} HP` : `+${item.value} MP`}
        </Text>
      </TouchableOpacity>
    ));
  };

  if (!currentMonster || monsters.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando combate...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ Combate - {dungeon?.title}</Text>
      
      <View style={styles.stats}>
        <Text style={styles.statText}>HP: {Number(player.hp) || 0}/{Number(player.maxHp) || 100}</Text>
        <Text style={styles.statText}>MP: {Number(player.mana) || 0}/{Number(player.maxMana) || 50}</Text>
        <Text style={styles.statText}>Monstro: {currentMonster.name}</Text>
        <Text style={styles.statText}>HP Monstro: {Number(currentMonster.currentHp) || 0}/{Number(currentMonster.hp) || 0}</Text>
        <Text style={styles.statText}>Monstros: {currentMonsterIndex + 1}/{monsters.length}</Text>
      </View>

      {activeBuffs.length > 0 && (
        <View style={styles.buffsContainer}>
          {activeBuffs.map((buff, index) => (
            <Text key={index} style={styles.buffText}>
              {buff.type === 'attack' ? '⚡' : '🛡️'} {buff.name}
            </Text>
          ))}
        </View>
      )}

      <ScrollView style={styles.combatLog}>
        {combatLog.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>

      {combatStatus === 'ongoing' && isPlayerTurn && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.basicButton, isProcessing && styles.disabledButton]} 
            onPress={playerAttack}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>⚔️ Atacar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.basicButton, isProcessing && styles.disabledButton]} 
            onPress={playerDefend}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>🛡️ Defender</Text>
          </TouchableOpacity>

          {player.skills.length > 0 && (
            <TouchableOpacity 
              style={[styles.specialButton, isProcessing && styles.disabledButton]}
              onPress={() => setShowSkillsModal(true)}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>✨ Habilidades</Text>
            </TouchableOpacity>
          )}

          {player.inventory.length > 0 && (
            <TouchableOpacity 
              style={[styles.specialButton, isProcessing && styles.disabledButton]}
              onPress={() => setShowItemsModal(true)}
              disabled={isProcessing}
            >
              <Text style={styles.buttonText}>🎒 Itens</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.fleeButton, isProcessing && styles.disabledButton]} 
            onPress={flee}
            disabled={isProcessing}
          >
            <Text style={styles.fleeText}>🏃‍♂️ Fugir</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showSkillsModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✨ Habilidades</Text>
            <ScrollView style={styles.modalScroll}>
              {renderSkills()}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowSkillsModal(false)}
            >
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showItemsModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎒 Itens</Text>
            <ScrollView style={styles.modalScroll}>
              {renderItems()}
            </ScrollView>
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowItemsModal(false)}
            >
              <Text style={styles.closeModalText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {combatStatus === 'lost' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>💀 Você foi derrotado!</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Sair</Text>
          </TouchableOpacity>
        </View>
      )}

      {combatStatus === 'won' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>🎉 Vitória!</Text>
          <Text style={styles.resultSubText}>Toque para continuar...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2c3e50'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'white'
  },
  stats: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  statText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2
  },
  buffsContainer: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
  },
  buffText: {
    color: '#FFD700',
    fontSize: 11,
    marginBottom: 2,
  },
  combatLog: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    maxHeight: 200
  },
  logText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 3
  },
  actions: {
    marginBottom: 10
  },
  basicButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8
  },
  specialButton: {
    backgroundColor: '#9b59b6',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  fleeButton: {
    backgroundColor: '#f39c12',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  fleeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  closeButton: {
    backgroundColor: '#7f8c8d',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold'
  },
  disabledButton: {
    opacity: 0.5
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  resultText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },
  resultSubText: {
    color: '#ccc',
    fontSize: 14
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: '#2c3e50',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 200,
  },
  skillButton: {
    backgroundColor: '#8e44ad',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
    alignItems: 'center',
  },
  skillIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  skillName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  skillCost: {
    color: '#00FFFF',
    fontSize: 12,
  },
  itemButton: {
    backgroundColor: '#27ae60',
    padding: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  itemText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemEffect: {
    color: '#CCCCCC',
    fontSize: 12,
  },
  closeModalButton: {
    backgroundColor: '#7f8c8d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  closeModalText: {
    color: 'white',
    fontWeight: 'bold',
  },
});