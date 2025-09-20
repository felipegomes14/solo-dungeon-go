import React from "react";
import { View, Text } from "react-native";
import { styles } from "./AppStyles";

const RegenIndicator = ({ player, currentDungeon, currentGame, isInCombat }) => {
  const shouldShowRegen = !isInCombat && !currentDungeon && !currentGame;
  const shouldRegenHp = shouldShowRegen && player.hp < player.maxHp;
  const shouldRegenMana = shouldShowRegen && player.mana < player.maxMana;

  if (shouldRegenHp || shouldRegenMana) {
    return (
      <View style={styles.regenIndicator}>
        <Text style={styles.regenText}>
          {shouldRegenHp && '❤️ Regenerando +5 HP/s '}
          {shouldRegenHp && shouldRegenMana && '• '}
          {shouldRegenMana && '🔵 Regenerando +3 MP/s'}
        </Text>
      </View>
    );
  }
  return null;
};

export default RegenIndicator;