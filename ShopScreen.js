import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const ShopScreen = ({ player, setPlayer, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('daily');

  // Itens da loja
  const shopItems = {
    daily: {
      items: [
        { id: 101, name: "Poção de Vida", type: "potion", effect: "heal", value: 50, price: 100, emoji: "❤️" },
        { id: 102, name: "Banana", type: "food", effect: "energy", value: 20, price: 50, emoji: "🍌" },
        { id: 103, name: "Poção de Mana", type: "potion", effect: "mana", value: 30, price: 120, emoji: "🔵" }
      ],
      armors: [
        { id: 201, name: "Luz Serafim", type: "armor", atk: 15, def: 35, price: 1500, emoji: "✨" },
        { id: 202, name: "Espírito Lobo", type: "armor", atk: 20, def: 40, price: 2000, emoji: "🐺" },
        { id: 203, name: "Fúria do Titã", type: "armor", atk: 25, def: 45, price: 2500, emoji: "⚡" }
      ],
      accessories: [
        { id: 301, name: "Bracelete de Ferro", type: "accessory", atk: 12, def: 18, price: 800, emoji: "🛡️" },
        { id: 302, name: "Cinto Gélido", type: "accessory", atk: 10, def: 22, price: 950, emoji: "❄️" },
        { id: 303, name: "Brincos do Crepúsculo", type: "accessory", atk: 15, def: 15, price: 700, emoji: "🌟" }
      ],
      weapons: [
        { id: 401, name: "Lâmina Brilhante", type: "weapon", atk: 45, def: 5, price: 3000, emoji: "⚔️" },
        { id: 402, name: "Cutelo Básico", type: "weapon", atk: 35, def: 8, price: 1800, emoji: "🗡️" },
        { id: 403, name: "Ceifador das Profundezas", type: "weapon", atk: 60, def: 12, price: 5000, emoji: "💀" }
      ]
    },
    armors: [
      { id: 501, name: "Armadura de Couro", type: "armor", atk: 10, def: 25, price: 1000, emoji: "🛡️" },
      { id: 502, name: "Peitoral de Aço", type: "armor", atk: 12, def: 30, price: 1200, emoji: "🥋" },
      { id: 503, name: "Couraça Divina", type: "armor", atk: 18, def: 35, price: 1500, emoji: "🔰" }
    ],
    accessories: [
      { id: 601, name: "Bracelete Mágico", type: "accessory", atk: 8, def: 12, price: 600, emoji: "📿" },
      { id: 602, name: "Amuleto Antigo", type: "accessory", atk: 15, def: 10, price: 750, emoji: "🔮" },
      { id: 603, name: "Anel do Poder", type: "accessory", atk: 10, def: 15, price: 650, emoji: "💍" }
    ],
    weapons: [
      { id: 701, name: "Espada Longa", type: "weapon", atk: 30, def: 5, price: 1500, emoji: "⚔️" },
      { id: 702, name: "Machado de Guerra", type: "weapon", atk: 40, def: 8, price: 2000, emoji: "🪓" },
      { id: 703, name: "Arco Élfico", type: "weapon", atk: 35, def: 3, price: 1700, emoji: "🏹" }
    ]
  };

  const buyItem = (item) => {
    if (player.gold < item.price) {
      Alert.alert("💰 Ouro Insuficiente", `Você precisa de ${item.price} moedas de ouro!`);
      return;
    }

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - item.price,
      inventory: [...prev.inventory, item]
    }));

    Alert.alert("✅ Compra Realizada!", `${item.name} adquirido com sucesso!`);
  };

  const renderCategoryItems = () => {
    if (selectedCategory === 'daily') {
      return (
        <View style={styles.dailyCategories}>
          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Itens Diários:</Text>
            {shopItems.daily.items.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemEffect}>
                    {item.effect === 'heal' ? '❤️ +' + item.value + ' Vida' : ''}
                    {item.effect === 'mana' ? '🔵 +' + item.value + ' Mana' : ''}
                    {item.effect === 'energy' ? '⚡ +' + item.value + ' Energia' : ''}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Armaduras Diárias:</Text>
            {shopItems.daily.armors.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>
                </View>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Acessórios Diários:</Text>
            {shopItems.daily.accessories.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>
                </View>
                <Text style={styles.itemPrice}>💰 {item.price}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.dailySection}>
            <Text style={styles.dailyTitle}>Armas Diárias:</Text>
            {shopItems.daily.weapons.map(item => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.itemCard}
                onPress={() => buyItem(item)}
              >
                <Text style={styles.itemEmoji}>{item.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStats}>⚔️ +{item.atk} 🛡️ +{item.def}</Text>
                </View>
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
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemStats}>
            {item.atk ? `⚔️ +${item.atk} ` : ''}
            {item.def ? `🛡️ +${item.def}` : ''}
            {item.value ? `✨ +${item.value}` : ''}
          </Text>
        </View>
        <Text style={styles.itemPrice}>💰 {item.price}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🏪 LOJA</Text>
        <View style={styles.currency}>
          <Text style={styles.coins}>Ouro: {player.gold}</Text>
          <Text style={styles.gems}>Gemas: 0</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'daily' && styles.activeTab]}
          onPress={() => setSelectedCategory('daily')}
        >
          <Text style={styles.tabText}>DIÁRIO</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'armors' && styles.activeTab]}
          onPress={() => setSelectedCategory('armors')}
        >
          <Text style={styles.tabText}>ARMADURA</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'accessories' && styles.activeTab]}
          onPress={() => setSelectedCategory('accessories')}
        >
          <Text style={styles.tabText}>ACESSÓRIO</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedCategory === 'weapons' && styles.activeTab]}
          onPress={() => setSelectedCategory('weapons')}
        >
          <Text style={styles.tabText}>ARMA</Text>
        </TouchableOpacity>
      </View>

      {/* Items */}
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

      {/* Return Button */}
      <TouchableOpacity style={styles.returnButton} onPress={onClose}>
        <Text style={styles.returnText}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 15,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2d2d4d',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  title: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  currency: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 25,
  },
  coins: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#4B0082',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  gems: {
    color: '#00BFFF',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#0066cc',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#2d2d4d',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#4B0082',
    shadowColor: '#9370DB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  itemsContainer: {
    flex: 1,
    marginBottom: 15,
  },
  dailyCategories: {
    gap: 20,
  },
  dailySection: {
    marginBottom: 25,
    backgroundColor: '#2d2d4d',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4B0082',
  },
  dailyTitle: {
    color: '#00ff88',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#4B0082',
    paddingBottom: 8,
  },
  categoryItems: {
    gap: 12,
  },
  categoryTitle: {
    color: '#00ff88',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: '#2d2d4d',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  itemCard: {
    backgroundColor: '#2d2d4d',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#9370DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  itemEmoji: {
    fontSize: 28,
    marginRight: 15,
    width: 35,
    textAlign: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemStats: {
    color: '#00ff88',
    fontSize: 12,
    fontWeight: '500',
  },
  itemEffect: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '500',
  },
  itemPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#4B0082',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    minWidth: 70,
    textAlign: 'center',
  },
  returnButton: {
    backgroundColor: '#4B0082',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9370DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  returnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default ShopScreen;