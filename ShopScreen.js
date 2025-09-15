import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ShopScreen = ({ player, setPlayer, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('daily');

  // Itens da loja
  const shopItems = {
    daily: {
      items: [
        { id: 101, name: "Health Potion", type: "potion", effect: "heal", value: 50, price: 100, emoji: "❤️" },
        { id: 102, name: "Banana", type: "food", effect: "energy", value: 20, price: 50, emoji: "🍌" },
        { id: 103, name: "Health Potion", type: "potion", effect: "heal", value: 50, price: 100, emoji: "❤️" }
      ],
      armor: [
        { id: 201, name: "Seraphic Light", type: "armor", atk: 15, def: 35, price: 1500, emoji: "✨" },
        { id: 202, name: "Spirithound", type: "armor", atk: 20, def: 40, price: 2000, emoji: "🐺" },
        { id: 203, name: "Titan's Wrath", type: "armor", atk: 25, def: 45, price: 2500, emoji: "⚡" }
      ],
      accessories: [
        { id: 301, name: "Bracer of the Ironclad", type: "accessory", atk: 12, def: 18, price: 800, emoji: "🛡️" },
        { id: 302, name: "Frostguard Sash", type: "accessory", atk: 10, def: 22, price: 950, emoji: "❄️" },
        { id: 303, name: "Twilight Glow Studs", type: "accessory", atk: 15, def: 15, price: 700, emoji: "🌟" }
      ],
      weapons: [
        { id: 401, name: "Blime Sheer", type: "weapon", atk: 45, def: 5, price: 3000, emoji: "⚔️" },
        { id: 402, name: "Basic Cutlass", type: "weapon", atk: 35, def: 8, price: 1800, emoji: "🗡️" },
        { id: 403, name: "Death Bringer of the deep", type: "weapon", atk: 60, def: 12, price: 5000, emoji: "💀" }
      ]
    },
    armor: [
      { id: 501, name: "Armor", type: "armor", atk: 10, def: 25, price: 1000, emoji: "🛡️" },
      { id: 502, name: "Breastplate", type: "armor", atk: 12, def: 30, price: 1200, emoji: "🥋" },
      { id: 503, name: "Cuirass", type: "armor", atk: 18, def: 35, price: 1500, emoji: "🔰" }
    ],
    accessories: [
      { id: 601, name: "Bracer", type: "accessory", atk: 8, def: 12, price: 600, emoji: "📿" },
      { id: 602, name: "Amulet", type: "accessory", atk: 15, def: 10, price: 750, emoji: "🔮" },
      { id: 603, name: "Ring", type: "accessory", atk: 10, def: 15, price: 650, emoji: "💍" }
    ],
    weapons: [
      { id: 701, name: "Sword", type: "weapon", atk: 30, def: 5, price: 1500, emoji: "⚔️" },
      { id: 702, name: "Axe", type: "weapon", atk: 40, def: 8, price: 2000, emoji: "🪓" },
      { id: 703, name: "Bow", type: "weapon", atk: 35, def: 3, price: 1700, emoji: "🏹" }
    ]
  };

  const buyItem = (item) => {
    if (player.gold < item.price) {
      Alert.alert("💰 Moedas insuficientes", `Você precisa de ${item.price} moedas!`);
      return;
    }

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - item.price,
      inventory: [...prev.inventory, item]
    }));

    Alert.alert("✅ Compra realizada!", `${item.name} adquirido!`);
  };

  const renderCategoryItems = () => {
    if (selectedCategory === 'daily') {
      return (
        <View style={styles.dailyCategories}>
          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Daily Items:</Text>
            {shopItems.daily.items.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Daily Armour:</Text>
            {shopItems.daily.armor.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Daily Accessories:</Text>
            {shopItems.daily.accessories.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Daily Weapons:</Text>
            {shopItems.daily.weapons.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    return shopItems[selectedCategory].map(item => (
      <TouchableOpacity 
        key={item.id} 
        style={styles.itemCard}
        onPress={() => buyItem(item)}
      >
        <Text style={styles.itemEmoji}>{item.emoji}</Text>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>💰 {item.price}</Text>
        <Text style={styles.itemStats}>
          {item.atk ? `ATK: +${item.atk} ` : ''}
          {item.def ? `DEF: +${item.def}` : ''}
          {item.value ? `EFFECT: +${item.value}` : ''}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>SHOP</Text>
        <View style={styles.currency}>
          <Text style={styles.coins}>Coins = {player.gold}</Text>
          <Text style={styles.gems}>Gems = 0</Text>
        </View>
      </View>

      {/* Abas */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'daily' && styles.activeTab]}
          onPress={() => setSelectedCategory('daily')}
        >
          <Text style={styles.tabText}>DAILY</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'armor' && styles.activeTab]}
          onPress={() => setSelectedCategory('armor')}
        >
          <Text style={styles.tabText}>ARMOR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'accessories' && styles.activeTab]}
          onPress={() => setSelectedCategory('accessories')}
        >
          <Text style={styles.tabText}>ACCESSORIES</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'weapons' && styles.activeTab]}
          onPress={() => setSelectedCategory('weapons')}
        >
          <Text style={styles.tabText}>WEAPONS</Text>
        </TouchableOpacity>
      </View>

      {/* Itens */}
      <ScrollView style={styles.itemsContainer}>
        {selectedCategory === 'daily' ? (
          renderCategoryItems()
        ) : (
          <View style={styles.categoryItems}>
            <Text style={styles.categoryTitle}>
              {selectedCategory.toUpperCase()}:
            </Text>
            {renderCategoryItems()}
          </View>
        )}
      </ScrollView>

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
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currency: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  coins: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  gems: {
    color: '#00BFFF',
    fontSize: 18,
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
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4B0082',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  dailyCategories: {
    gap: 20,
  },
  dailySection: {
    marginBottom: 25,
  },
  dailyTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4B0082',
    paddingBottom: 5,
  },
  categoryItems: {
    gap: 15,
  },
  categoryTitle: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: '#2d2d4d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4B0082',
  },
  itemEmoji: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  itemPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  itemStats: {
    color: '#00ff88',
    fontSize: 12,
    marginTop: 5,
    flexBasis: '100%',
  },
  returnButton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  returnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShopScreen;