// Inventory.js
import React from "react";
import MapView, { Marker } from "react-native-maps";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function Inventory({ player, onClose }) {
  if (!player || !player.inventory) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎒 Inventário</Text>
        <Text style={styles.empty}>Nenhum item encontrado...</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const usarItem = (item) => {
    if (item.includes("Poção")) {
      Alert.alert("🍷 Poção usada!", `Você usou ${item}.`);
      // Aqui você pode adicionar lógica para curar HP/MP etc
    } else {
      Alert.alert("⚔️ Equipado!", `Você equipou ${item}.`);
      // Aqui você pode adicionar lógica para equipar armas/armaduras
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎒 Inventário</Text>

      <FlatList
        data={player.inventory}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => usarItem(item)}
          >
            <Text style={styles.itemText}>🔹 {item}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Seu inventário está vazio...</Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.gold}>💰 Ouro: {player.gold}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffd700",
    textAlign: "center",
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#333",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  itemText: {
    fontSize: 18,
    color: "#fff",
  },
  empty: {
    fontSize: 16,
    color: "#aaa",
    textAlign: "center",
    marginTop: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  gold: {
    fontSize: 18,
    color: "#ffd700",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#e63946",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
