import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';

export default function EquipamentInventory({ player, setPlayer, onClose }) {
  const [selectedTab, setSelectedTab] = useState('inventory');

  // Itens de equipamento em português
  const equipamentData = {
    armor: [
      { id: 1, name: "Elmo de Osso Arcano", type: "capacete", atk: 15, def: 25, value: 150 },
      { id: 2, name: "Botas de Osso", type: "botas", atk: 5, def: 18, value: 80 },
      { id: 3, name: "Botas Derretidas", type: "botas", atk: 12, def: 30, value: 200 },
      { id: 4, name: "Elmo do Luar", type: "capacete", atk: 20, def: 35, value: 300 },
      { id: 5, name: "Calças Básicas", type: "calças", atk: 8, def: 22, value: 120 },
      { id: 6, name: "Calças de Venomfang", type: "calças", atk: 25, def: 40, value: 450 }
    ],
    accessories: [
      { id: 7, name: "Coração de Vampiro", type: "amuleto", atk: 30, def: 15, value: 350 },
      { id: 8, name: "Bracelete Derretido", type: "bracelete", atk: 18, def: 20, value: 250 },
      { id: 9, name: "Amuleto Shadowvil", type: "amuleto", atk: 25, def: 25, value: 400 },
      { id: 10, name: "Bracelete Encantado", type: "bracelete", atk: 22, def: 18, value: 320 }
    ],
    weapons: [
      { id: 11, name: "Matador de Bolem", type: "espada", atk: 45, def: 10, value: 500 },
      { id: 12, name: "Espada das Profundezas", type: "espada", atk: 55, def: 15, value: 700 },
      { id: 13, name: "Cajado Arcano", type: "cajado", atk: 60, def: 5, value: 750 },
      { id: 14, name: "Anjo Caído", type: "espada", atk: 70, def: 20, value: 900 }
    ]
  };

  // Itens de inventário em português
  const inventoryItems = [
    { id: 101, name: "Poção de Cura", type: "poção", effect: "cura", value: 30 },
    { id: 102, name: "Poção de Mana", type: "poção", effect: "mana", value: 20 },
    { id: 103, name: "Pergaminho de Sabedoria", type: "pergaminho", effect: "xp", value: 50 },
    { id: 104, name: "Poção de Força", type: "poção", effect: "ataque", value: 40 }
  ];

  const equipItem = (item) => {
    setPlayer(prev => {
      const currentEquipament = prev.equipament || {};
      const inventory = prev.inventory.filter(i => i.id !== item.id);
      
      // Se já tinha item equipado, volta pro inventário
      if (currentEquipament[item.type]) {
        inventory.push(currentEquipament[item.type]);
      }

      return {
        ...prev,
        equipament: {
          ...currentEquipament,
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
        atk: Math.max(10, (prev.atk || 10) - item.atk),
        def: Math.max(5, (prev.def || 5) - item.def)
      };
    });
  };

  const useItem = (item) => {
    if (item.type === "poção") {
      if (item.effect === "cura") {
        setPlayer(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + item.value),
          inventory: prev.inventory.filter(i => i.id !== item.id)
        }));
      } else if (item.effect === "mana") {
        setPlayer(prev => ({
          ...prev,
          mana: Math.min(prev.maxMana, prev.mana + item.value),
          inventory: prev.inventory.filter(i => i.id !== item.id)
        }));
      }
    }
  };

  const renderEquipamentSlot = (type, label) => {
    const equipament = player.equipament || {};
    const item = equipament[type];

    return (
      <View style={styles.equipamentSlot}>
        <Text style={styles.slotLabel}>{label}</Text>
        {item ? (
          <TouchableOpacity 
            style={styles.equippedItem}
            onPress={() => unequipItem(type)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemStats}>ATQ: +{item.atk} DEF: +{item.def}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptyText}>Vazio</Text>
          </View>
        )}
      </View>
    );
  };

  const renderInventoryItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemType}>Tipo: {item.type}</Text>
      <Text style={styles.itemValue}>Valor: {item.value}</Text>
      
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎒 Inventário & Equipamentos</Text>
      
      <Text style={styles.stats}>
        💰 Ouro: {player.gold} | 🎒 Itens: {player.inventory.length}
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'inventory' && styles.activeTab]}
          onPress={() => setSelectedTab('inventory')}
        >
          <Text style={styles.tabText}>INVENTÁRIO</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'equipamentos' && styles.activeTab]}
          onPress={() => setSelectedTab('equipamentos')}
        >
          <Text style={styles.tabText}>EQUIPAMENTOS</Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'equipamentos' ? (
        <ScrollView>
          <Text style={styles.sectionTitle}>Equipado:</Text>
          <View style={styles.equipamentGrid}>
            {renderEquipamentSlot('capacete', 'Capacete')}
            {renderEquipamentSlot('peitoral', 'Peitoral')}
            {renderEquipamentSlot('calças', 'Calças')}
            {renderEquipamentSlot('botas', 'Botas')}
            {renderEquipamentSlot('espada', 'Arma')}
            {renderEquipamentSlot('amuleto', 'Amuleto')}
            {renderEquipamentSlot('bracelete', 'Bracelete')}
          </View>

          <Text style={styles.sectionTitle}>Equipamentos Disponíveis:</Text>
          <View style={styles.equipamentList}>
            {Object.entries(equipamentData).map(([category, items]) => (
              <View key={category}>
                <Text style={styles.categoryTitle}>
                  {category.toUpperCase()}
                </Text>
                {items.map(item => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.equipamentItem}
                    onPress={() => equipItem(item)}
                  >
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemStats}>ATQ: +{item.atk} DEF: +{item.def}</Text>
                    <Text style={styles.itemValue}>💰 {item.value} ouro</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={player.inventory}
          renderItem={renderInventoryItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <Text style={styles.empty}>Inventário vazio!</Text>
          }
        />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  stats: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555'
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8
  },
  activeTab: {
    backgroundColor: '#007AFF'
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50'
  },
  equipamentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  equipamentSlot: {
    width: '48%',
    marginBottom: 15
  },
  slotLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5
  },
  equippedItem: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#219653'
  },
  emptySlot: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    alignItems: 'center'
  },
  emptyText: {
    color: '#7f8c8d'
  },
  equipamentList: {
    marginBottom: 20
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
    marginTop: 15
  },
  equipamentItem: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2980b9'
  },
  item: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  itemType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5
  },
  itemStats: {
    fontSize: 14,
    color: '#27ae60',
    marginBottom: 5
  },
  itemValue: {
    fontSize: 14,
    color: '#f39c12'
  },
  equipamentButton: {
    backgroundColor: '#27ae60',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5
  },
  useButton: {
    backgroundColor: '#3498db',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  }
});