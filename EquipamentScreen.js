import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image } from 'react-native';

export default function EquipamentInventory({ player, setPlayer, onClose }) {
  const [selectedTab, setSelectedTab] = useState('equipamentos');

  const equipItem = (item) => {
    setPlayer(prev => {
      const currentEquipament = prev.equipament || {};
      const inventory = [...prev.inventory];
      
      // Se já tinha item equipado, volta pro inventário
      if (currentEquipament[item.type]) {
        inventory.push(currentEquipament[item.type]);
      }

      // Remove o item do inventário
      const itemIndex = inventory.findIndex(i => i.id === item.id);
      if (itemIndex !== -1) {
        inventory.splice(itemIndex, 1);
      }

      return {
        ...prev,
        equipament: {
          ...currentEquipament,
          [item.type]: item
        },
        inventory,
        atk: (prev.atk || 10) + (item.atk || 0),
        def: (prev.def || 5) + (item.def || 0)
      };
    });
  };

  const unequipItem = (itemType) => {
    setPlayer(prev => {
      const currentEquipament = prev.equipament || {};
      const item = currentEquipament[itemType];
      
      if (!item) return prev;

      return {
        ...prev,
        equipament: {
          ...currentEquipament,
          [itemType]: null
        },
        inventory: [...prev.inventory, item],
        atk: Math.max(10, (prev.atk || 10) - (item.atk || 0)),
        def: Math.max(5, (prev.def || 5) - (item.def || 0))
      };
    });
  };

  const useItem = (item) => {
    setPlayer(prev => {
      let updatedPlayer = { ...prev };
      
      if (item.type === "poção") {
        if (item.effect === "cura") {
          updatedPlayer.hp = Math.min(prev.maxHp, prev.hp + item.value);
        } else if (item.effect === "mana") {
          updatedPlayer.mana = Math.min(prev.maxMana, prev.mana + item.value);
        } else if (item.effect === "ataque") {
          // Poção de força - efeito temporário (não implementado)
          updatedPlayer.atk = prev.atk + item.value;
        }
      } else if (item.type === "pergaminho" && item.effect === "xp") {
        updatedPlayer.xp = prev.xp + item.value;
        // Verificar level up
        if (updatedPlayer.xp >= updatedPlayer.level * 100) {
          updatedPlayer.level += 1;
          updatedPlayer.xp = 0;
          updatedPlayer.maxHp += 20;
          updatedPlayer.hp = updatedPlayer.maxHp;
          updatedPlayer.maxMana += 10;
          updatedPlayer.mana = updatedPlayer.maxMana;
          updatedPlayer.atk += 5;
          updatedPlayer.def += 2;
        }
      }
      
      // Remove o item usado do inventário
      updatedPlayer.inventory = prev.inventory.filter(i => i.id !== item.id);
      
      return updatedPlayer;
    });
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'capacete': return '🪖';
      case 'peitoral': return '🛡️';
      case 'calças': return '👖';
      case 'botas': return '👢';
      case 'espada': return '⚔️';
      case 'cajado': return '🪄';
      case 'amuleto': return '📿';
      case 'bracelete': return '💍';
      case 'poção': return '🧪';
      case 'pergaminho': return '📜';
      default: return '🎒';
    }
  };

  const renderEquipamentSlot = (type, label) => {
    const equipament = player.equipament || {};
    const item = equipament[type];

    return (
      <View style={styles.equipamentSlot}>
        <Text style={styles.slotLabel}>{getItemIcon(type)} {label}</Text>
        {item ? (
          <TouchableOpacity 
            style={styles.equippedItem}
            onPress={() => unequipItem(type)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>
            <Text style={styles.unequipText}>Clique para desequipar</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptyText}>Vazio</Text>
            <Text style={styles.emptySubtext}>Equipe um item {label.toLowerCase()}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderInventoryItem = ({ item }) => (
    <View style={[styles.item, !item.atk && styles.consumableItem]}>
      <Text style={styles.itemIcon}>{getItemIcon(item.type)}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
        {item.atk && <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>}
        {item.effect && <Text style={styles.itemEffect}>Efeito: {getEffectName(item.effect)} +{item.value}</Text>}
      </View>
      
      {item.atk ? (
        <TouchableOpacity 
          style={styles.equipButton}
          onPress={() => equipItem(item)}
        >
          <Text style={styles.buttonText}>Equipar</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={styles.useButton}
          onPress={() => useItem(item)}
        >
          <Text style={styles.buttonText}>Usar</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getEffectName = (effect) => {
    switch (effect) {
      case 'cura': return 'Vida';
      case 'mana': return 'Mana';
      case 'ataque': return 'Ataque';
      case 'xp': return 'Experiência';
      default: return effect;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎒 INVENTÁRIO</Text>
        <Text style={styles.stats}>
          ⚔️ {player.atk}  🛡️ {player.def}  💰 {player.gold}  🎒 {player.inventory.length}
        </Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'inventory' && styles.activeTab]}
          onPress={() => setSelectedTab('inventory')}
        >
          <Text style={[styles.tabText, selectedTab === 'inventory' && styles.activeTabText]}>CONSUMÍVEIS</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'equipamentos' && styles.activeTab]}
          onPress={() => setSelectedTab('equipamentos')}
        >
          <Text style={[styles.tabText, selectedTab === 'equipamentos' && styles.activeTabText]}>EQUIPAMENTOS</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'equipamentos' ? (
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>EQUIPAMENTOS EQUIPADOS</Text>
          <View style={styles.equipamentGrid}>
            <View style={styles.equipamentColumn}>
              {renderEquipamentSlot('capacete', 'Capacete')}
              {renderEquipamentSlot('peitoral', 'Peitoral')}
              {renderEquipamentSlot('calças', 'Calças')}
              {renderEquipamentSlot('botas', 'Botas')}
            </View>
            <View style={styles.equipamentColumn}>
              {renderEquipamentSlot('espada', 'Arma')}
              {renderEquipamentSlot('amuleto', 'Amuleto')}
              {renderEquipamentSlot('bracelete', 'Bracelete')}
              <View style={styles.playerStats}>
                <Text style={styles.statsTitle}>ATRIBUTOS</Text>
                <Text style={styles.stat}>⚔️ Ataque: {player.atk}</Text>
                <Text style={styles.stat}>🛡️ Defesa: {player.def}</Text>
                <Text style={styles.stat}>❤️ Vida: {player.hp}/{player.maxHp}</Text>
                <Text style={styles.stat}>🔵 Mana: {player.mana}/{player.maxMana}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>SEUS EQUIPAMENTOS</Text>
          <FlatList
            data={player.inventory.filter(item => item.atk)}
            renderItem={({ item }) => (
              <View style={styles.equipItem}>
                <Text style={styles.itemIcon}>{getItemIcon(item.type)}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemType}>{item.type}</Text>
                  <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.equipButton}
                  onPress={() => equipItem(item)}
                >
                  <Text style={styles.buttonText}>Equipar</Text>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.empty}>Nenhum equipamento no inventário!</Text>
            }
          />
        </ScrollView>
      ) : (
        <FlatList
          style={styles.content}
          data={player.inventory.filter(item => !item.atk)}
          renderItem={renderInventoryItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.empty}>Nenhum item consumível no inventário!</Text>
              <Text style={styles.emptySubtext}>Visite a loja para adquirir itens</Text>
            </View>
          }
        />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕ FECHAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 15,
  },
  header: {
    backgroundColor: 'rgba(34, 40, 75, 0.8)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4cc9f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: '#4cc9f0',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  stats: {
    fontSize: 14,
    textAlign: 'center',
    color: '#a0a0c0',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: 'rgba(34, 40, 75, 0.6)',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#4cc9f0',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4361ee',
  },
  tabText: {
    fontWeight: 'bold',
    color: '#a0a0c0',
    fontSize: 12,
  },
  activeTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#4cc9f0',
    textAlign: 'center',
    backgroundColor: 'rgba(34, 40, 75, 0.5)',
    padding: 8,
    borderRadius: 8,
  },
  equipamentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  equipamentColumn: {
    width: '48%',
  },
  equipamentSlot: {
    marginBottom: 12,
  },
  slotLabel: {
    color: '#ffffff',
    fontSize: 12,
    marginBottom: 5,
    fontWeight: '600',
  },
  equippedItem: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#2ecc71',
  },
  emptySlot: {
    backgroundColor: 'rgba(108, 122, 137, 0.2)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6c7a89',
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  emptyText: {
    color: '#a0a0c0',
    fontWeight: 'bold',
  },
  emptySubtext: {
    color: '#6c7a89',
    fontSize: 10,
    marginTop: 4,
  },
  unequipText: {
    color: '#e74c3c',
    fontSize: 10,
    marginTop: 5,
    fontStyle: 'italic',
  },
  item: {
    backgroundColor: 'rgba(34, 40, 75, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4cc9f0',
  },
  consumableItem: {
    borderColor: '#9b59b6',
  },
  itemIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  itemType: {
    fontSize: 12,
    color: '#a0a0c0',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemStats: {
    fontSize: 12,
    color: '#2ecc71',
    marginBottom: 2,
  },
  itemEffect: {
    fontSize: 11,
    color: '#9b59b6',
  },
  equipItem: {
    backgroundColor: 'rgba(34, 40, 75, 0.6)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4cc9f0',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  equipButton: {
    backgroundColor: '#4361ee',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  useButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  playerStats: {
    backgroundColor: 'rgba(34, 40, 75, 0.8)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4cc9f0',
    marginTop: 10,
  },
  statsTitle: {
    color: '#4cc9f0',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  stat: {
    color: '#ffffff',
    marginBottom: 5,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 30,
  },
  empty: {
    textAlign: 'center',
    color: '#a0a0c0',
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});