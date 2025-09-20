import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Animated, Easing } from 'react-native';

const ShopScreen = ({ player, setPlayer, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('consumables');
  const [scaleAnim] = useState(new Animated.Value(1));

  // Itens da loja com estrutura compatível com EquipamentScreen
  const shopItems = {
    consumables: [
      { 
        id: 101, 
        name: "Poção de Vida Superior", 
        type: "poção", 
        effect: "cura", 
        value: 100, 
        price: 200, 
        emoji: "❤️",
        rarity: "epic"
      },
      { 
        id: 102, 
        name: "Poção de Mana", 
        type: "poção", 
        effect: "mana", 
        value: 50, 
        price: 150, 
        emoji: "🔵",
        rarity: "rare"
      },
      { 
        id: 103, 
        name: "Elixir de Força", 
        type: "poção", 
        effect: "energy", 
        value: 30, 
        price: 250, 
        emoji: "⚡",
        rarity: "legendary"
      },
      { 
        id: 104, 
        name: "Poção de Cura", 
        type: "poção", 
        effect: "cura", 
        value: 50, 
        price: 100, 
        emoji: "💚",
        rarity: "common"
      }
    ],
    weapons: [
      { 
        id: 201, 
        name: "Lâmina do Dragão", 
        type: "espada", 
        bonus: { atk: 45, def: 10 }, 
        price: 2500, 
        emoji: "⚔️",
        rarity: "legendary"
      },
      { 
        id: 202, 
        name: "Machado de Guerra", 
        type: "arma", 
        bonus: { atk: 35, def: 15 }, 
        price: 1800, 
        emoji: "🪓",
        rarity: "epic"
      },
      { 
        id: 203, 
        name: "Arco Lunar", 
        type: "arco", 
        bonus: { atk: 40, def: 5 }, 
        price: 2200, 
        emoji: "🏹",
        rarity: "rare"
      },
      { 
        id: 204, 
        name: "Adaga Sombria", 
        type: "espada", 
        bonus: { atk: 28, def: 8 }, 
        price: 1200, 
        emoji: "🗡️",
        rarity: "common"
      }
    ],
    armors: [
      { 
        id: 301, 
        name: "Armadura Celestial", 
        type: "peitoral", 
        bonus: { atk: 15, def: 45, maxHp: 50 }, 
        price: 3000, 
        emoji: "✨",
        rarity: "legendary"
      },
      { 
        id: 302, 
        name: "Peitoral de Mitril", 
        type: "peitoral", 
        bonus: { atk: 10, def: 35, maxHp: 30 }, 
        price: 1800, 
        emoji: "🥋",
        rarity: "epic"
      },
      { 
        id: 303, 
        name: "Couraça de Dragão", 
        type: "peitoral", 
        bonus: { atk: 12, def: 40, maxHp: 40 }, 
        price: 2200, 
        emoji: "🐉",
        rarity: "rare"
      }
    ],
    accessories: [
      { 
        id: 401, 
        name: "Amuleto do Fênix", 
        type: "amuleto", 
        bonus: { atk: 20, def: 15, maxMana: 30 }, 
        price: 1500, 
        emoji: "🔥",
        rarity: "epic"
      },
      { 
        id: 402, 
        name: "Bracelete Estelar", 
        type: "bracelete", 
        bonus: { atk: 12, def: 18, maxMana: 25 }, 
        price: 1200, 
        emoji: "⭐",
        rarity: "rare"
      },
      { 
        id: 403, 
        name: "Anel Ancestral", 
        type: "amuleto", 
        bonus: { atk: 15, def: 12, maxHp: 20 }, 
        price: 900, 
        emoji: "💍",
        rarity: "common"
      }
    ],
    helmets: [
      { 
        id: 501, 
        name: "Elmo do Guardião", 
        type: "capacete", 
        bonus: { def: 25, maxHp: 30 }, 
        price: 800, 
        emoji: "⛑️",
        rarity: "rare"
      },
      { 
        id: 502, 
        name: "Coroa Real", 
        type: "capacete", 
        bonus: { def: 15, maxHp: 20, maxMana: 25 }, 
        price: 1200, 
        emoji: "👑",
        rarity: "epic"
      }
    ],
    boots: [
      { 
        id: 601, 
        name: "Botas da Agilidade", 
        type: "botas", 
        bonus: { def: 20, maxHp: 15 }, 
        price: 600, 
        emoji: "👟",
        rarity: "rare"
      },
      { 
        id: 602, 
        name: "Grevas de Aço", 
        type: "botas", 
        bonus: { def: 25, maxHp: 20 }, 
        price: 800, 
        emoji: "🥾",
        rarity: "epic"
      }
    ]
  };

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

  const buyItem = (item) => {
    if (player.gold < item.price) {
      Alert.alert("💰 Ouro Insuficiente", `Você precisa de mais ${item.price - player.gold} moedas de ouro!`);
      return;
    }

    animateButton();
    
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - item.price,
      inventory: [...prev.inventory, item]
    }));

    Alert.alert("🎉 Compra Realizada!", `${item.emoji} ${item.name} adquirido com sucesso!`);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      common: '#95a5a6',
      rare: '#3498db',
      epic: '#9b59b6',
      legendary: '#f39c12'
    };
    return colors[rarity] || '#95a5a6';
  };

  const getRarityName = (rarity) => {
    const names = {
      common: 'Comum',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Lendário'
    };
    return names[rarity] || 'Comum';
  };

  const renderCategoryItems = () => {
    return shopItems[selectedCategory].map((item, index) => (
      <Animated.View 
        key={item.id} 
        style={[
          styles.itemCard,
          { borderLeftColor: getRarityColor(item.rarity) }
        ]}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.itemEmoji}>{item.emoji}</Text>
          <View style={styles.itemTitleContainer}>
            <Text style={[styles.itemName, { color: getRarityColor(item.rarity) }]}>
              {item.name}
            </Text>
            <Text style={styles.itemType}>{item.type} • {getRarityName(item.rarity)}</Text>
          </View>
        </View>

        <View style={styles.itemContent}>
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
          
          {item.value && (
            <View style={styles.effectBadge}>
              <Text style={styles.effectText}>
                {item.effect === 'cura' ? '❤️ +' + item.value + ' Vida' : ''}
                {item.effect === 'mana' ? '🔵 +' + item.value + ' Mana' : ''}
                {item.effect === 'energy' ? '⚡ +' + item.value + ' Energia' : ''}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.itemFooter}>
          <TouchableOpacity 
            style={[
              styles.buyButton,
              player.gold < item.price && styles.buyButtonDisabled
            ]}
            onPress={() => buyItem(item)}
            disabled={player.gold < item.price}
          >
            <Text style={styles.buyButtonText}>
              {player.gold >= item.price ? 'COMPRAR' : 'SALDO INSUFICIENTE'}
            </Text>
            <Text style={styles.itemPrice}>💰 {item.price}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    ));
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>🏰 ARMARIA REAL</Text>
          <Text style={styles.subtitle}>Equipamentos de Qualidade</Text>
        </View>
        <View style={styles.currencyContainer}>
          <View style={styles.goldContainer}>
            <Text style={styles.goldIcon}>💰</Text>
            <Text style={styles.goldText}>{player.gold}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView 
        horizontal 
        style={styles.tabsContainer} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {Object.keys(shopItems).map(category => (
          <TouchableOpacity 
            key={category}
            style={[
              styles.tab,
              selectedCategory === category && styles.activeTab
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.tabText,
              selectedCategory === category && styles.activeTabText
            ]}>
              {getCategoryName(category)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Items Grid */}
      <ScrollView style={styles.itemsContainer}>
        <View style={styles.itemsGrid}>
          {renderCategoryItems()}
        </View>
      </ScrollView>

      {/* Return Button */}
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity style={styles.returnButton} onPress={onClose}>
          <Text style={styles.returnText}>← VOLTAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Helper para nomes das categorias
const getCategoryName = (category) => {
  const names = {
    consumables: 'Poções',
    weapons: 'Armas',
    armors: 'Armaduras',
    accessories: 'Acessórios',
    helmets: 'Capacetes',
    boots: 'Botas'
  };
  return names[category] || category;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1f',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
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
  currencyContainer: {
    alignItems: 'flex-end',
  },
  goldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 0, 130, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#9370DB',
  },
  goldIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  goldText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    marginBottom: 20,
    maxHeight: 50,
  },
  tabsContent: {
    paddingHorizontal: 5,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 25,
    backgroundColor: 'rgba(45, 45, 77, 0.6)',
    borderWidth: 1,
    borderColor: '#4B0082',
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
  itemsContainer: {
    flex: 1,
    marginBottom: 15,
  },
  itemsGrid: {
    gap: 12,
  },
  itemCard: {
    backgroundColor: 'rgba(45, 45, 77, 0.7)',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemEmoji: {
    fontSize: 32,
    marginRight: 12,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  itemTitleContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  itemType: {
    color: '#95a5a6',
    fontSize: 11,
    fontWeight: '500',
  },
  itemContent: {
    marginBottom: 12,
  },
  bonusesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  bonusBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.3)',
  },
  bonusText: {
    color: '#2ecc71',
    fontSize: 11,
    fontWeight: 'bold',
  },
  effectBadge: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    alignSelf: 'flex-start',
  },
  effectText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 12,
  },
  buyButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  buyButtonDisabled: {
    backgroundColor: '#7f8c8d',
    borderColor: '#95a5a6',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  itemPrice: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  returnButton: {
    backgroundColor: '#4B0082',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9370DB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  returnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});

export default ShopScreen;