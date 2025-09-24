import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert,
  StatusBar 
} from 'react-native';

const Alquimia = ({ player, setPlayer, visible, onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  // Materiais de alquimia por monstro
  const materialsByMonster = {
    'Goblin': ['Olho de Goblin', 'Unhas de Goblin'],
    'Orc Chefe': ['Sangue de Orc', 'Dedo de Orc'],
    'Lobo': ['Presa de Lobo', 'Pelagem de Lobo'],
    'Glabro': ['Orelha de Glabro', 'Pata de Glabro'],
    'Esqueleto': ['Pó de Osso', 'Crânio'],
    'Lich': ['Essência de Alma', 'Orbe Mágica'],
    'Ghoul': ['Mão de Ghoul', 'Pele de Ghoul'],
    'Conde Vampiro': ['Sangue Real', 'Presas de Vampiro'],
    'Tritão': ['Algas Mágicas', 'Escamas de Tritão'],
    'Leviathan': ['Pérola Divina', 'Óvulo de Leviathan'],
    'Wyvern': ['Asas de Wyvern', 'Chifre de Wyvern'],
    'Drake': ['Pele de Drake', 'Cauda de Drake'],
    'Dragonete': ['Unha de Dragonete', 'Saliva de Dragonete'],
    'Dragão': ['Escama de Dragão', 'Coração de Dragão'],
    'Deus X-Máquina': ['Núcleo Energético', 'Mithril']
  };

  // Receitas de poções
  const potionRecipes = [
    {
      id: 1,
      name: 'Poção de Cura Menor',
      effect: 'Cura 50 HP',
      type: 'potion',
      materials: [
        { name: 'Olho de Goblin', quantity: 2 },
        { name: 'Presa de Lobo', quantity: 1 }
      ],
      result: { type: 'poção', name: 'Poção de Cura Menor', effect: 'cura', value: 50 }
    },
    {
      id: 2,
      name: 'Poção de Cura Maior',
      effect: 'Cura 100 HP',
      type: 'potion',
      materials: [
        { name: 'Sangue de Orc', quantity: 2 },
        { name: 'Essência de Alma', quantity: 1 },
        { name: 'Pérola Divina', quantity: 1 }
      ],
      result: { type: 'poção', name: 'Poção de Cura Maior', effect: 'cura', value: 100 }
    },
    {
      id: 3,
      name: 'Poção de Mana',
      effect: 'Restaura 30 MP',
      type: 'potion',
      materials: [
        { name: 'Orbe Mágica', quantity: 2 },
        { name: 'Algas Mágicas', quantity: 1 }
      ],
      result: { type: 'poção', name: 'Poção de Mana', effect: 'mana', value: 30 }
    },
    {
      id: 4,
      name: 'Poção de Força',
      effect: 'Aumenta ATQ em 20% por 3 turnos',
      type: 'potion',
      materials: [
        { name: 'Sangue Real', quantity: 1 },
        { name: 'Presa de Lobo', quantity: 3 },
        { name: 'Unhas de Goblin', quantity: 2 }
      ],
      result: { type: 'poção', name: 'Poção de Força', effect: 'buff_atk', value: 1.2, duration: 3 }
    },
    {
      id: 5,
      name: 'Poção de Defesa',
      effect: 'Aumenta DEF em 25% por 3 turnos',
      type: 'potion',
      materials: [
        { name: 'Escamas de Tritão', quantity: 2 },
        { name: 'Pele de Drake', quantity: 1 },
        { name: 'Pó de Osso', quantity: 3 }
      ],
      result: { type: 'poção', name: 'Poção de Defesa', effect: 'buff_def', value: 1.25, duration: 3 }
    }
  ];

  // Receitas de equipamentos
  const equipmentRecipes = [
    {
      id: 101,
      name: 'Espada do Caçador',
      effect: 'ATQ +15, DEF +5',
      type: 'equipment',
      materials: [
        { name: 'Presa de Lobo', quantity: 5 },
        { name: 'Chifre de Wyvern', quantity: 2 },
        { name: 'Mithril', quantity: 1 }
      ],
      result: { 
        type: 'equipamento', 
        name: 'Espada do Caçador', 
        slot: 'weapon',
        atk: 15, 
        def: 5 
      }
    },
    {
      id: 102,
      name: 'Armadura de Dragão',
      effect: 'DEF +25, HP +50',
      type: 'equipment',
      materials: [
        { name: 'Escama de Dragão', quantity: 5 },
        { name: 'Pele de Drake', quantity: 3 },
        { name: 'Coração de Dragão', quantity: 1 }
      ],
      result: { 
        type: 'equipamento', 
        name: 'Armadura de Dragão', 
        slot: 'armor',
        def: 25, 
        maxHp: 50 
      }
    },
    {
      id: 103,
      name: 'Amuleto Místico',
      effect: 'MP +30, Mana Regeneration',
      type: 'equipment',
      materials: [
        { name: 'Essência de Alma', quantity: 3 },
        { name: 'Orbe Mágica', quantity: 2 },
        { name: 'Pérola Divina', quantity: 1 }
      ],
      result: { 
        type: 'equipamento', 
        name: 'Amuleto Místico', 
        slot: 'accessory',
        maxMana: 30,
        manaRegen: 5 
      }
    }
  ];

  const allRecipes = [...potionRecipes, ...equipmentRecipes];

  const getPlayerMaterialCount = (materialName) => {
    if (!player.materials) return 0;
    const material = player.materials.find(m => m.name === materialName);
    return material ? material.quantity : 0;
  };

  const hasEnoughMaterials = (recipe) => {
    return recipe.materials.every(material => 
      getPlayerMaterialCount(material.name) >= material.quantity
    );
  };

  const craftItem = (recipe) => {
    if (!hasEnoughMaterials(recipe)) {
      Alert.alert('Materiais Insuficientes', 'Você não tem materiais suficientes para criar este item.');
      return;
    }

    // Remover materiais usados
    const newMaterials = [...(player.materials || [])];
    recipe.materials.forEach(requiredMaterial => {
      const playerMaterialIndex = newMaterials.findIndex(m => m.name === requiredMaterial.name);
      if (playerMaterialIndex !== -1) {
        newMaterials[playerMaterialIndex].quantity -= requiredMaterial.quantity;
        if (newMaterials[playerMaterialIndex].quantity <= 0) {
          newMaterials.splice(playerMaterialIndex, 1);
        }
      }
    });

    // Adicionar item criado ao inventário
    const newInventory = [...(player.inventory || []), { 
      ...recipe.result, 
      id: Date.now() + Math.random() 
    }];

    setPlayer({
      ...player,
      materials: newMaterials,
      inventory: newInventory
    });

    Alert.alert('Sucesso!', `Você criou: ${recipe.name}`);
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  const renderRecipeItem = (recipe) => (
    <TouchableOpacity 
      key={recipe.id}
      style={[
        styles.recipeItem,
        !hasEnoughMaterials(recipe) && styles.disabledRecipe
      ]}
      onPress={() => {
        setSelectedRecipe(recipe);
        setShowRecipeModal(true);
      }}
      disabled={!hasEnoughMaterials(recipe)}
    >
      <View style={styles.recipeHeader}>
        <Text style={styles.recipeName}>{recipe.name}</Text>
        <Text style={styles.recipeEffect}>{recipe.effect}</Text>
      </View>
      <View style={styles.materialsList}>
        {recipe.materials.map((material, index) => (
          <Text key={index} style={styles.materialText}>
            {material.name}: {getPlayerMaterialCount(material.name)}/{material.quantity}
          </Text>
        ))}
      </View>
    </TouchableOpacity>
  );

  if (!visible) return null;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>🧪 Oficina de Alquimia</Text>
        <TouchableOpacity 
          style={styles.closeScreenButton}
          onPress={onClose}
        >
          <Text style={styles.closeScreenText}>X</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.playerHudContainer}>
        <View style={styles.materialsSection}>
          <Text style={styles.sectionTitle}>Seus Materiais:</Text>
          <ScrollView 
            style={styles.materialsScroll} 
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {player.materials?.map((material, index) => (
              <View key={index} style={styles.materialChip}>
                <Text style={styles.materialChipText}>
                  {material.name}: {material.quantity}
                </Text>
              </View>
            ))}
            {(!player.materials || player.materials.length === 0) && (
              <Text style={styles.noMaterials}>Nenhum material coletado</Text>
            )}
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Poções:</Text>
        <ScrollView style={styles.recipesScroll}>
          {potionRecipes.map(renderRecipeItem)}
        </ScrollView>

        <Text style={styles.sectionTitle}>Equipamentos:</Text>
        <ScrollView style={styles.recipesScroll}>
          {equipmentRecipes.map(renderRecipeItem)}
        </ScrollView>
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </TouchableOpacity>

      {/* Modal de Confirmação de Craft */}
      <Modal 
        visible={showRecipeModal} 
        transparent={true} 
        animationType="fade"
        onRequestClose={() => setShowRecipeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedRecipe && (
              <>
                <Text style={styles.modalTitle}>Criar {selectedRecipe.name}</Text>
                <Text style={styles.modalEffect}>{selectedRecipe.effect}</Text>
                
                <Text style={styles.materialsTitle}>Materiais necessários:</Text>
                {selectedRecipe.materials.map((material, index) => (
                  <Text key={index} style={styles.modalMaterialText}>
                    {material.name}: {getPlayerMaterialCount(material.name)}/{material.quantity}
                  </Text>
                ))}

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.craftButton}
                    onPress={() => craftItem(selectedRecipe)}
                  >
                    <Text style={styles.craftButtonText}>Criar</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => {
                      setShowRecipeModal(false);
                      setSelectedRecipe(null);
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0f0f1f',
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(45, 45, 77, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#4B0082',
  },
  screenTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeScreenButton: {
    padding: 10,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 15,
  },
  closeScreenText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  playerHudContainer: {
    flexGrow: 1,
    padding: 16,
  },
  sectionTitle: {
    color: '#00BFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
  },
  materialsSection: {
    marginBottom: 10,
  },
  materialsScroll: {
    maxHeight: 60,
  },
  materialChip: {
    backgroundColor: 'rgba(75, 0, 130, 0.8)',
    padding: 10,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#9370DB',
  },
  materialChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  noMaterials: {
    color: '#a0a0c0',
    fontStyle: 'italic',
    padding: 10,
  },
  recipesScroll: {
    maxHeight: 200,
    marginBottom: 10,
  },
  recipeItem: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  disabledRecipe: {
    opacity: 0.5,
  },
  recipeHeader: {
    marginBottom: 8,
  },
  recipeName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeEffect: {
    color: '#00BFFF',
    fontSize: 12,
  },
  materialsList: {
    marginTop: 5,
  },
  materialText: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 2,
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(75, 0, 130, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9370DB',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: '#0f0f1f',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalEffect: {
    color: '#00BFFF',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
  materialsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
  },
  modalMaterialText: {
    color: '#ccc',
    marginBottom: 5,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  craftButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2ecc71',
  },
  craftButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Alquimia;