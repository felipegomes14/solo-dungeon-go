// StatusScreen.js
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const StatusScreen = ({ player, level, xp, onClose }) => {
  // Dados dos status baseados nos atributos originais do jogador
  const statusData = [
    {
      label: 'HP',
      value: player?.hp || 100,
      max: player?.maxHp || 100,
      color: '#FF4757',
      icon: '❤️',
      description: 'Pontos de Vida'
    },
    {
      label: 'MP', 
      value: player?.mp || 50,
      max: player?.maxMp || 50,
      color: '#4ECDC4',
      icon: '🔵',
      description: 'Pontos de Mana'
    },
    {
      label: 'FORÇA',
      value: player?.forca || 10,
      max: 100,
      color: '#FF6B6B',
      icon: '💪',
      description: 'Dano Físico'
    },
    {
      label: 'VELOCIDADE',
      value: player?.velocidade || 10,
      max: 100,
      color: '#FFD93D',
      icon: '⚡',
      description: 'Esquiva e Agilidade'
    },
    {
      label: 'PRECISÃO',
      value: player?.precisao || 10,
      max: 100,
      color: '#9B59B6',
      icon: '🎯',
      description: 'Chance de Acerto'
    },
    {
      label: 'SORTE',
      value: player?.sorte || 10,
      max: 100,
      color: '#6BCF7F',
      icon: '🍀',
      description: 'Chance Crítica e Drops'
    }
  ];

  const calcularPorcentagem = (valor, max) => {
    return Math.min((valor / max) * 100, 100);
  };

  const calcularXPProximoNivel = () => {
    return level * 100 - xp;
  };

  // Calcular estatísticas de combate baseadas nos atributos
  const calcularChanceAcerto = () => {
    return Math.min(95, ((player?.precisao || 10) * 2) + 70);
  };

  const calcularChanceEsquiva = () => {
    return Math.min(50, ((player?.velocidade || 10) * 3));
  };

  const calcularChanceCritico = () => {
    return Math.min(50, ((player?.sorte || 10) * 1) + 5);
  };

  const calcularDanoBase = () => {
    return Math.floor((player?.forca || 10) * 1.5);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>STATUS DO JOGADOR</Text>
        <Text style={styles.subtitle}>Atributos e Habilidades</Text>
        
        <View style={styles.playerInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>NÍVEL</Text>
            <Text style={styles.infoValue}>{level}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>CLASSE</Text>
            <Text style={styles.infoValue}>{player?.playerClass || 'AVENTUREIRO'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PRÓXIMO LVL</Text>
            <Text style={styles.infoValue}>{calcularXPProximoNivel()} XP</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Grid */}
        <View style={styles.statusGrid}>
          {statusData.map((status, index) => {
            const porcentagem = calcularPorcentagem(status.value, status.max);
            
            return (
              <View key={index} style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <Text style={styles.statusIcon}>{status.icon}</Text>
                  <View style={styles.statusTextContainer}>
                    <Text style={styles.statusLabel}>{status.label}</Text>
                    <Text style={styles.statusDescription}>{status.description}</Text>
                  </View>
                  <Text style={styles.statusValue}>{status.value}</Text>
                </View>
                
                <View style={styles.barContainer}>
                  <View style={styles.barBackground}>
                    <View 
                      style={[
                        styles.barFill,
                        {
                          width: `${porcentagem}%`,
                          backgroundColor: status.color
                        }
                      ]}
                    />
                  </View>
                  <View style={styles.barLabels}>
                    <Text style={styles.barMin}>0</Text>
                    <Text style={styles.barMax}>{status.max}</Text>
                  </View>
                </View>
                
                <View style={styles.statusFooter}>
                  <Text style={styles.percentageText}>
                    {Math.round(porcentagem)}%
                  </Text>
                  <View style={styles.levelDots}>
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <View 
                        key={dot}
                        style={[
                          styles.levelDot,
                          dot <= Math.ceil(porcentagem / 20) && {
                            backgroundColor: status.color
                          }
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Estatísticas de Combate */}
        <View style={styles.additionalStats}>
          <Text style={styles.sectionTitle}>ESTATÍSTICAS DE COMBATE</Text>
          
          <View style={styles.combatStatsGrid}>
            <View style={styles.combatStat}>
              <Text style={styles.combatStatIcon}>🎯</Text>
              <Text style={styles.combatStatValue}>
                {calcularChanceAcerto()}%
              </Text>
              <Text style={styles.combatStatLabel}>ACERTO</Text>
            </View>
            
            <View style={styles.combatStat}>
              <Text style={styles.combatStatIcon}>⚡</Text>
              <Text style={styles.combatStatValue}>
                {calcularChanceEsquiva()}%
              </Text>
              <Text style={styles.combatStatLabel}>ESQUIVA</Text>
            </View>
            
            <View style={styles.combatStat}>
              <Text style={styles.combatStatIcon}>💥</Text>
              <Text style={styles.combatStatValue}>
                {calcularChanceCritico()}%
              </Text>
              <Text style={styles.combatStatLabel}>CRÍTICO</Text>
            </View>
            
            <View style={styles.combatStat}>
              <Text style={styles.combatStatIcon}>🗡️</Text>
              <Text style={styles.combatStatValue}>
                {calcularDanoBase()}
              </Text>
              <Text style={styles.combatStatLabel}>DANO</Text>
            </View>
          </View>
        </View>

        {/* Recursos e Informações */}
        <View style={styles.resourcesSection}>
          <Text style={styles.sectionTitle}>RECURSOS</Text>
          
          <View style={styles.resourcesGrid}>
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>💰</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceLabel}>OURO</Text>
                <Text style={styles.resourceValue}>{player?.gold || 0}</Text>
              </View>
            </View>
            
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>⭐</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceLabel}>EXPERIÊNCIA</Text>
                <Text style={styles.resourceValue}>{xp} XP</Text>
              </View>
            </View>
            
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>🎒</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceLabel}>INVENTÁRIO</Text>
                <Text style={styles.resourceValue}>{player?.inventory?.length || 0} itens</Text>
              </View>
            </View>
            
            <View style={styles.resourceItem}>
              <Text style={styles.resourceIcon}>🏰</Text>
              <View style={styles.resourceInfo}>
                <Text style={styles.resourceLabel}>MASMORRAS</Text>
                <Text style={styles.resourceValue}>{player?.dungeonsCompleted || 0} concluídas</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informações Adicionais */}
        <View style={styles.additionalInfo}>
          <Text style={styles.sectionTitle}>INFORMAÇÕES</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Progresso do Nível:</Text>
              <Text style={styles.infoValue}>{Math.round((xp / (level * 100)) * 100)}%</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>XP para Próximo Nível:</Text>
              <Text style={styles.infoValue}>{calcularXPProximoNivel()} XP</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Defesa Total:</Text>
              <Text style={styles.infoValue}>{Math.floor((player?.defesa || 10) * 2)}</Text>
            </View>
            
            {player?.availablePoints > 0 && (
              <View style={styles.pointsNotification}>
                <Text style={styles.pointsNotificationText}>
                  🎯 Você tem {player.availablePoints} ponto(s) para distribuir!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Botão Fechar */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>FECHAR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2d2d4d',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#8a8ab5',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#252547',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a6d',
  },
  infoRow: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#8a8ab5',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  statusGrid: {
    gap: 16,
    marginBottom: 24,
  },
  statusCard: {
    backgroundColor: '#252547',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#3a3a6d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: 1,
  },
  statusDescription: {
    fontSize: 12,
    color: '#8a8ab5',
  },
  statusValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    minWidth: 40,
    textAlign: 'right',
  },
  barContainer: {
    marginBottom: 12,
  },
  barBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#2d2d4d',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barMin: {
    fontSize: 10,
    color: '#8a8ab5',
  },
  barMax: {
    fontSize: 10,
    color: '#8a8ab5',
  },
  statusFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  levelDots: {
    flexDirection: 'row',
    gap: 4,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2d2d4d',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8a8ab5',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  additionalStats: {
    marginBottom: 24,
  },
  combatStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  combatStat: {
    width: (SCREEN_WIDTH - 64) / 2,
    backgroundColor: '#252547',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a6d',
  },
  combatStatIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  combatStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  combatStatLabel: {
    fontSize: 10,
    color: '#8a8ab5',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resourcesSection: {
    marginBottom: 24,
  },
  resourcesGrid: {
    gap: 12,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252547',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3a3a6d',
  },
  resourceIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceLabel: {
    fontSize: 12,
    color: '#8a8ab5',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  resourceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  additionalInfo: {
    marginBottom: 24,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#252547',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3a3a6d',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8a8ab5',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  pointsNotification: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  pointsNotificationText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: '#ff4757',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b81',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default StatusScreen;