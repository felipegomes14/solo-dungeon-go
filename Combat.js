import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native';

export default function Combat({ dungeon, player, setPlayer, ganharXp, onClose, onComplete }) {
  const [monsters, setMonsters] = useState([]);
  const [currentMonsterIndex, setCurrentMonsterIndex] = useState(0);
  const [combatLog, setCombatLog] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isDefending, setIsDefending] = useState(false);
  const [combatStatus, setCombatStatus] = useState('ongoing');
  const [isProcessing, setIsProcessing] = useState(false);

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
      setCombatLog([`Você entrou na dungeon ${dungeon.rank}!`]);
      setIsPlayerTurn(true);
      setCombatStatus('ongoing');
      setIsProcessing(false);
      setIsDefending(false);
    }
  }, [dungeon]);

  const currentMonster = monsters[currentMonsterIndex];

  const addToLog = (message) => {
    setCombatLog(prev => [message, ...prev.slice(0, 14)]);
  };

  const playerAttack = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing' || !currentMonster) return;
    
    setIsProcessing(true);
    
    // Garantir que os valores são números
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
      `💥 CRÍTICO! Você causou ${actualDamage} de dano!` :
      `⚔️ Você causou ${actualDamage} de dano!`
    );

    // Atualiza monstro
    const newMonsters = monsters.map((monster, index) => 
      index === currentMonsterIndex 
        ? { ...monster, currentHp: newMonsterHp }
        : monster
    );
    
    setMonsters(newMonsters);

    if (newMonsterHp <= 0) {
      addToLog(`🎯 ${currentMonster.name} derrotado!`);
      
      if (currentMonsterIndex < monsters.length - 1) {
        setTimeout(() => {
          setCurrentMonsterIndex(prev => prev + 1);
          addToLog(`🐺 Próximo monstro: ${monsters[currentMonsterIndex + 1]?.name}`);
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }, 1000);
      } else {
        setTimeout(() => victory(), 1000);
      }
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => monsterTurn(), 1000);
    }
  };

  const playerDefend = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing') return;
    
    setIsProcessing(true);
    addToLog("🛡️ Você se defendeu!");
    setIsDefending(true);
    setIsPlayerTurn(false);
    
    setTimeout(() => {
      monsterTurn();
    }, 1000);
  };

  const playerSkill = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing' || !currentMonster) return;
    
    const playerMana = Number(player.mana) || 0;
    if (playerMana < 20) {
      addToLog("❌ Mana insuficiente (20 MP necessário)!");
      return;
    }

    setIsProcessing(true);
    
    // Atualiza mana primeiro
    setPlayer(prev => ({
      ...prev,
      mana: Math.max(0, (Number(prev.mana) || 0) - 20)
    }));

    const playerAtk = Number(player.atk) || 10;
    const monsterDef = Number(currentMonster.def) || 2;
    
    const skillDamage = Math.floor(playerAtk * 1.8);
    const actualDamage = Math.max(1, skillDamage - monsterDef);
    const currentMonsterHp = Number(currentMonster.currentHp) || 0;
    const newMonsterHp = Math.max(0, currentMonsterHp - actualDamage);

    addToLog(`🔥 Skill especial! ${actualDamage} de dano! (-20 MP)`);

    const newMonsters = monsters.map((monster, index) => 
      index === currentMonsterIndex 
        ? { ...monster, currentHp: newMonsterHp }
        : monster
    );
    
    setMonsters(newMonsters);

    if (newMonsterHp <= 0) {
      addToLog(`🎯 ${currentMonster.name} derrotado!`);
      
      if (currentMonsterIndex < monsters.length - 1) {
        setTimeout(() => {
          setCurrentMonsterIndex(prev => prev + 1);
          addToLog(`🐺 Próximo monstro: ${monsters[currentMonsterIndex + 1]?.name}`);
          setIsPlayerTurn(true);
          setIsProcessing(false);
        }, 1000);
      } else {
        setTimeout(() => victory(), 1000);
      }
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => monsterTurn(), 1000);
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
    
    // Atualiza o player após a vitória
    setTimeout(() => {
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

    // CORREÇÃO: Verificar tanto 'potion' quanto 'poção'
    if (item.type === 'potion' || item.type === 'poção') {
      const healValue = Number(item.value) || 30;
      
      // CORREÇÃO: Usar effect para determinar o tipo de cura
      if (item.effect === 'heal' || item.effect === 'cura') {
        setPlayer(prev => {
          const currentHp = Number(prev.hp) || 0;
          const maxHp = Number(prev.maxHp) || 100;
          const newHp = Math.min(maxHp, currentHp + healValue);
          
          // Remover o item usado do inventário
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
          
          // Remover o item usado do inventário
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
        // Remover o item usado do inventário
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
    setTimeout(() => {
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
      setTimeout(() => monsterTurn(), 1000);
    }
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
        <Text style={styles.statText}>Seu HP: {Number(player.hp) || 0}/{Number(player.maxHp) || 100}</Text>
        <Text style={styles.statText}>MP: {Number(player.mana) || 0}/{Number(player.maxMana) || 50}</Text>
        <Text style={styles.statText}>Monstro: {currentMonster.name}</Text>
        <Text style={styles.statText}>HP Monstro: {Number(currentMonster.currentHp) || 0}/{Number(currentMonster.hp) || 0}</Text>
        <Text style={styles.statText}>Monstros: {currentMonsterIndex + 1}/{monsters.length}</Text>
      </View>

      <ScrollView style={styles.combatLog}>
        {combatLog.map((log, index) => (
          <Text key={index} style={styles.logText}>{log}</Text>
        ))}
      </ScrollView>

      {combatStatus === 'ongoing' && isPlayerTurn && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.attackButton, isProcessing && styles.disabledButton]} 
            onPress={playerAttack}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>⚔️ Atacar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.defendButton, isProcessing && styles.disabledButton]} 
            onPress={playerDefend}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>🛡️ Defender</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.skillButton, (isProcessing || (Number(player.mana) || 0) < 20) && styles.disabledButton]} 
            onPress={playerSkill}
            disabled={isProcessing || (Number(player.mana) || 0) < 20}
          >
            <Text style={styles.buttonText}>🔥 Skill (20 MP)</Text>
          </TouchableOpacity>

          <View style={styles.itemsSection}>
            <Text style={styles.itemsTitle}>Itens:</Text>
            {player.inventory.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.itemButton, isProcessing && styles.disabledButton]}
                onPress={() => useItem(item)}
                disabled={isProcessing}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity 
            style={[styles.fleeButton, isProcessing && styles.disabledButton]} 
            onPress={flee}
            disabled={isProcessing}
          >
            <Text style={styles.fleeText}>🏃‍♂️ Fugir (70%)</Text>
          </TouchableOpacity>
        </View>
      )}

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
  attackButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8
  },
  defendButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8
  },
  skillButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.8)',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  itemsSection: {
    marginBottom: 12
  },
  itemsTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14
  },
  itemButton: {
    backgroundColor: 'rgba(39, 174, 96, 0.8)',
    padding: 8,
    borderRadius: 5,
    marginBottom: 4
  },
  itemText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12
  },
  fleeButton: {
    backgroundColor: 'rgba(243, 156, 18, 0.8)',
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
    backgroundColor: 'rgba(127, 140, 141, 0.8)',
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
  }
});