import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export default function Inventory({ player, onClose }) {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemType}>Tipo: {item.type}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎒 Inventário</Text>
      
      <Text style={styles.stats}>
        Ouro: {player.gold} | Itens: {player.inventory.length}
      </Text>

      <FlatList
        data={player.inventory}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={styles.empty}>Inventário vazio!</Text>
        }
      />

      <Text style={styles.footer}>
        HP: {player.hp}/{player.maxHp} | Ataque: {player.atk}
      </Text>
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
  item: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemType: {
    fontSize: 14,
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50
  },
  footer: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold'
  }
});