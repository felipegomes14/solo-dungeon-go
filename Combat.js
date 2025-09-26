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
  const [bossSpawned, setBossSpawned] = useState(false);

  useEffect(() => {
    return () => {
      timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
    };
  }, [timeoutIds]);

  // Sistema de monstros por rank com bosses
  const monsterTemplates = {
    'F': {
      common: { name: "Goblin", hp: 50, atk: 8, def: 2, xp: 15, gold: 10, emoji: "👺" },
      boss: { name: "Orc Chefe", hp: 80, atk: 15, def: 5, xp: 50, gold: 40, emoji: "👹" }
    },
    'E': {
      common: { name: "Lobo", hp: 70, atk: 10, def: 3, xp: 20, gold: 15, emoji: "🐺" },
      boss: { name: "Glabro", hp: 100, atk: 18, def: 6, xp: 60, gold: 50, emoji: "🐗" }
    },
    'D': {
      common: { name: "Esqueleto", hp: 90, atk: 12, def: 4, xp: 25, gold: 20, emoji: "💀" },
      boss: { name: "Lich", hp: 120, atk: 20, def: 8, xp: 70, gold: 60, emoji: "🧙‍♂️" }
    },
    'C': {
      common: { name: "Kobold", hp: 110, atk: 14, def: 5, xp: 30, gold: 25, emoji: "🐲" },
      boss: { name: "Lycan", hp: 140, atk: 22, def: 10, xp: 80, gold: 70, emoji: "🐺" }
    },
    'B': {
      common: { name: "Ghoul", hp: 120, atk: 16, def: 6, xp: 35, gold: 30, emoji: "🧟" },
      boss: { name: "Conde Vampiro", hp: 160, atk: 24, def: 12, xp: 90, gold: 80, emoji: "🧛‍♂️" }
    },
    'A': {
      common: { name: "Tritão", hp: 150, atk: 18, def: 7, xp: 40, gold: 35, emoji: "🧜‍♂️" },
      boss: { name: "Leviathan", hp: 180, atk: 26, def: 14, xp: 100, gold: 90, emoji: "🐉" }
    },
    'S': {
      common: { name: "Wyvern", hp: 170, atk: 20, def: 8, xp: 45, gold: 40, emoji: "🐲" },
      boss: { name: "Drake", hp: 200, atk: 28, def: 16, xp: 110, gold: 100, emoji: "🐉" }
    },
    'SS': {
      common: { name: "Dragonete", hp: 200, atk: 22, def: 9, xp: 50, gold: 45, emoji: "🐲" },
      boss: { name: "Dragão", hp: 250, atk: 32, def: 18, xp: 130, gold: 120, emoji: "🐉" }
    },
    'SSS': {
      common: { name: "Dragão", hp: 300, atk: 25, def: 10, xp: 60, gold: 50, emoji: "🐉" },
      boss: { name: "Deus X-Máquina", hp: 500, atk: 35, def: 20, xp: 150, gold: 150, emoji: "🤖" }
    }
  };

  // Função para dropar materiais dos monstros
  const dropMaterials = (monster) => {
    const materialDrops = {
      'Goblin': ['Olho de Goblin', 'Unhas de Goblin'],
      'Orc Chefe': ['Sangue de Orc', 'Dedo de Orc'],
      'Lobo': ['Presa de Lobo', 'Pelagem de Lobo'],
      'Glabro': ['Orelha de Glabro', 'Pata de Glabro'],
      'Esqueleto': ['Pó de Osso', 'Crânio'],
      'Lich': ['Essência de Alma', 'Orbe Mágica'],
      'Ghoul': ['Mão de Ghoul', 'Pele de Ghoul'],
      'Conde Vampiro': ['Sangue Real', 'Presas de Vampiro'],
      'Tritão': ['Algas Mágicas', 'Escamas de Tritão'],
      'Leviathan': ['Pérola Divina', 'Óvulo de Leviathan'],
      'Wyvern': ['Asas de Wyvern', 'Chifre de Wyvern'],
      'Drake': ['Pele de Drake', 'Cauda de Drake'],
      'Dragonete': ['Unha de Dragonete', 'Saliva de Dragonete'],
      'Dragão': ['Escama de Dragão', 'Coração de Dragão'],
      'Deus X-Máquina': ['Núcleo Energético', 'Mithril']
    };

    const drops = [];
    const possibleDrops = materialDrops[monster.name] || [];

    // 70% de chance de dropar pelo menos 1 material
    if (Math.random() < 0.7 && possibleDrops.length > 0) {
      const dropChance = monster.isBoss ? 0.8 : 0.5; // Boss tem maior chance de drop
      const numberOfDrops = monster.isBoss ? 
        (Math.random() < 0.3 ? 2 : 1) : 1; // Boss pode dropar 2 itens

      for (let i = 0; i < numberOfDrops; i++) {
        if (Math.random() < dropChance) {
          const randomMaterial = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
          drops.push(randomMaterial);
        }
      }
    }

    return drops;
  };

  // Inicializar combate com monstros variáveis e boss
  useEffect(() => {
    if (dungeon) {
      // Número aleatório de monstros comuns (1-10)
      const minMonsters = 1;
      const maxMonsters = 10;
      const commonMonsterCount = Math.floor(Math.random() * (maxMonsters - minMonsters + 1)) + minMonsters;
      
      const rankData = monsterTemplates[dungeon.rank] || monsterTemplates['F'];
      const newMonsters = [];
      
      // Adicionar monstros comuns
      for (let i = 0; i < commonMonsterCount; i++) {
        newMonsters.push({
          ...rankData.common,
          currentHp: rankData.common.hp,
          id: i,
          isBoss: false
        });
      }
      
      // Adicionar boss no final
      newMonsters.push({
        ...rankData.boss,
        currentHp: rankData.boss.hp,
        id: commonMonsterCount,
        isBoss: true
      });
      
      setMonsters(newMonsters);
      setCurrentMonsterIndex(0);
      setCombatLog([
        `⚔️ Entrou na ${dungeon.title}!`,
        `🐺 Encontrou ${commonMonsterCount} ${rankData.common.name}(s) comum(ns)!`,
        `👑 Um poderoso ${rankData.boss.name} aguarda no final!`
      ]);
      setIsPlayerTurn(true);
      setCombatStatus('ongoing');
      setIsProcessing(false);
      setIsDefending(false);
      setBossSpawned(false);
      
      onCombatStart();
    }
  }, [dungeon]);

  const currentMonster = monsters[currentMonsterIndex];

  const addToLog = (message) => {
    setCombatLog(prev => [message, ...prev.slice(0, 10)]);
  };

  const addTimeout = (callback, delay) => {
    const timeoutId = setTimeout(callback, delay);
    setTimeoutIds(prev => [...prev, timeoutId]);
    return timeoutId;
  };

  const playerAttack = () => {
    if (isProcessing || !isPlayerTurn || combatStatus !== 'ongoing' || !currentMonster) return;
    
    setIsProcessing(true);
    
    // Aplicar buffs de ataque
    let attackMultiplier = 1;
    activeBuffs.forEach(buff => {
      if (buff.type === 'attack') {
        attackMultiplier *= buff.value;
      }
    });
    
    const playerAtk = Number(player.atk) || 10;
    const monsterDef = Number(currentMonster.def) || 2;
    
    const baseDamage = Math.floor(playerAtk * attackMultiplier);
    const critChance = 0.2;
    const isCrit = Math.random() < critChance;
    const damage = isCrit ? Math.floor(baseDamage * 1.5) : baseDamage;
    
    const actualDamage = Math.max(1, damage - monsterDef);
    const currentMonsterHp = Number(currentMonster.currentHp) || 0;
    const newMonsterHp = Math.max(0, currentMonsterHp - actualDamage);

    addToLog(isCrit ? 
      `💥 CRÍTICO! ${actualDamage} de dano em ${currentMonster.name}!` :
      `⚔️ Causou ${actualDamage} de dano em ${currentMonster.name}!`
    );

    const newMonsters = monsters.map((monster, index) => 
      index === currentMonsterIndex 
        ? { ...monster, currentHp: newMonsterHp }
        : monster
    );
    
    setMonsters(newMonsters);

    if (newMonsterHp <= 0) {
      if (currentMonster.isBoss) {
        addToLog(`🎉 ${currentMonster.emoji} ${currentMonster.name} derrotado! VITÓRIA!`);
        addTimeout(() => victory(), 1000);
      } else {
        addToLog(`✅ ${currentMonster.emoji} ${currentMonster.name} derrotado!`);
        
        if (currentMonsterIndex < monsters.length - 1) {
          addTimeout(() => {
            const nextMonster = monsters[currentMonsterIndex + 1];
            setCurrentMonsterIndex(prev => prev + 1);
            
            if (nextMonster.isBoss && !bossSpawned) {
              addToLog(`🚨 ALERTA! ${nextMonster.emoji} ${nextMonster.name} apareceu!`);
              setBossSpawned(true);
            } else {
              addToLog(`➡️ Próximo: ${nextMonster.emoji} ${nextMonster.name}`);
            }
            
            setIsPlayerTurn(true);
            setIsProcessing(false);
          }, 1000);
        }
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

    addToLog(`✨ ${skill.name} em ${currentMonster.name}! (-${skill.manaCost} MP)`);

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
        if (currentMonster.isBoss) {
          addToLog(`🎉 ${currentMonster.emoji} ${currentMonster.name} derrotado! VITÓRIA!`);
          addTimeout(() => victory(), 1000);
        } else {
          addToLog(`✅ ${currentMonster.emoji} ${currentMonster.name} derrotado!`);
          
          if (currentMonsterIndex < monsters.length - 1) {
            addTimeout(() => {
              const nextMonster = monsters[currentMonsterIndex + 1];
              setCurrentMonsterIndex(prev => prev + 1);
              
              if (nextMonster.isBoss && !bossSpawned) {
                addToLog(`🚨 ALERTA! ${nextMonster.emoji} ${nextMonster.name} apareceu!`);
                setBossSpawned(true);
              } else {
                addToLog(`➡️ Próximo: ${nextMonster.emoji} ${nextMonster.name}`);
              }
              
              setIsPlayerTurn(true);
              setIsProcessing(false);
            }, 1000);
          }
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

    // Aplicar buffs de defesa
    let defenseMultiplier = 1;
    activeBuffs.forEach(buff => {
      if (buff.type === 'defense') {
        defenseMultiplier *= buff.value;
      }
    });

    const monsterAtk = Number(currentMonster.atk) || 8;
    const playerDefValue = Math.floor((Number(player.def) || 5) * defenseMultiplier);
    
    const defenseBonus = isDefending ? playerDefValue * 2 : playerDefValue;
    const monsterDamage = Math.max(1, monsterAtk - defenseBonus);
    const actualDamage = isDefending ? Math.floor(monsterDamage / 2) : monsterDamage;

    const playerHp = Number(player.hp) || 0;
    const newHp = Math.max(0, playerHp - actualDamage);

    addToLog(isDefending ? 
      `🛡️ ${currentMonster.emoji} ${currentMonster.name} causou ${actualDamage} de dano (defendido!)` :
      `👹 ${currentMonster.emoji} ${currentMonster.name} causou ${actualDamage} de dano!`
    );

    setPlayer(prev => ({
      ...prev,
      hp: newHp
    }));

    // Atualizar duração dos buffs
    setActiveBuffs(prev => {
      const updatedBuffs = prev.map(buff => ({
        ...buff,
        duration: buff.duration - 1
      })).filter(buff => buff.duration > 0);
      
      if (prev.length > updatedBuffs.length) {
        addToLog("💨 Efeito de buff desapareceu.");
      }
      
      return updatedBuffs;
    });

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
    
    // Coletar drops de todos os monstros derrotados
    const allDrops = [];
    monsters.forEach(monster => {
      const drops = dropMaterials(monster);
      drops.forEach(drop => allDrops.push(drop));
    });

    // Bônus por derrotar o boss
    const bossBonus = dungeon.difficulty * 10;
    const totalXpWithBonus = totalXp + bossBonus;
    const totalGoldWithBonus = totalGold + bossBonus;
    
    addToLog(`🎉 Vitória! +${totalXpWithBonus} XP e +${totalGoldWithBonus} de ouro!`);
    
    if (allDrops.length > 0) {
      addToLog(`📦 Materiais coletados: ${allDrops.join(', ')}`);
    }
    
    addToLog(`⭐ Bônus de boss: +${bossBonus} XP e Ouro!`);
    
    const recompensa = {
      xp: totalXpWithBonus,
      gold: totalGoldWithBonus,
      itens: [
        { type: 'poção', name: 'Poção de Cura', effect: 'cura', value: 30 + dungeon.difficulty * 5 },
        { type: 'poção', name: 'Poção de Mana', effect: 'mana', value: 20 + dungeon.difficulty * 3 },
        { type: 'equipamento', name: `Tesouro do ${monsterTemplates[dungeon.rank].boss.name}`, effect: 'special', value: dungeon.difficulty }
      ],
      materials: allDrops
    };
    
    ganharXp(totalXpWithBonus);
    
    addTimeout(() => {
      setPlayer(prev => {
        // Adicionar materiais ao inventário de materiais
        const newMaterials = [...(prev.materials || [])];
        allDrops.forEach(materialName => {
          const existingMaterial = newMaterials.find(m => m.name === materialName);
          if (existingMaterial) {
            existingMaterial.quantity += 1;
          } else {
            newMaterials.push({ name: materialName, quantity: 1 });
          }
        });

        return {
          ...prev,
          gold: (Number(prev.gold) || 0) + totalGoldWithBonus,
          inventory: [...prev.inventory, ...recompensa.itens],
          materials: newMaterials
        };
      });
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
          {item.effect === 'cura' ? `+${item.value} HP` : 
           item.effect === 'mana' ? `+${item.value} MP` : 
           'Efeito Especial'}
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

  const commonMonstersCount = monsters.filter(m => !m.isBoss).length;
  const currentMonsterNumber = currentMonsterIndex + 1;
  const totalMonsters = monsters.length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ {dungeon?.title}</Text>
      
      <View style={styles.stats}>
        <Text style={styles.statText}>HP: {Number(player.hp) || 0}/{Number(player.maxHp) || 100}</Text>
        <Text style={styles.statText}>MP: {Number(player.mana) || 0}/{Number(player.maxMana) || 50}</Text>
        <Text style={[styles.statText, currentMonster.isBoss && styles.bossText]}>
          {currentMonster.emoji} {currentMonster.name} {currentMonster.isBoss ? '(BOSS)' : ''}
        </Text>
        <Text style={styles.statText}>HP: {Number(currentMonster.currentHp) || 0}/{Number(currentMonster.hp) || 0}</Text>
        <Text style={styles.statText}>
          Progresso: {currentMonsterNumber}/{totalMonsters} 
          ({commonMonstersCount} comuns + 1 boss)
        </Text>
      </View>

      {activeBuffs.length > 0 && (
        <View style={styles.buffsContainer}>
          {activeBuffs.map((buff, index) => (
            <Text key={index} style={styles.buffText}>
              {buff.type === 'attack' ? '⚡' : '🛡️'} {buff.name} ({buff.duration} turnos)
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
          <Text style={styles.resultText}>🎉 Vitória Épica!</Text>
          <Text style={styles.resultSubText}>Derrotou todos os inimigos e o boss!</Text>
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
  bossText: {
    color: '#FFD700',
    fontWeight: 'bold'
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