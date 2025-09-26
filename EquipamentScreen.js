import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet, Animated, Easing } from "react-native";

const EquipamentScreen = ({ player, setPlayer, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('equipamentos');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Categorias de itens
  const itemCategories = {
    capacete: ['capacete', 'elmo', 'coroa'],
    peitoral: ['peitoral', 'armadura', 'túnica'],
    calças: ['calças', 'calça', 'perneiras'],
    botas: ['botas', 'bota', 'sapatos'],
    espada: ['espada', 'arma', 'arco', 'cajado', 'machado'],
    amuleto: ['amuleto', 'pingente', 'colar'],
    bracelete: ['bracelete', 'braçadeira', 'pulseira']
  };

  // Função para agrupar itens iguais no inventário - SIMPLIFICADA
  const getGroupedInventory = () => {
    const groupedItems = {};
    
    player.inventory.forEach(item => {
      // Chave simplificada: agrupa apenas por nome e tipo (ignora origem, ID, etc)
      const key = `${item.name}-${item.type}`.toLowerCase();
      
      if (!groupedItems[key]) {
        groupedItems[key] = {
          ...item,
          quantity: 1,
          ids: [item.id]
        };
      } else {
        groupedItems[key].quantity += 1;
        groupedItems[key].ids.push(item.id);
        
        // Mantém o maior valor de efeito se houver diferenças
        if (item.value > (groupedItems[key].value || 0)) {
          groupedItems[key].value = item.value;
        }
        
        // Combina bônus se houver diferenças
        if (item.bonus) {
          if (!groupedItems[key].bonus) {
            groupedItems[key].bonus = { ...item.bonus };
          } else {
            Object.keys(item.bonus).forEach(stat => {
              groupedItems[key].bonus[stat] = Math.max(
                groupedItems[key].bonus[stat] || 0,
                item.bonus[stat]
              );
            });
          }
        }
      }
    });
    
    return Object.values(groupedItems);
  };

  const groupedInventory = getGroupedInventory();

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();
  };

  // Função para equipar item
  const equipItem = (groupedItem) => {
    const itemToEquip = player.inventory.find(item => item.id === groupedItem.ids[0]);
    
    if (!itemToEquip) {
      Alert.alert("❌ Erro", "Item não encontrado no inventário!");
      return;
    }

    const slot = Object.keys(itemCategories).find(key => 
      itemCategories[key].includes(itemToEquip.type.toLowerCase())
    );

    if (!slot) {
      Alert.alert("❌ Erro", "Este item não pode ser equipado em nenhum slot!");
      return;
    }

    animateButton();

    setPlayer(prev => {
      const currentEquipament = { ...prev.equipament };
      const currentInventory = [...prev.inventory];
      
      // Remove o item do inventário
      const itemIndex = currentInventory.findIndex(invItem => invItem.id === itemToEquip.id);
      if (itemIndex !== -1) {
        currentInventory.splice(itemIndex, 1);
      }

      // Se já tinha item equipado, volta pro inventário
      if (currentEquipament[slot]) {
        currentInventory.push(currentEquipament[slot]);
      }

      // Equipa o novo item
      currentEquipament[slot] = itemToEquip;

      // Aplica os bônus do item
      const newStats = {
        hp: prev.hp,
        maxHp: prev.maxHp,
        mana: prev.mana,
        maxMana: prev.maxMana,
        atk: prev.atk,
        def: prev.def
      };

      // Adiciona bônus do novo item
      if (itemToEquip.bonus) {
        Object.keys(itemToEquip.bonus).forEach(stat => {
          newStats[stat] += itemToEquip.bonus[stat];
          if (stat === 'maxHp') newStats.maxHp += itemToEquip.bonus[stat];
          if (stat === 'maxMana') newStats.maxMana += itemToEquip.bonus[stat];
        });
        
        // Ajusta HP e Mana atuais se necessário
        if (itemToEquip.bonus.maxHp) newStats.hp += itemToEquip.bonus.maxHp;
        if (itemToEquip.bonus.maxMana) newStats.mana += itemToEquip.bonus.maxMana;
      }

      // Remove bônus do item anterior (se existia)
      if (prev.equipament[slot] && prev.equipament[slot].bonus) {
        Object.keys(prev.equipament[slot].bonus).forEach(stat => {
          newStats[stat] -= prev.equipament[slot].bonus[stat];
          if (stat === 'maxHp') {
            newStats.maxHp -= prev.equipament[slot].bonus[stat];
            newStats.hp = Math.max(1, newStats.hp - prev.equipament[slot].bonus[stat]);
          }
          if (stat === 'maxMana') {
            newStats.maxMana -= prev.equipament[slot].bonus[stat];
            newStats.mana = Math.max(0, newStats.mana - prev.equipament[slot].bonus[stat]);
          }
        });
      }

      return {
        ...prev,
        equipament: currentEquipament,
        inventory: currentInventory,
        ...newStats
      };
    });

    setShowItemModal(false);
    Alert.alert("✅ Sucesso", `${itemToEquip.name} equipado!`);
  };

  // Função para usar item consumível - USA O MELHOR VALOR DO GRUPO
  const useConsumableItem = (groupedItem) => {
    // Encontra o item com o melhor valor no grupo
    let bestItem = groupedItem;
    let bestValue = groupedItem.value || 0;
    
    // Procura pelo item com o maior valor de efeito no inventário real
    groupedItem.ids.forEach(id => {
      const item = player.inventory.find(invItem => invItem.id === id);
      if (item && item.value > bestValue) {
        bestItem = item;
        bestValue = item.value;
      }
    });

    const itemToUse = player.inventory.find(item => item.id === bestItem.ids[0]);
    
    if (!itemToUse) {
      Alert.alert("❌ Erro", "Item não encontrado no inventário!");
      return;
    }

    animateButton();

    setPlayer(prev => {
      const currentInventory = [...prev.inventory];
      
      // Remove o item usado do inventário (usa o ID correto)
      const itemIndex = currentInventory.findIndex(invItem => invItem.id === itemToUse.id);
      if (itemIndex !== -1) {
        currentInventory.splice(itemIndex, 1);
      }

      // Aplica o efeito do item usando o melhor valor encontrado
      const newStats = { ...prev };
      const effectValue = bestItem.value || itemToUse.value;

      if (itemToUse.effect === 'cura' && effectValue) {
        const healAmount = effectValue;
        newStats.hp = Math.min(prev.maxHp, prev.hp + healAmount);
      } else if (itemToUse.effect === 'mana' && effectValue) {
        const manaAmount = effectValue;
        newStats.mana = Math.min(prev.maxMana, prev.mana + manaAmount);
      }

      return {
        ...prev,
        inventory: currentInventory,
        ...newStats
      };
    });

    setShowItemModal(false);
    
    let message = "";
    const effectValue = bestItem.value || itemToUse.value;
    
    if (itemToUse.effect === 'cura') {
      message = `❤️ +${effectValue} Vida restaurada!`;
    } else if (itemToUse.effect === 'mana') {
      message = `🔵 +${effectValue} Mana restaurada!`;
    }
    
    Alert.alert("✅ Item Usado", message);
  };

  // Função para desequipar item
  const unequipItem = (slot) => {
    if (!player.equipament[slot]) return;

    animateButton();

    setPlayer(prev => {
      const currentEquipament = { ...prev.equipament };
      const currentInventory = [...prev.inventory];
      const item = currentEquipament[slot];

      // Remove o item do slot
      currentInventory.push(item);
      delete currentEquipament[slot];

      // Remove os bônus do item
      const newStats = {
        hp: prev.hp,
        maxHp: prev.maxHp,
        mana: prev.mana,
        maxMana: prev.maxMana,
        atk: prev.atk,
        def: prev.def
      };

      if (item.bonus) {
        Object.keys(item.bonus).forEach(stat => {
          newStats[stat] -= item.bonus[stat];
          if (stat === 'maxHp') {
            newStats.maxHp -= item.bonus[stat];
            newStats.hp = Math.max(1, newStats.hp - item.bonus[stat]);
          }
          if (stat === 'maxMana') {
            newStats.maxMana -= item.bonus[stat];
            newStats.mana = Math.max(0, newStats.mana - item.bonus[stat]);
          }
        });
      }

      return {
        ...prev,
        equipament: currentEquipament,
        inventory: currentInventory,
        ...newStats
      };
    });

    Alert.alert("✅ Item desequipado!", "Item movido para o inventário.");
  };

  const getRarityColor = (item) => {
    if (!item || !item.bonus) return '#95a5a6';
    
    const totalBonus = Object.values(item.bonus).reduce((sum, val) => sum + val, 0);
    if (totalBonus > 80) return '#f39c12';
    if (totalBonus > 50) return '#9b59b6';
    if (totalBonus > 30) return '#3498db';
    return '#95a5a6';
  };

  const getRarityName = (item) => {
    if (!item || !item.bonus) return 'Comum';
    
    const totalBonus = Object.values(item.bonus).reduce((sum, val) => sum + val, 0);
    if (totalBonus > 80) return 'Lendário';
    if (totalBonus > 50) return 'Épico';
    if (totalBonus > 30) return 'Raro';
    return 'Comum';
  };

  // Renderizar slot de equipamento
  const renderEquipamentSlot = (slot, label, emoji) => {
    const item = player.equipament[slot];
    const rarityColor = item ? getRarityColor(item) : '#4B0082';
    
    return (
      <Animated.View 
        style={[
          styles.equipamentSlot,
          item && { borderLeftColor: rarityColor },
          !item && styles.emptySlotStyle
        ]}
      >
        <View style={styles.slotHeader}>
          <Text style={styles.slotEmoji}>{emoji}</Text>
          <Text style={styles.slotLabel}>{label}</Text>
        </View>
        
        {item ? (
          <TouchableOpacity 
            style={styles.itemContent}
            onPress={() => unequipItem(slot)}
            onLongPress={() => setSelectedItem({...item, quantity: 1})}
          >
            <Text style={[styles.itemName, { color: rarityColor }]}>
              {item.name}
            </Text>
            <Text style={styles.itemRarity}>{getRarityName(item)}</Text>
            
            {item.bonus && (
              <View style={styles.bonusesContainer}>
                {Object.entries(item.bonus).map(([stat, value]) => (
                  <View key={stat} style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>
                      {getStatIcon(stat)}+{value}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <Text style={styles.unequipText}>Tocar para desequipar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyContent}>
            <Text style={styles.emptySlot}>Slot Vazio</Text>
            <Text style={styles.emptySubtext}>Equipe um item {label.toLowerCase()}</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  // Helper functions
  const getStatIcon = (stat) => {
    const icons = {
      atk: '⚔️',
      def: '🛡️',
      maxHp: '❤️',
      maxMana: '🔵',
      hp: '❤️',
      mana: '🔵'
    };
    return icons[stat] || '✨';
  };

  const getStatName = (stat) => {
    const names = {
      atk: 'ATQ',
      def: 'DEF',
      maxHp: 'Vida Máx',
      maxMana: 'Mana Máx',
      hp: 'Vida',
      mana: 'Mana'
    };
    return names[stat] || stat;
  };

  // Determina se um item é equipável
  const isEquipable = (item) => {
    return Object.keys(itemCategories).some(key => 
      itemCategories[key].includes(item.type.toLowerCase())
    );
  };

  // Renderizar item do inventário (agrupado)
  const renderInventoryItem = (groupedItem, index) => {
    const rarityColor = getRarityColor(groupedItem);
    const isEquipableItem = isEquipable(groupedItem);

    return (
      <TouchableOpacity
        key={index}
        style={[styles.inventoryItem, { borderLeftColor: rarityColor }]}
        onPress={() => {
          setSelectedItem(groupedItem);
          setShowItemModal(true);
        }}
      >
        <View style={styles.inventoryHeader}>
          <Text style={styles.itemEmoji}>{groupedItem.emoji || '📦'}</Text>
          <View style={styles.inventoryInfo}>
            <Text style={[styles.itemName, { color: rarityColor }]}>
              {groupedItem.name}
              {groupedItem.quantity > 1 && (
                <Text style={styles.quantityBadge}> ×{groupedItem.quantity}</Text>
              )}
            </Text>
            <Text style={styles.itemType}>
              {groupedItem.type} • {getRarityName(groupedItem)}
              {isEquipableItem ? ' • ⚔️ Equipável' : ' • 🧪 Consumível'}
            </Text>
          </View>
        </View>

        {groupedItem.bonus && (
          <View style={styles.bonusesContainer}>
            {Object.entries(groupedItem.bonus).map(([stat, value]) => (
              <View key={stat} style={styles.bonusBadge}>
                <Text style={styles.bonusText}>
                  {getStatIcon(stat)}+{value} {getStatName(stat)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {groupedItem.value && (
          <View style={styles.effectBadge}>
            <Text style={styles.effectText}>
              {groupedItem.effect === 'cura' ? '❤️ +' + groupedItem.value + ' Vida' : ''}
              {groupedItem.effect === 'mana' ? '🔵 +' + groupedItem.value + ' Mana' : ''}
              {groupedItem.effect === 'buff_atk' ? '⚔️ +' + ((groupedItem.value - 1) * 100) + '% Ataque' : ''}
            </Text>
          </View>
        )}

        <Text style={isEquipableItem ? styles.equipText : styles.useText}>
          {isEquipableItem ? 'Tocar para equipar' : 'Tocar para usar'}
        </Text>
      </TouchableOpacity>
    );
  };

  const totalBonus = () => {
    let bonus = { atk: 0, def: 0, maxHp: 0, maxMana: 0 };
    Object.values(player.equipament).forEach(item => {
      if (item && item.bonus) {
        Object.entries(item.bonus).forEach(([stat, value]) => {
          bonus[stat] += value;
        });
      }
    });
    return bonus;
  };

  const equippedBonus = totalBonus();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🎒 INVENTÁRIO</Text>
          <Text style={styles.subtitle}>
            {selectedTab === 'inventario' ? 
              `${groupedInventory.length} tipos de itens (${player.inventory.length} total)` : 
              'Gerenciar Equipamentos'
            }
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'equipamentos' && styles.activeTab]}
            onPress={() => setSelectedTab('equipamentos')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'equipamentos' && styles.activeTabText
            ]}>
              EQUIPAMENTOS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, selectedTab === 'inventario' && styles.activeTab]}
            onPress={() => setSelectedTab('inventario')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'inventario' && styles.activeTabText
            ]}>
              INVENTÁRIO ({groupedInventory.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {selectedTab === 'equipamentos' ? (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>EQUIPAMENTOS EQUIPADOS</Text>
          
          <View style={styles.equipamentGrid}>
            {/* Coluna 1 */}
            <View style={styles.equipamentColumn}>
              {renderEquipamentSlot('capacete', 'Capacete', '⛑️')}
              {renderEquipamentSlot('peitoral', 'Peitoral', '🥋')}
              {renderEquipamentSlot('calças', 'Calças', '👖')}
              {renderEquipamentSlot('botas', 'Botas', '👢')}
            </View>
            
            {/* Coluna 2 */}
            <View style={styles.equipamentColumn}>
              {renderEquipamentSlot('espada', 'Arma', '⚔️')}
              {renderEquipamentSlot('amuleto', 'Amuleto', '🔮')}
              {renderEquipamentSlot('bracelete', 'Bracelete', '📿')}
              
              {/* Status do Jogador */}
              <View style={styles.playerStats}>
                <Text style={styles.statsTitle}>📊 ATRIBUTOS DO PERSONAGEM</Text>
                
                <View style={styles.statRow}>
                  <Text style={styles.statIcon}>⚔️</Text>
                  <Text style={styles.statLabel}>Ataque:</Text>
                  <Text style={styles.statValue}>{player.atk}</Text>
                  {equippedBonus.atk > 0 && (
                    <Text style={styles.statBonus}>+{equippedBonus.atk}</Text>
                  )}
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statIcon}>🛡️</Text>
                  <Text style={styles.statLabel}>Defesa:</Text>
                  <Text style={styles.statValue}>{player.def}</Text>
                  {equippedBonus.def > 0 && (
                    <Text style={styles.statBonus}>+{equippedBonus.def}</Text>
                  )}
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statIcon}>❤️</Text>
                  <Text style={styles.statLabel}>Vida:</Text>
                  <Text style={styles.statValue}>{player.hp}/{player.maxHp}</Text>
                  {equippedBonus.maxHp > 0 && (
                    <Text style={styles.statBonus}>+{equippedBonus.maxHp}</Text>
                  )}
                </View>
                
                <View style={styles.statRow}>
                  <Text style={styles.statIcon}>🔵</Text>
                  <Text style={styles.statLabel}>Mana:</Text>
                  <Text style={styles.statValue}>{player.mana}/{player.maxMana}</Text>
                  {equippedBonus.maxMana > 0 && (
                    <Text style={styles.statBonus}>+{equippedBonus.maxMana}</Text>
                  )}
                </View>
                
                <View style={styles.totalBonus}>
                  <Text style={styles.totalBonusText}>
                    Bônus Total: +{Object.values(equippedBonus).reduce((a, b) => a + b, 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>
            ITENS DO INVENTÁRIO ({player.inventory.length} itens totais)
          </Text>
          
          {groupedInventory.length === 0 ? (
            <View style={styles.emptyInventory}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyText}>Inventário vazio!</Text>
              <Text style={styles.emptySubtext}>Visite a loja para adquirir itens</Text>
            </View>
          ) : (
            <View style={styles.inventoryGrid}>
              {groupedInventory.map((item, index) => renderInventoryItem(item, index))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal de Item */}
      <Modal visible={showItemModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalEmoji}>{selectedItem.emoji || '📦'}</Text>
                  <View>
                    <Text style={[styles.modalTitle, { color: getRarityColor(selectedItem) }]}>
                      {selectedItem.name}
                      {selectedItem.quantity > 1 && (
                        <Text style={styles.modalQuantity}> ×{selectedItem.quantity}</Text>
                      )}
                    </Text>
                    <Text style={styles.modalType}>
                      {selectedItem.type} • {getRarityName(selectedItem)}
                      {isEquipable(selectedItem) ? ' • ⚔️ Equipável' : ' • 🧪 Consumível'}
                    </Text>
                  </View>
                </View>

                {selectedItem.bonus && (
                  <View style={styles.modalBonuses}>
                    <Text style={styles.bonusTitle}>🎯 BÔNUS:</Text>
                    {Object.entries(selectedItem.bonus).map(([stat, value]) => (
                      <View key={stat} style={styles.modalBonusRow}>
                        <Text style={styles.modalBonusIcon}>{getStatIcon(stat)}</Text>
                        <Text style={styles.modalBonusText}>+{value} {getStatName(stat)}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {selectedItem.value && (
                  <View style={styles.modalEffect}>
                    <Text style={styles.effectTitle}>✨ EFEITO:</Text>
                    <Text style={styles.effectText}>
                      {selectedItem.effect === 'cura' ? 'Restaura ' + selectedItem.value + ' de Vida' : ''}
                      {selectedItem.effect === 'mana' ? 'Restaura ' + selectedItem.value + ' de Mana' : ''}
                      {selectedItem.effect === 'buff_atk' ? 'Aumenta ataque em ' + ((selectedItem.value - 1) * 100) + '% por 3 turnos' : ''}
                    </Text>
                  </View>
                )}

                <View style={styles.modalButtons}>
                  {isEquipable(selectedItem) ? (
                    <TouchableOpacity 
                      style={styles.equipButton}
                      onPress={() => equipItem(selectedItem)}
                    >
                      <Text style={styles.buttonText}>✅ EQUIPAR</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.useButton}
                      onPress={() => useConsumableItem(selectedItem)}
                    >
                      <Text style={styles.buttonText}>🧪 USAR ITEM</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowItemModal(false)}
                  >
                    <Text style={styles.buttonText}>❌ CANCELAR</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f0f1f' 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    borderBottomWidth: 2,
    borderBottomColor: '#4B0082',
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    color: '#00BFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: { 
    padding: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e74c3c'
  },
  closeText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  tabsContainer: {
    backgroundColor: 'rgba(45, 45, 77, 0.6)',
    padding: 3,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#4B0082',
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 6,
  },
  tabText: {
    color: '#BDC3C7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeTabText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 255, 136, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  equipamentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  equipamentColumn: {
    width: '48%',
    gap: 12,
  },
  equipamentSlot: {
    backgroundColor: 'rgba(45, 45, 77, 0.7)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  emptySlotStyle: {
    borderLeftColor: '#4B0082',
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  slotEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  slotLabel: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemRarity: {
    color: '#95a5a6',
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 8,
  },
  bonusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  bonusBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  bonusText: {
    color: '#2ecc71',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unequipText: {
    color: '#e74c3c',
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 4,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlot: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 10,
    marginTop: 2,
  },
  playerStats: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  statsTitle: {
    color: '#f39c12',
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  statIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  statLabel: {
    color: '#BDC3C7',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  statBonus: {
    color: '#2ecc71',
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalBonus: {
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalBonusText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inventoryGrid: {
    gap: 12,
  },
  inventoryItem: {
    backgroundColor: 'rgba(45, 45, 77, 0.7)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  inventoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  inventoryInfo: {
    flex: 1,
  },
  itemType: {
    color: '#95a5a6',
    fontSize: 11,
    fontWeight: '500',
  },
  quantityBadge: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 6,
    borderRadius: 8,
    marginLeft: 4,
  },
  effectBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  effectText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  equipText: {
    color: '#3498db',
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  useText: {
    color: '#9b59b6',
    fontSize: 10,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },
  emptyInventory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(45, 45, 77, 0.5)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4B0082',
    borderStyle: 'dashed',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#BDC3C7',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#95a5a6',
    fontSize: 12,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalContent: {
    backgroundColor: '#2d2d4d',
    padding: 24,
    borderRadius: 20,
    width: '85%',
    borderWidth: 2,
    borderColor: '#4B0082',
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  modalQuantity: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalType: {
    color: '#95a5a6',
    fontSize: 12,
  },
  modalBonuses: {
    marginBottom: 16,
  },
  bonusTitle: {
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 14,
  },
  modalBonusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 8,
  },
  modalBonusIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 24,
  },
  modalBonusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalEffect: {
    marginBottom: 24,
  },
  effectTitle: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  equipButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  useButton: {
    flex: 1,
    backgroundColor: '#9b59b6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8e44ad',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default EquipamentScreen;