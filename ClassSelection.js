import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const classes = [
  { name: "Guerreiro", desc: "Força bruta, especialista em espadas e machados. Alta defesa." },
  { name: "Mago", desc: "Domina magias poderosas de fogo, gelo e trovão. Alta inteligência." },
  { name: "Arqueiro", desc: "Mestre do arco e flecha, ataques à distância precisos." },
  { name: "Assassino", desc: "Ágil e furtivo, especialista em ataques críticos e velocidade." },
  { name: "Paladino", desc: "Guerreiro sagrado, combina força e cura divina." },
  { name: "Necromante", desc: "Controla mortos-vivos e magias sombrias." },
  { name: "Druida", desc: "Conecta-se à natureza, pode invocar animais e curar aliados." },
  { name: "Bárbaro", desc: "Raiva e brutalidade, causa grande dano físico." },
  { name: "Monge", desc: "Disciplinado, usa artes marciais e chi para lutar." },
  { name: "Feiticeiro", desc: "Usa magias caóticas, instáveis e muito poderosas." },
];

export default function ClassSelection({ onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Escolha sua Classe</Text>
      <FlatList
        data={classes}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => onSelect(item)}
          >
            <Text style={styles.className}>{item.name}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20, textAlign: "center" },
  card: {
    backgroundColor: "#222",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#555",
  },
  className: { fontSize: 18, fontWeight: "bold", color: "#ffcc00" },
  desc: { fontSize: 14, color: "#ccc", marginTop: 5 },
});
