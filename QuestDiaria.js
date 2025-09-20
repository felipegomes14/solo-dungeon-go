import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Alert,
  ScrollView,
  BackHandler,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente de carregamento
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <View style={styles.loadingContent}>
      <ActivityIndicator size="large" color="#ffcc00" />
      <Text style={styles.loadingText}>Carregando Missões Diárias...</Text>
      <Text style={styles.loadingSubtext}>Preparando seus desafios heroicos</Text>
    </View>
  </View>
);

// Componente de objetivo individual
const GoalItem = ({ goal, onUpdate, isCompleted }) => {
  const isDecimal = goal.unit === 'litros' || goal.unit === 'km';
  const current = isDecimal ? goal.current.toFixed(2) : Math.floor(goal.current);
  const [customValue, setCustomValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCustomUpdate = () => {
    const value = parseFloat(customValue);
    if (!isNaN(value) && value >= 0 && value <= goal.target) {
      onUpdate(value);
      setCustomValue('');
      setShowInput(false);
    } else {
      Alert.alert('Valor inválido', `Digite um valor entre 0 e ${goal.target}`);
    }
  };

  const getProgressColor = () => {
    const progress = (goal.current / goal.target) * 100;
    if (progress >= 100) return '#00ff00';
    if (progress >= 75) return '#4CAF50';
    if (progress >= 50) return '#FFA500';
    if (progress >= 25) return '#FF6B00';
    return '#FF4757';
  };

  return (
    <View style={[styles.goalItem, isCompleted && styles.goalItemCompleted]}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalName}>{goal.name}</Text>
        <Text style={styles.goalTarget}>Meta: {goal.target} {goal.unit}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { 
                width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
                backgroundColor: getProgressColor()
              }
            ]} 
          />
        </View>
        <Text style={[styles.progressText, isCompleted && styles.completed]}>
          {current}/{goal.target}
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        {showInput ? (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder={`0-${goal.target}`}
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={customValue}
              onChangeText={setCustomValue}
              autoFocus={true}
              maxLength={4}
            />
            <View style={styles.inputButtons}>
              <TouchableOpacity 
                style={[styles.inputButton, styles.inputConfirmButton]}
                onPress={handleCustomUpdate}
              >
                <Text style={styles.inputButtonText}>✓</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.inputButton, styles.inputCancelButton]}
                onPress={() => setShowInput(false)}
              >
                <Text style={styles.inputButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.setValueButton}
            onPress={() => setShowInput(true)}
            disabled={isCompleted}
          >
            <Text style={styles.setValueButtonText}>Definir Valor</Text>
          </TouchableOpacity>
        )}

        <View style={styles.quickControls}>
          <TouchableOpacity 
            style={[styles.quickButton, styles.quickMinusButton]}
            onPress={() => onUpdate(Math.max(0, goal.current - (isDecimal ? 0.5 : 1)))}
            disabled={isCompleted}
          >
            <Text style={styles.quickButtonText}>-1</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.quickButton, styles.quickAddButton]}
            onPress={() => onUpdate(goal.current + (isDecimal ? 0.5 : 1))}
            disabled={isCompleted || goal.current >= goal.target}
          >
            <Text style={styles.quickButtonText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isCompleted && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedBadgeText}>✓ CONCLUÍDO</Text>
        </View>
      )}
    </View>
  );
};

