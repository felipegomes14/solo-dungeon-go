import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";

export default function Combat({ dungeon, player, setPlayer, ganharXp, onClose }) {
    const [monster, setMonster] = useState(null);
    const [monsterHP, setMonsterHP] = useState(0);
    const [combatLog, setCombatLog] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);

    useEffect(() => {
        if (dungeon) {
            gerarMonstro(dungeon.rank);
        }
    }, [dungeon]);

    const gerarMonstro = (rank) => {
        const pool = {
            F: [{ nome: "Rato", hp: 30, atk: 5, xp: 5, gold: 2 }],
            E: [{ nome: "Goblin", hp: 50, atk: 7, xp: 10, gold: 5 }],
            D: [{ nome: "Orc", hp: 80, atk: 12, xp: 20, gold: 10 }],
            C: [{ nome: "Cavaleiro", hp: 120, atk: 15, xp: 30, gold: 20 }],
            B: [{ nome: "Dragão Jovem", hp: 200, atk: 25, xp: 60, gold: 50 }],
            A: [{ nome: "Dragão Ancião", hp: 300, atk: 40, xp: 100, gold: 100 }],
            S: [{ nome: "Titã Sombrio", hp: 500, atk: 60, xp: 200, gold: 200 }],
            SS: [{ nome: "Deus Antigo", hp: 1000, atk: 100, xp: 500, gold: 500 }],
        };
        const escolhido = pool[rank][0];
        setMonster(escolhido);
        setMonsterHP(escolhido.hp);
        setCombatLog([`Um ${escolhido.nome} apareceu!`]);
    };

    const atacar = () => {
        if (!isPlayerTurn) return;
        const dano = Math.max(0, player.atk - 2);
        setMonsterHP((hp) => {
            const novo = Math.max(0, hp - dano);
            setCombatLog((log) => [`Você causou ${dano} de dano.`, ...log]);
            if (novo > 0) {
                setTimeout(turnoMonstro, 1000);
            }
            return novo;
        });
        setIsPlayerTurn(false);
    };

    const habilidade = (tipo) => {
        if (!isPlayerTurn) return;
        if (player.mp < 10) {
            Alert.alert("⚠️ Sem mana!");
            return;
        }

        let dano = 0;
        if (tipo === "skill1") dano = player.atk * 2;
        if (tipo === "heal") {
            const cura = 30;
            setPlayer((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + cura), mp: p.mp - 10 }));
            setCombatLog((log) => [`Você usou Cura e recuperou ${cura} HP.`, ...log]);
            setIsPlayerTurn(false);
            setTimeout(turnoMonstro, 1000);
            return;
        }

        setMonsterHP((hp) => {
            const novo = Math.max(0, hp - dano);
            setCombatLog((log) => [`Você usou habilidade e causou ${dano} de dano!`, ...log]);
            if (novo > 0) {
                setTimeout(turnoMonstro, 1000);
            }
            return novo;
        });

        setPlayer((p) => ({ ...p, mp: p.mp - 10 }));
        setIsPlayerTurn(false);
    };

    const turnoMonstro = () => {
        if (!monster) return;
        const dano = monster.atk;
        setPlayer((p) => {
            const novoHp = Math.max(0, p.hp - dano);
            setCombatLog((log) => [`${monster.nome} causou ${dano} de dano!`, ...log]);
            return { ...p, hp: novoHp };
        });
        setIsPlayerTurn(true);
    };

    useEffect(() => {
        if (monster && monsterHP <= 0) {
            const loot = gerarLoot();

            Alert.alert("🏆 Vitória!", `Você derrotou ${monster.nome}!`);
            ganharXp(monster.xp);

            setPlayer((p) => ({
                ...p,
                gold: p.gold + monster.gold,
                inventory: [...p.inventory, ...loot], // adiciona loot ao inventário
            }));

            if (loot.length > 0) {
                setCombatLog((log) => [
                    `💰 Loot encontrado: ${loot.map((l) => l.name).join(", ")}`,
                    ...log,
                ]);
            }

            onClose();
        }

        if (monster && player.hp <= 0) {
            Alert.alert("💀 Derrota!", `Você foi derrotado pelo ${monster.nome}.`);
            setPlayer((p) => ({
                ...p,
                hp: p.maxHp,
                mp: p.maxMp,
                gold: Math.max(0, p.gold - 10),
            }));
            onClose();
        }
    }, [monsterHP, player.hp]);



    return (
        <View style={styles.container}>
            {monster && (
                <>
                    <Text style={styles.title}>⚔️ {monster.nome} (HP: {monsterHP})</Text>

                    {/* Status do jogador */}
                    <Text style={styles.playerStatus}>HP: {player.hp}/{player.maxHp} | MP: {player.mp}/{player.maxMp}</Text>

                    {/* Ações */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.button} onPress={atacar}>
                            <Text style={styles.buttonText}>Atacar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => habilidade("skill1")}>
                            <Text style={styles.buttonText}>Skill: Golpe Forte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => habilidade("heal")}>
                            <Text style={styles.buttonText}>Skill: Cura</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={onClose}>
                            <Text style={styles.buttonText}>Fugir</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Log */}
                    <ScrollView style={styles.log}>
                        {combatLog.map((l, i) => (
                            <Text key={i} style={styles.logText}>{l}</Text>
                        ))}
                    </ScrollView>
                </>
            )}
        </View>
    );
}

// Dentro do Combat.js

const gerarLoot = () => {
    const drops = [];

    // Poções (50% de chance)
    if (Math.random() < 0.5) {
        drops.push({ type: "potion", name: "Poção de Cura", effect: { hp: +50 } });
    }
    if (Math.random() < 0.3) {
        drops.push({ type: "potion", name: "Poção de Mana", effect: { mp: +30 } });
    }

    // Equipamentos (30% de chance)
    if (Math.random() < 0.3) {
        const raridades = [
            { tier: "Comum", color: "white", bonus: 5 },
            { tier: "Raro", color: "blue", bonus: 10 },
            { tier: "Épico", color: "purple", bonus: 20 },
            { tier: "Lendário", color: "orange", bonus: 40 },
        ];
        const escolha = raridades[Math.floor(Math.random() * raridades.length)];

        const equipamentos = [
            { type: "equip", name: "Espada", stat: "atk" },
            { type: "equip", name: "Armadura", stat: "def" },
            { type: "equip", name: "Cajado", stat: "atk" },
            { type: "equip", name: "Elmo", stat: "def" },
        ];
        const eq = equipamentos[Math.floor(Math.random() * equipamentos.length)];

        drops.push({
            type: eq.type,
            name: `${eq.name} ${escolha.tier}`,
            stat: eq.stat,
            bonus: escolha.bonus,
            color: escolha.color,
        });
    }

    return drops;
};


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#111", padding: 20 },
    title: { fontSize: 22, color: "#fff", marginBottom: 10, textAlign: "center" },
    playerStatus: { fontSize: 16, color: "#0f0", marginBottom: 20, textAlign: "center" },
    actions: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
    button: {
        backgroundColor: "#333",
        margin: 5,
        padding: 10,
        borderRadius: 8,
        width: "40%",
    },
    buttonText: { color: "#fff", textAlign: "center" },
    log: { marginTop: 20, backgroundColor: "#222", padding: 10, borderRadius: 8, height: 200 },
    logText: { color: "#ccc", marginBottom: 5 },
});
