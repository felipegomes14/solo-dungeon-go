import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView
} from 'react-native';
import EquipamentScreen from './EquipamentScreen';
import ShopScreen from './ShopScreen';
import QuestDiaria from './QuestDiaria';
import PlayerHUD from './PlayerHUD';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MENU_WIDTH = SCREEN_WIDTH * 0.85;

const Menu = ({ 
  player, 
  setPlayer, 
  level, 
  xp, 
  dungeons,
  onRefreshDungeons,
  onShowMap,
  onShowClassSelection,
  onShowQuest,
  onShowAlquimia,
  onShowStatus  // ← NOVA PROP PARA STATUS
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState(null);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false);
      setActiveScreen(null);
    });
  };

  const openScreen = (screen) => {
    setActiveScreen(screen);
  };

  const closeScreen = () => {
    setActiveScreen(null);
  };

  const handleMenuItemPress = (item) => {
    if (item.action) {
      item.action();
      closeMenu();
    } else if (item.screen) {
      if (item.screen === 'quests') {
        onShowQuest();
        closeMenu();
      } else if (item.screen === 'alquimia') {
        onShowAlquimia();
        closeMenu();
      } else if (item.screen === 'status') { // ← NOVO CASO PARA STATUS
        onShowStatus();
        closeMenu();
      } else {
        openScreen(item.screen);
      }
    }
  };

  const menuItems = [
    {
      id: 'status',
      title: '📊 Status Detalhado',
      description: 'Atributos e habilidades completas',
      color: '#00BFFF',
      screen: 'status'
    },
    {
      id: 'player',
      title: '👤 Status do Jogador',
      description: 'Ver atributos e progresso',
      color: '#3498db',
      screen: 'player'
    },
    {
      id: 'equipment',
      title: '🎒 Inventário',
      description: 'Gerenciar equipamentos',
      color: '#9b59b6',
      screen: 'equipment'
    },
    {
      id: 'shop',
      title: '🏰 Loja',
      description: 'Comprar itens',
      color: '#f39c12',
      screen: 'shop'
    },
    {
      id: 'alquimia',
      title: '🧪 Alquimia',
      description: 'Criar poções e equipamentos',
      color: '#8e44ad',
      screen: 'alquimia'
    },
    {
      id: 'quests',
      title: '🎯 Missões Diárias',
      description: 'Desafios e recompensas',
      color: '#2ecc71',
      screen: 'quests'
    },
    {
      id: 'dungeons',
      title: '🏰 Gerar Dungeons',
      description: 'Renovar masmorras',
      color: '#e74c3c',
      action: onRefreshDungeons
    }
  ];

  const renderMenuButton = () => (
    <TouchableOpacity 
      style={styles.menuButton}
      onPress={openMenu}
    >
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
      <View style={styles.hamburgerLine} />
    </TouchableOpacity>
  );

  const renderMenuContent = () => (
    <Animated.View 
      style={[
        styles.menuContainer,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>🎮 MENU PRINCIPAL</Text>
        <Text style={styles.menuSubtitle}>Aventura em Andamento</Text>
        
        <View style={styles.miniHud}>
          <View style={styles.miniHudRow}>
            <Text style={styles.miniText}>Lv.{level}</Text>
            <Text style={styles.miniText}>💰{player?.gold || 0}</Text>
          </View>
          <View style={styles.miniHudRow}>
            <Text style={styles.miniText}>❤️{player?.hp || 0}/{player?.maxHp || 100}</Text>
            <Text style={styles.miniText}>🔵{player?.mp || 0}/{player?.maxMp || 50}</Text>
          </View>
          {player?.availablePoints > 0 && (
            <View style={styles.pointsAlert}>
              <Text style={styles.pointsAlertText}>🎯 {player.availablePoints} ponto(s) para distribuir!</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={styles.menuItems}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderLeftColor: item.color }]}
            onPress={() => handleMenuItemPress(item)}
          >
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
            </View>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.closeMenuButton} onPress={closeMenu}>
        <Text style={styles.closeMenuText}>✕ FECHAR</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderOverlay = () => (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: overlayAnim,
        },
      ]}
    >
      <TouchableOpacity 
        style={styles.overlayTouchable}
        onPress={closeMenu}
      />
    </Animated.View>
  );

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'player':
        return (
          <Modal visible={true} animationType="slide">
            <View style={styles.screenContainer}>
              <View style={styles.screenHeader}>
                <Text style={styles.screenTitle}>👤 STATUS DO JOGADOR</Text>
                <TouchableOpacity onPress={closeScreen} style={styles.closeScreenButton}>
                  <Text style={styles.closeScreenText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                contentContainerStyle={styles.playerHudContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.playerCard}>
                  <View style={styles.hudHeader}>
                    <View style={styles.levelBadge}>
                      <Text style={styles.levelText}>Lv.{level}</Text>
                    </View>
                    <View style={styles.goldContainer}>
                      <Text style={styles.goldIcon}>💰</Text>
                      <Text style={styles.goldText}>{player?.gold || 0}</Text>
                    </View>
                  </View>

                  {player?.availablePoints > 0 && (
                    <View style={styles.pointsNotification}>
                      <Text style={styles.pointsNotificationText}>
                        🎯 Você tem {player.availablePoints} ponto(s) para distribuir!
                      </Text>
                    </View>
                  )}

                  <View style={styles.statRow}>
                    <Text style={styles.statIcon}>❤️</Text>
                    <View style={styles.barContainer}>
                      <View style={styles.barBackground}>
                        <View 
                          style={[
                            styles.barFill, 
                            { 
                              width: `${((player?.hp || 0) / (player?.maxHp || 100)) * 100}%`,
                              backgroundColor: ((player?.hp || 0) / (player?.maxHp || 100)) * 100 > 30 ? '#FF6B6B' : '#FF4757'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barText}>
                        {player?.hp || 0}/{player?.maxHp || 100}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statIcon}>🔵</Text>
                    <View style={styles.barContainer}>
                      <View style={styles.barBackground}>
                        <View 
                          style={[
                            styles.barFill, 
                            { 
                              width: `${((player?.mp || 0) / (player?.maxMp || 50)) * 100}%`,
                              backgroundColor: '#4ECDC4'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barText}>
                        {player?.mp || 0}/{player?.maxMp || 50}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.statRow}>
                    <Text style={styles.statIcon}>⭐</Text>
                    <View style={styles.barContainer}>
                      <View style={styles.barBackground}>
                        <View 
                          style={[
                            styles.barFill, 
                            { 
                              width: `${(xp / (level * 100)) * 100}%`,
                              backgroundColor: '#FFD93D'
                            }
                          ]} 
                        />
                      </View>
                      <Text style={styles.barText}>
                        {xp}/{level * 100} XP
                      </Text>
                    </View>
                  </View>

                  {/* NOVOS STATUS PRINCIPAIS */}
                  <View style={styles.mainStatsGrid}>
                    <View style={styles.mainStatItem}>
                      <Text style={styles.mainStatIcon}>💪</Text>
                      <Text style={styles.mainStatValue}>{player?.forca || 10}</Text>
                      <Text style={styles.mainStatLabel}>FORÇA</Text>
                      <Text style={styles.mainStatDescription}>Dano Físico</Text>
                    </View>
                    
                    <View style={styles.mainStatItem}>
                      <Text style={styles.mainStatIcon}>⚡</Text>
                      <Text style={styles.mainStatValue}>{player?.velocidade || 10}</Text>
                      <Text style={styles.mainStatLabel}>VELOCIDADE</Text>
                      <Text style={styles.mainStatDescription}>Esquiva</Text>
                    </View>
                    
                    <View style={styles.mainStatItem}>
                      <Text style={styles.mainStatIcon}>🎯</Text>
                      <Text style={styles.mainStatValue}>{player?.precisao || 10}</Text>
                      <Text style={styles.mainStatLabel}>PRECISÃO</Text>
                      <Text style={styles.mainStatDescription}>Acerto</Text>
                    </View>

                    <View style={styles.mainStatItem}>
                      <Text style={styles.mainStatIcon}>🍀</Text>
                      <Text style={styles.mainStatValue}>{player?.sorte || 10}</Text>
                      <Text style={styles.mainStatLabel}>SORTE</Text>
                      <Text style={styles.mainStatDescription}>Crítico/Drops</Text>
                    </View>
                  </View>

                  <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                      <Text style={styles.statIconLarge}>❤️</Text>
                      <Text style={styles.statValue}>{player?.maxHp || 100}</Text>
                      <Text style={styles.statLabel}>VIDA MÁX</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statIconLarge}>🔵</Text>
                      <Text style={styles.statValue}>{player?.maxMp || 50}</Text>
                      <Text style={styles.statLabel}>MANA MÁX</Text>
                    </View>
                    
                    <View style={styles.statItem}>
                      <Text style={styles.statIconLarge}>🏰</Text>
                      <Text style={styles.statValue}>{dungeons?.length || 0}</Text>
                      <Text style={styles.statLabel}>DUNGEONS</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text style={styles.statIconLarge}>⭐</Text>
                      <Text style={styles.statValue}>{player?.level || 1}</Text>
                      <Text style={styles.statLabel}>NÍVEL</Text>
                    </View>
                  </View>

                  <View style={styles.additionalInfo}>
                    <Text style={styles.infoTitle}>📊 INFORMAÇÕES DO PERSONAGEM</Text>
                    
                    <View style={styles.infoGrid}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Classe:</Text>
                        <Text style={styles.infoValue}>{player?.playerClass || 'Aventureiro'}</Text>
                      </View>
                      
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Dungeons Ativas:</Text>
                        <Text style={styles.infoValue}>{dungeons?.length || 0}</Text>
                      </View>
                      
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>XP para próximo nível:</Text>
                        <Text style={styles.infoValue}>{level * 100 - xp} XP</Text>
                      </View>
                      
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Progresso do nível:</Text>
                        <Text style={styles.infoValue}>{Math.round((xp / (level * 100)) * 100)}%</Text>
                      </View>

                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Chance de Crítico:</Text>
                        <Text style={styles.infoValue}>{Math.min(50, ((player?.sorte || 10) * 1) + 5)}%</Text>
                      </View>

                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Chance de Esquiva:</Text>
                        <Text style={styles.infoValue}>{Math.min(50, ((player?.velocidade || 10) * 3))}%</Text>
                      </View>

                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Chance de Acerto:</Text>
                        <Text style={styles.infoValue}>{Math.min(95, ((player?.precisao || 10) * 2) + 70)}%</Text>
                      </View>

                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Dano Base:</Text>
                        <Text style={styles.infoValue}>{Math.floor((player?.forca || 10) * 1.5)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
              
              <TouchableOpacity style={styles.backButton} onPress={closeScreen}>
                <Text style={styles.backButtonText}>← VOLTAR AO MENU</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        );
      
      case 'equipment':
        return (
          <Modal visible={true} animationType="slide">
            <EquipamentScreen
              player={player}
              setPlayer={setPlayer}
              onClose={closeScreen}
            />
          </Modal>
        );
      
      case 'shop':
        return (
          <Modal visible={true} animationType="slide">
            <ShopScreen
              player={player}
              setPlayer={setPlayer}
              onClose={closeScreen}
            />
          </Modal>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      {renderMenuButton()}
      {isMenuOpen && renderOverlay()}
      {isMenuOpen && renderMenuContent()}
      {renderActiveScreen()}
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: (StatusBar.currentHeight || 0) + 10,
    right: 15,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(45, 45, 77, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4B0082',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  hamburgerLine: {
    width: 20,
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 2,
    borderRadius: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: '#0f0f1f',
    zIndex: 1000,
    borderRightWidth: 2,
    borderRightColor: '#4B0082',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    paddingTop: (StatusBar.currentHeight || 0) + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(45, 45, 77, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#4B0082',
  },
  menuTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuSubtitle: {
    color: '#00BFFF',
    fontSize: 14,
    marginBottom: 15,
  },
  miniHud: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4B0082',
  },
  miniHudRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  miniText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  pointsAlert: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  pointsAlertText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  menuItems: {
    flex: 1,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(30, 30, 60, 0.6)',
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  menuItemDescription: {
    color: '#a0a0c0',
    fontSize: 11,
  },
  menuItemArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeMenuButton: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  closeMenuText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
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
  playerCard: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  hudHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  levelBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  levelText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 16,
    marginRight: 6,
  },
  goldText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pointsNotification: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  pointsNotificationText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(30, 30, 60, 0.6)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 30,
    textAlign: 'center',
  },
  barContainer: {
    flex: 1,
  },
  barBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#2a2a4a',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
  barText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  // NOVOS ESTILOS PARA OS STATUS PRINCIPAIS
  mainStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 25,
    gap: 12,
  },
  mainStatItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 60, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mainStatIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  mainStatValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mainStatLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  mainStatDescription: {
    color: '#a0a0c0',
    fontSize: 10,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 25,
    gap: 12,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 60, 0.6)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statIconLarge: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#a0a0c0',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  additionalInfo: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoTitle: {
    color: '#00BFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 30, 60, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  infoLabel: {
    color: '#a0a0c0',
    fontSize: 12,
    fontWeight: '500',
  },
  infoValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
});

export default Menu;