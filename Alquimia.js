import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  Alert,
  Dimensions
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const Alquimia = ({ player, setPlayer, visible, onClose }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [activeTab, setActiveTab] = useState('poções'); // 'poções' ou 'equipamentos'

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
    },
    {
      id: 6,
      name: 'Poção de Velocidade',
      effect: 'Aumenta velocidade por 3 turnos',
      type: 'potion',
      materials: [
        { name: 'Asas de Wyvern', quantity: 2 },
        { name: 'Saliva de Dragonete', quantity: 1 }
      ],
      result: { type: 'poção', name: 'Poção de Velocidade', effect: 'buff_speed', value: 1.3, duration: 3 }
    },
    {
      id: 7,
      name: 'Poção de Regeneração',
      effect: 'Regenera 10 HP por turno por 5 turnos',
      type: 'potion',
      materials: [
        { name: 'Coração de Dragão', quantity: 1 },
        { name: 'Sangue Real', quantity: 2 }
      ],
      result: { type: 'poção', name: 'Poção de Regeneração', effect: 'regen_hp', value: 10, duration: 5 }
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
    },
    {
      id: 104,
      name: 'Elmo do Poder',
      effect: 'ATQ +10, DEF +8',
      type: 'equipment',
      materials: [
        { name: 'Crânio', quantity: 3 },
        { name: 'Mithril', quantity: 2 },
        { name: 'Núcleo Energético', quantity: 1 }
      ],
      result: { 
        type: 'equipamento', 
        name: 'Elmo do Poder', 
        slot: 'helmet',
        atk: 10, 
        def: 8 
      }
    },
    {
      id: 105,
      name: 'Botas da Agilidade',
      effect: 'Velocidade +15, DEF +3',
      type: 'equipment',
      materials: [
        { name: 'Pele de Ghoul', quantity: 4 },
        { name: 'Asas de Wyvern', quantity: 2 }
      ],
      result: { 
        type: 'equipamento', 
        name: 'Botas da Agilidade', 
        slot: 'boots',
        speed: 15, 
        def: 3 
      }
    }
  ];

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
          <Text key={index} style={[
            styles.materialText,
            getPlayerMaterialCount(material.name) >= material.quantity ? styles.materialSufficient : styles.materialInsufficient
          ]}>
            {material.name}: {getPlayerMaterialCount(material.name)}/{material.quantity}
          </Text>
        ))}
      </View>
      <View style={styles.recipeFooter}>
        <Text style={styles.recipeType}>
          {recipe.type === 'potion' ? '🧪 Poção' : '⚔️ Equipamento'}
        </Text>
        <View style={[
          styles.craftStatus,
          hasEnoughMaterials(recipe) ? styles.craftAvailable : styles.craftUnavailable
        ]}>
          <Text style={styles.craftStatusText}>
            {hasEnoughMaterials(recipe) ? '✓ Pronto' : '✗ Faltam materiais'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCurrentRecipes = () => {
    const recipes = activeTab === 'poções' ? potionRecipes : equipmentRecipes;
    
    return (
      <ScrollView 
        style={styles.recipesScroll}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.recipesContent}
      >
        {recipes.map(renderRecipeItem)}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    );
  };

  if (!visible) return null;

  return (
    <View style={styles.screenContainer}>
      {/* Cabeçalho */}
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>🧪 Oficina de Alquimia</Text>
        <TouchableOpacity 
          style={styles.closeScreenButton}
          onPress={onClose}
        >
          <Text style={styles.closeScreenText}>X</Text>
        </TouchableOpacity>
      </View>

      {/* Abas de Navegação */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'poções' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('poções')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'poções' && styles.tabTextActive
          ]}>
            🧪 Poções ({potionRecipes.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton,
            activeTab === 'equipamentos' && styles.tabButtonActive
          ]}
          onPress={() => setActiveTab('equipamentos')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'equipamentos' && styles.tabTextActive
          ]}>
            ⚔️ Equipamentos ({equipmentRecipes.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seção de Materiais */}
      <View style={styles.materialsSection}>
        <Text style={styles.sectionTitle}>📦 Seus Materiais</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={true}
          style={styles.materialsHorizontalScroll}
          contentContainerStyle={styles.materialsScrollContent}
        >
          {player.materials?.length > 0 ? (
            player.materials.map((material, index) => (
              <View key={index} style={styles.materialChip}>
                <Text style={styles.materialChipName}>{material.name}</Text>
                <Text style={styles.materialChipQuantity}>{material.quantity}x</Text>
              </View>
            ))
          ) : (
            <View style={styles.noMaterialsContainer}>
              <Text style={styles.noMaterialsText}>🎒 Nenhum material coletado</Text>
              <Text style={styles.noMaterialsSubtitle}>Derrote monstros para obter materiais!</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Lista de Receitas com Scroll */}
      <View style={styles.recipesContainer}>
        <Text style={styles.sectionTitle}>
          {activeTab === 'poções' ? '🧴 Receitas de Poções' : '🛡️ Receitas de Equipamentos'}
        </Text>
        {renderCurrentRecipes()}
      </View>

      {/* Modal de Confirmação */}
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
                <View style={styles.modalMaterialsList}>
                  {selectedRecipe.materials.map((material, index) => (
                    <View key={index} style={styles.modalMaterialItem}>
                      <Text style={[
                        styles.modalMaterialName,
                        getPlayerMaterialCount(material.name) >= material.quantity 
                          ? styles.modalMaterialSufficient 
                          : styles.modalMaterialInsufficient
                      ]}>
                        {material.name}
                      </Text>
                      <Text style={styles.modalMaterialQuantity}>
                        {getPlayerMaterialCount(material.name)}/{material.quantity}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={[
                      styles.craftButton,
                      !hasEnoughMaterials(selectedRecipe) && styles.craftButtonDisabled
                    ]}
                    onPress={() => craftItem(selectedRecipe)}
                    disabled={!hasEnoughMaterials(selectedRecipe)}
                  >
                    <Text style={styles.craftButtonText}>
                      {hasEnoughMaterials(selectedRecipe) ? '✨ Criar Item' : '❌ Materiais Insuficientes'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowRecipeModal(false)}
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
  // Abas
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 30, 60, 0.8)',
    margin: 16,
    borderRadius: 10,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: '#4B0082',
  },
  tabText: {
    color: '#a0a0c0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#FFD700',
  },
  // Materiais
  materialsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#00BFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  materialsHorizontalScroll: {
    maxHeight: 80,
  },
  materialsScrollContent: {
    paddingRight: 16,
  },
  materialChip: {
    backgroundColor: 'rgba(75, 0, 130, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#9370DB',
    alignItems: 'center',
    minWidth: 100,
  },
  materialChipName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  materialChipQuantity: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noMaterialsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noMaterialsText: {
    color: '#a0a0c0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  noMaterialsSubtitle: {
    color: '#666',
    fontSize: 12,
  },
  // Receitas
  recipesContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  recipesScroll: {
    flex: 1,
  },
  recipesContent: {
    paddingBottom: 20,
  },
  recipeItem: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B0082',
    marginBottom: 12,
  },
  disabledRecipe: {
    opacity: 0.6,
    borderColor: '#666',
  },
  recipeHeader: {
    marginBottom: 8,
  },
  recipeName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recipeEffect: {
    color: '#00BFFF',
    fontSize: 13,
  },
  materialsList: {
    marginBottom: 8,
  },
  materialText: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '500',
  },
  materialSufficient: {
    color: '#27ae60',
  },
  materialInsufficient: {
    color: '#e74c3c',
  },
  recipeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  recipeType: {
    color: '#a0a0c0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  craftStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  craftAvailable: {
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
  },
  craftUnavailable: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
  },
  craftStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomSpacer: {
    height: 20,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    backgroundColor: '#0f0f1f',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    borderWidth: 2,
    borderColor: '#4B0082',
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  modalTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalEffect: {
    color: '#00BFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  materialsTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
  },
  modalMaterialsList: {
    marginBottom: 20,
  },
  modalMaterialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalMaterialName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  modalMaterialSufficient: {
    color: '#27ae60',
  },
  modalMaterialInsufficient: {
    color: '#e74c3c',
  },
  modalMaterialQuantity: {
    color: '#ccc',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalButtons: {
    gap: 12,
  },
  craftButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  craftButtonDisabled: {
    backgroundColor: '#7f8c8d',
  },
  craftButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Alquimia;