const QuestDiaria = ({ player, setPlayer, visible, onClose }) => {
  const [questState, setQuestState] = useState(null);
  const [totalSeconds, setTotalSeconds] = useState(24 * 60 * 60);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  // Estado inicial das quests com flexões limitadas a 50
  const initialQuestState = {
    water: { current: 0, target: 2, name: "💧 Ingestão de Água", unit: "litros" },
    pushup: { current: 0, target: 50, name: "💪 Flexões", unit: "vezes" },
    squat: { current: 0, target: 30, name: "🦵 Agachamentos", unit: "vezes" },
    abdominal: { current: 0, target: 25, name: "🔺 Abdominais", unit: "vezes" },
    run: { current: 0, target: 5, name: "🏃 Corrida/Caminhada", unit: "km" },
    completed: false,
    finished: false,
    lastUpdated: null
  };

  // Verificar se precisa resetar as atividades (após 24 horas)
  const shouldResetActivities = (lastUpdated) => {
    if (!lastUpdated) return true;
    
    const lastUpdateTime = new Date(lastUpdated).getTime();
    const currentTime = new Date().getTime();
    const hoursDiff = Math.abs(currentTime - lastUpdateTime) / (1000 * 60 * 60);
    
    return hoursDiff >= 24;
  };

  // Configurar botão de voltar do Android
  useEffect(() => {
    if (visible) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleClose();
          return true;
        }
      );

      return () => backHandler.remove();
    }
  }, [visible]);

  // Configurar e limpar timer
  useEffect(() => {
    if (visible && questState && !questState.finished) {
      const interval = setInterval(() => {
        setTotalSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Quando o tempo zera, resetamos automaticamente as atividades
            resetActivities();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [visible, questState]);

  // Carregar quests quando o modal abrir
  useEffect(() => {
    if (visible) {
      loadQuestProgress();
    } else {
      setIsLoading(true);
      setError(null);
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    }
  }, [visible]);

  const handleClose = () => {
    onClose();
    return true;
  };

  // Função para resetar as atividades
  const resetActivities = async () => {
    try {
      const now = new Date().toISOString();
      await AsyncStorage.setItem('soloDungeonQuestProgress', JSON.stringify({
        ...initialQuestState,
        lastUpdated: now
      }));
      await AsyncStorage.setItem('soloDungeonLastReset', JSON.stringify(now));
      setQuestState(initialQuestState);
      setTotalSeconds(24 * 60 * 60);
      
      Alert.alert(
        "🔄 Missões Resetadas", 
        "Suas missões diárias foram renovadas! Novos desafios esperam por você."
      );
    } catch (error) {
      console.error('Erro ao resetar atividades:', error);
    }
  };

  const loadQuestProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const savedProgress = await AsyncStorage.getItem('soloDungeonQuestProgress');
      const savedLastReset = await AsyncStorage.getItem('soloDungeonLastReset');
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        const lastReset = savedLastReset ? new Date(JSON.parse(savedLastReset)) : new Date();
        
        // Verificar se já passaram 24 horas desde o último reset
        if (shouldResetActivities(lastReset)) {
          // Resetar atividades automaticamente
          await resetActivities();
        } else {
          // Continuar com o progresso salvo
          setQuestState(progress);
          if (progress.lastUpdated && !progress.finished) {
            const now = new Date();
            const lastUpdated = new Date(progress.lastUpdated);
            const elapsedSeconds = Math.floor((now - lastUpdated) / 1000);
            setTotalSeconds(prev => Math.max(0, 24 * 60 * 60 - elapsedSeconds));
          }
        }
      } else {
        // Primeira execução - inicializar
        const now = new Date().toISOString();
        await AsyncStorage.setItem('soloDungeonQuestProgress', JSON.stringify({
          ...initialQuestState,
          lastUpdated: now
        }));
        await AsyncStorage.setItem('soloDungeonLastReset', JSON.stringify(now));
        setQuestState(initialQuestState);
        setTotalSeconds(24 * 60 * 60);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      setError('Erro ao carregar missões');
      setQuestState(initialQuestState);
      setTotalSeconds(24 * 60 * 60);
      setIsLoading(false);
    }
  };

  const saveQuestProgress = async (newState) => {
    try {
      await AsyncStorage.setItem('soloDungeonQuestProgress', JSON.stringify({
        ...newState,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    }
  };

  const updateGoal = useCallback((goalKey, newValue) => {
    if (!questState || questState.finished) return;
    
    setQuestState(prevState => {
      const updatedValue = Math.min(newValue, prevState[goalKey].target);
      const newState = {
        ...prevState,
        [goalKey]: {
          ...prevState[goalKey],
          current: parseFloat(updatedValue.toFixed(2))
        }
      };
      
      const allCompleted = 
        newState.water.current >= newState.water.target &&
        newState.pushup.current >= newState.pushup.target &&
        newState.squat.current >= newState.squat.target &&
        newState.abdominal.current >= newState.abdominal.target &&
        newState.run.current >= newState.run.target;
      
      newState.completed = allCompleted;
      saveQuestProgress(newState);
      
      return newState;
    });
  }, [questState]);

  const finishQuest = () => {
    if (!questState || !questState.completed || questState.finished) {
      Alert.alert("Atenção", "Complete todas as missões primeiro!");
      return;
    }
    
    if (player && setPlayer) {
      setPlayer(prevPlayer => {
        const newXp = prevPlayer.xp + 100;
        let newLevel = prevPlayer.level;
        let xpRestante = newXp;
        
        while (xpRestante >= newLevel * 100) {
          xpRestante -= newLevel * 100;
          newLevel++;
        }
        
        if (newLevel > prevPlayer.level) {
          Alert.alert("🎉 Level Up!", `Você alcançou o nível ${newLevel} completando a Quest Diária!`);
          
          return {
            ...prevPlayer,
            xp: xpRestante,
            level: newLevel,
            maxHp: prevPlayer.maxHp + 20,
            hp: prevPlayer.maxHp + 20,
            atk: prevPlayer.atk + 5,
            def: prevPlayer.def + 2,
            maxMana: prevPlayer.maxMana + 10,
            mana: prevPlayer.maxMana + 10
          };
        }
        
        return {
          ...prevPlayer,
          xp: newXp
        };
      });
    }
    
    Alert.alert("🏆 Missão Cumprida!", "Você ganhou 100 XP por completar a Quest Diária!");
    
    setQuestState(prevState => ({
      ...prevState,
      finished: true
    }));
    
    saveQuestProgress({ ...questState, finished: true });
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateProgress = () => {
    if (!questState) return 0;
    const totalGoals = 5;
    let completedGoals = 0;
    
    if (questState.water.current >= questState.water.target) completedGoals++;
    if (questState.pushup.current >= questState.pushup.target) completedGoals++;
    if (questState.squat.current >= questState.squat.target) completedGoals++;
    if (questState.abdominal.current >= questState.abdominal.target) completedGoals++;
    if (questState.run.current >= questState.run.target) completedGoals++;
    
    return (completedGoals / totalGoals) * 100;
  };

  if (!visible) return null;

  if (isLoading) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <LoadingScreen />
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Erro</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleClose}
          >
            <Text style={styles.backButtonText}>Voltar ao Jogo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  if (!questState) {
    return (
      <Modal visible={visible} animationType="slide" transparent={false}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>❌ Erro</Text>
          <Text style={styles.errorText}>Não foi possível carregar as missões</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleClose}
          >
            <Text style={styles.backButtonText}>Voltar ao Jogo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const progressPercentage = calculateProgress();
  const isTimeUp = totalSeconds === 0;

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🎯 QUEST DIÁRIA</Text>
            <Text style={styles.subtitle}>Desafios do Guerreiro Moderno</Text>
            
            <View style={styles.timerContainer}>
              <Text style={[styles.timer, isTimeUp && styles.timerExpired]}>
                ⏰ {formatTime(totalSeconds)}
              </Text>
              {isTimeUp && (
                <Text style={styles.timeWarning}>Tempo esgotado! Atividades resetadas</Text>
              )}
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${progressPercentage}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progressPercentage)}% Completo
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.goalsContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>📋 MISSÕES DO DIA</Text>
          
          {Object.entries(questState).map(([key, goal]) => {
            if (key === 'completed' || key === 'finished' || key === 'lastUpdated') return null;
            
            const isCompleted = goal.current >= goal.target;
            
            return (
              <GoalItem
                key={key}
                goal={goal}
                onUpdate={(value) => updateGoal(key, value)}
                isCompleted={isCompleted}
              />
            );
          })}
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={[styles.warning, isTimeUp && styles.warningExpired]}>
            <Text style={styles.warningText}>
              {isTimeUp ? '🔄 ATIVIDADES RENOVADAS!' : '⚠️ COMPLETE EM 24 HORAS!'}
            </Text>
          </View>
          
          <Text style={[styles.reward, questState.completed && styles.completed]}>
            {questState.finished ? '✅ 100 XP RECEBIDOS' : '🎁 Recompensa: 100 XP'}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.finishButton, 
              (!questState.completed || questState.finished || isTimeUp) && styles.finishButtonDisabled
            ]}
            onPress={finishQuest}
            disabled={!questState.completed || questState.finished || isTimeUp}
          >
            <Text style={styles.finishButtonText}>
              {questState.finished ? '✅ CONCLUÍDO' : isTimeUp ? '🔄 NOVAS MISSÕES' : '🎯 CONCLUIR MISSÃO'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleClose}
          >
            <Text style={styles.backButtonText}>← VOLTAR À AVENTURA</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1f',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1f',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(58, 58, 109, 0.3)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ffcc00',
  },
  loadingText: {
    color: '#ffcc00',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  loadingSubtext: {
    color: '#a0a0c0',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1f',
    padding: 20,
  },
  errorTitle: {
    fontSize: 28,
    color: '#ff5555',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 16,
    lineHeight: 24,
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #3a3a6d 0%, #2a2a5d 100%)',
    padding: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
    marginRight: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 204, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    marginBottom: 20,
    textAlign: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  timer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 25,
    fontSize: 18,
    color: '#4CAF50',
    borderWidth: 2,
    borderColor: '#4CAF50',
    fontWeight: 'bold',
    minWidth: 120,
    textAlign: 'center',
  },
  timerExpired: {
    color: '#ff4757',
    borderColor: '#ff4757',
  },
  timeWarning: {
    color: '#ff4757',
    fontSize: 12,
    marginTop: 8,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '85%',
    height: 12,
    backgroundColor: '#2a2a4a',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'linear-gradient(90deg, #4CAF50 0%, #00ff00 100%)',
    borderRadius: 6,
  },
  progressText: {
    color: '#a0a0c0',
    fontSize: 12,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff5555',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ff0000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  goalsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0d0d1a',
  },
  sectionTitle: {
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 22,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(255, 204, 0, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  goalItem: {
    backgroundColor: 'rgba(30, 30, 60, 0.6)',
    padding: 20,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4e4e8d',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  goalItemCompleted: {
    borderColor: '#00ff00',
    backgroundColor: 'rgba(0, 255, 0, 0.1)',
  },
  goalHeader: {
    marginBottom: 15,
  },
  goalName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ffcc00',
    fontSize: 18,
  },
  goalTarget: {
    fontSize: 14,
    color: '#a0a0c0',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#2a2a4a',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 16,
    color: '#ffcc00',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completed: {
    color: '#00ff00',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  customInput: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: '#4e4e8d',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    marginRight: 8,
    textAlign: 'center',
  },
  inputButtons: {
    flexDirection: 'row',
  },
  inputButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  inputConfirmButton: {
    backgroundColor: '#4CAF50',
  },
  inputCancelButton: {
    backgroundColor: '#ff4757',
  },
  inputButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  setValueButton: {
    backgroundColor: 'rgba(58, 58, 109, 0.8)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4e4e8d',
    flex: 1,
    marginRight: 10,
  },
  setValueButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  quickControls: {
    flexDirection: 'row',
  },
  quickButton: {
    width: 50,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  quickMinusButton: {
    backgroundColor: '#ff4757',
  },
  quickAddButton: {
    backgroundColor: '#4CAF50',
  },
  quickButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00ff00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footer: {
    padding: 25,
    backgroundColor: 'rgba(13, 13, 26, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#4e4e8d',
  },
  warning: {
    backgroundColor: 'rgba(120, 0, 0, 0.4)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff0000',
  },
  warningExpired: {
    backgroundColor: 'rgba(255, 71, 87, 0.4)',
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  reward: {
    marginVertical: 15,
    fontSize: 18,
    color: '#ffcc00',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: 'linear-gradient(135deg, #4CAF50 0%, #00ff00 100%)',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00ff00',
    marginBottom: 15,
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  finishButtonDisabled: {
    backgroundColor: '#555',
    borderColor: '#777',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  finishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  backButton: {
    backgroundColor: 'rgba(58, 58, 109, 0.8)',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4e4e8d',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuestDiaria;