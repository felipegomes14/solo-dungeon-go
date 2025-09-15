import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';

const EquipmentScreen = ({ player, setPlayer, onClose }) => {
  const [selectedTab, setSelectedTab] = useState('armor');

  // Dados de equipamentos disponíveis (exemplo)
  const equipmentData = {
    armor: [
      { id: 1, name: "Arc Bone Helmet", type: "helmet", atk: 15, def: 25, value: 150 },
      { id: 2, name: "Bone Boots", type: "boots", atk: 5, def: 18, value: 80 },
      { id: 3, name: "Molten Boots", type: "boots", atk: 12, def: 30, value: 200 },
      { id: 4, name: "Moonlit Helm", type: "helmet", atk: 20, def: 35, value: 300 },
      { id: 5, name: "Basic Leggings", type: "leggings", atk: 8, def: 22, value: 120 },
      { id: 6, name: "Vemonfang Breeches", type: "leggings", atk: 25, def: 40, value: 450 },
      { id: 7, name: "Simple Chest Armour", type: "chest", atk: 10, def: 28, value: 180 },
      { id: 8, name: "Dragonbone Helm", type: "helmet", atk: 35, def: 50, value: 600 }
    ],
    accessories: [
      { id: 9, name: "Vampire Heart", type: "amulet", atk: 30, def: 15, value: 350 },
      { id: 10, name: "Molten Bracer", type: "bracer", atk: 18, def: 20, value: 250 },
      { id: 11, name: "Shadowvil Amulet", type: "amulet", atk: 25, def: 25, value: 400 },
      { id: 12, name: "Enchanted Bracer", type: "bracer", atk: 22, def: 18, value: 320 },
      { id: 13, name: "Venomspike Bracer", type: "bracer", atk: 28, def: 22, value: 480 },
      { id: 14, name: "Abyssal Ring", type: "ring", atk: 20, def: 15, value: 300 },
      { id: 15, name: "Thundertide Belt", type: "belt", atk: 15, def: 25, value: 280 }
    ],
    weapons: [
      { id: 16, name: "Bolem Slayer", type: "sword", atk: 45, def: 10, value: 500 },
      { id: 17, name: "Backer Of the Deep", type: "sword", atk: 55, def: 15, value: 700 },
      { id: 18, name: "Backer of the Arcane", type: "staff", atk: 60, def: 5, value: 750 },
      { id: 19, name: "Fallen Angel", type: "sword", atk: 70, def: 20, value: 900 },
      { id: 20, name: "Purple Throwing Knife", type: "dagger", atk: 35, def: 5, value: 400 }
    ]
  };

  const equipItem = (item) => {
    setPlayer(prev => {
      const currentEquipment = prev.equipment || {};
      const inventory = prev.inventory.filter(i => i.id !== item.id);
      
      // Se já tinha item equipado, volta pro inventário
      if (currentEquipment[item.type]) {
        inventory.push(currentEquipment[item.type]);
      }

      return {
        ...prev,
        equipment: {
          ...currentEquipment,
          [item.type]: item
        },
        inventory,
        atk: (prev.atk || 10) + item.atk,
        def: (prev.def || 5) + item.def
      };
    });
  };

  const unequipItem = (itemType) => {
    setPlayer(prev => {
      const currentEquipment = prev.equipment || {};
      const item = currentEquipment[itemType];
      
      if (!item) return prev;

      return {
        ...prev,
        equipment: {
          ...currentEquipment,
          [itemType]: null
        },
        inventory: [...prev.inventory, item],
        atk: Math.max(10, (prev.atk || 10) - item.atk),
        def: Math.max(5, (prev.def || 5) - item.def)
      };
    });
  };

  const calculateTotalStats = () => {
    const equipment = player.equipment || {};
    let totalAtk = 0;
    let totalDef = 0;

    Object.values(equipment).forEach(item => {
      if (item) {
        totalAtk += item.atk;
        totalDef += item.def;
      }
    });

    return { totalAtk, totalDef };
  };

  const { totalAtk, totalDef } = calculateTotalStats();
  const baseAtk = 10;
  const baseDef = 5;

  const renderEquipmentSlot = (type, label) => {
    const equipment = player.equipment || {};
    const item = equipment[type];

    return (
      <View style={styles.equipmentSlot}>
        <Text style={styles.slotLabel}>{label}</Text>
        {item ? (
          <TouchableOpacity 
            style={styles.equippedItem}
            onPress={() => unequipItem(type)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStats}>ATK: +{item.atk} DEF: +{item.def}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptyText}>Vazio</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>EQUIPMENT</Text>
        <Text style={styles.coins}>Coins - {player.gold}</Text>
      </View>

      {/* Status Bonus */}
      <View style={styles.statsBonus}>
        <Text style={styles.bonusText}>ATK +{totalAtk} ({((totalAtk / baseAtk) * 100).toFixed(1)}%)</Text>
        <Text style={styles.bonusText}>DEF +{totalDef} ({((totalDef / baseDef) * 100).toFixed(1)}%)</Text>
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'armor' && styles.activeTab]}
          onPress={() => setSelectedTab('armor')}
        >
          <Text style={styles.tabText}>ARMOUR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'accessories' && styles.activeTab]}
          onPress={() => setSelectedTab('accessories')}
        >
          <Text style={styles.tabText}>ACCESSORIES</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'weapons' && styles.activeTab]}
          onPress={() => setSelectedTab('weapons')}
        >
          <Text style={styles.tabText}>WEAPONS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Equipamentos Equipados */}
        <View style={styles.equippedSection}>
          <Text style={styles.sectionTitle}>EQUIPADO</Text>
          <View style={styles.equipmentGrid}>
            {renderEquipmentSlot('helmet', 'Capacete')}
            {renderEquipmentSlot('chest', 'Peitoral')}
            {renderEquipmentSlot('leggings', 'Calças')}
            {renderEquipmentSlot('boots', 'Botas')}
            {renderEquipmentSlot('weapon', 'Arma')}
            {renderEquipmentSlot('amulet', 'Amuleto')}
            {renderEquipmentSlot('ring', 'Anel')}
            {renderEquipmentSlot('bracer', 'Bracelete')}
            {renderEquipmentSlot('belt', 'Cinto')}
          </View>
        </View>

        {/* Lista de Itens */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>
            {selectedTab.toUpperCase()} DISPONÍVEIS
          </Text>
          <ScrollView style={styles.itemsList}>
            {equipmentData[selectedTab].map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => equipItem(item)}
              >
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemType}>{item.type}</Text>
                <Text style={styles.itemStats}>ATK: +{item.atk} | DEF: +{item.def}</Text>
                <Text style={styles.itemValue}>💰 {item.value} gold</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Botão Voltar */}
      <TouchableOpacity style={styles.returnButton} onPress={onClose}>
        <Text style={styles.returnText}>RETURN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  coins: {
    color: '#323C96',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsBonus: {
    backgroundColor: '#2d2d4d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  bonusText: {
    color: '#00ff88',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2d2d4d',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#323C96',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
  },
  equippedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#00ff88',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  equipmentSlot: {
    width: '48%',
    marginBottom: 15,
  },
  slotLabel: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  equippedItem: {
    backgroundColor: '#323C96',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  emptySlot: {
    backgroundColor: '#2d2d4d',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 12,
  },
  itemsSection: {
    flex: 1,
  },
  itemsList: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#2d2d4d',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#323C96',
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemType: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
  itemStats: {
    color: '#00ff88',
    fontSize: 14,
    marginBottom: 5,
  },
  itemValue: {
    color: '#ffd700',
    fontSize: 12,
  },
  returnButton: {
    backgroundColor: '#323C96',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  returnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EquipmentScreen;