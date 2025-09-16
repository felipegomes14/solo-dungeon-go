// QuestDiaria.js
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  StyleSheet,
  Alert,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import correto

const QuestDiaria = ({ player, setPlayer, visible, onClose }) => {
  const [questState, setQuestState] = useState({
    water: { current: 0, target: 2, name: "Ingestão de Água", unit: "litros" },
    pushup: { current: 0, target: 20, name: "Flexões", unit: "vezes" },
    squat: { current: 0, target: 30, name: "Agachamentos", unit: "vezes" },
    abdominal: { current: 0, target: 25, name: "Abdominais", unit: "vezes" },
    run: { current: 0, target: 5, name: "Corrida/Caminhada", unit: "km" },
    completed: false,
    finished: false,
    lastUpdated: null
  });

  const [totalSeconds, setTotalSeconds] = useState(24 * 60 * 60);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    loadProgress();
    
    // Iniciar o timer quando o componente for montado
    startTimer();
    
    // Limpar intervalo quando o componente for desmontado
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('soloDungeonQuestProgress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        
        // Verificar se é do mesmo dia
        const today = new Date().toDateString();
        if (progress.lastUpdated && new Date(progress.lastUpdated).toDateString() === today) {
          setQuestState(progress);
        } else {
          // Reset da quest se for um novo dia
          resetDailyQuest();
        }
      }
    } catch (error) {
      console.log('Erro ao carregar progresso:', error);
    }
  };

  const saveProgress = async () => {
    try {
      const progressToSave = {
        ...questState,
        lastUpdated: new Date().toISOString()
      };
      await AsyncStorage.setItem('soloDungeonQuestProgress', JSON.stringify(progressToSave));
    } catch (error) {
      console.log('Erro ao salvar progresso:', error);
    }
  };

  const updateGoal = (goal, value) => {
    if (questState.finished) return;
    
    setQuestState(prevState => {
      const newCurrent = prevState[goal].current + value;
      const updatedValue = newCurrent > prevState[goal].target 
        ? prevState[goal].target 
        : newCurrent;
      
      const newState = {
        ...prevState,
        [goal]: {
          ...prevState[goal],
          current: updatedValue
        }
      };
      
      // Verificar conclusão após atualizar o estado
      setTimeout(() => checkCompletion(newState), 0);
      
      // Salvar progresso
      saveProgress();
      
      return newState;
    });
  };

  const checkCompletion = (state = questState) => {
    const allCompleted = 
      state.water.current >= state.water.target &&
      state.pushup.current >= state.pushup.target &&
      state.squat.current >= state.squat.target &&
      state.abdominal.current >= state.abdominal.target &&
      state.run.current >= state.run.target;
    
    if (allCompleted && !state.completed) {
      setQuestState(prevState => ({
        ...prevState,
        completed: true
      }));
    } else if (!allCompleted && state.completed) {
      setQuestState(prevState => ({
        ...prevState,
        completed: false
      }));
    }
  };

  const finishQuest = () => {
    if (questState.completed && !questState.finished) {
      // Adicionar XP ao jogador
      if (player && setPlayer) {
        setPlayer(prevPlayer => {
          const newXp = prevPlayer.xp + 100;
          let newLevel = prevPlayer.level;
          
          // Verificar level up
          if (newXp >= newLevel * 100) {
            newLevel++;
            Alert.alert("🎉 Level Up!", `Você alcançou o nível ${newLevel} completando a Quest Diária!`);
            
            return {
              ...prevPlayer,
              xp: newXp - ((newLevel - 1) * 100),
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
      
      // Feedback visual
      Alert.alert("Missão Cumprida!", "Você ganhou 100 XP por completar a Quest Diária!");
      
      setQuestState(prevState => ({
        ...prevState,
        finished: true
      }));
      
      saveProgress();
    }
  };

  const startTimer = () => {
    // Calcular tempo restante com base na última atualização
    if (questState.lastUpdated) {
      const now = new Date();
      const lastUpdated = new Date(questState.lastUpdated);
      const elapsedSeconds = Math.floor((now - lastUpdated) / 1000);
      setTotalSeconds(prev => Math.max(0, prev - elapsedSeconds));
    }
    
    // Configurar intervalo para atualizar a cada segundo
    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const resetDailyQuest = () => {
    const today = new Date().toDateString();
    const lastUpdated = questState.lastUpdated ? new Date(questState.lastUpdated).toDateString() : null;
    
    if (lastUpdated !== today) {
      setQuestState(prevState => {
        const newState = { ...prevState };
        
        // Reiniciar progresso
        for (const key in newState) {
          if (key !== 'completed' && key !== 'finished' && key !== 'lastUpdated') {
            newState[key].current = 0;
          }
        }
        
        newState.completed = false;
        newState.finished = false;
        
        return newState;
      });
      
      setTotalSeconds(24 * 60 * 60);
      saveProgress();
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Renderizar cada objetivo
  const renderGoal = (key, goal) => {
    const isDecimal = key === 'water' || key === 'run';
    const current = isDecimal ? goal.current.toFixed(2) : Math.floor(goal.current);
    const isCompleted = goal.current >= goal.target;
    
    return (
      <View key={key} style={styles.goalItem}>
        <View style={styles.goalInfo}>
          <Text style={styles.goalName}>{goal.name}</Text>
          <Text style={styles.goalTarget}>Meta: {goal.target} {goal.unit}</Text>
        </View>
        <View style={styles.goalProgress}>
          <Text style={[styles.progressText, isCompleted && styles.completed]}>
            {current}/{goal.target}
          </Text>
          <TouchableOpacity 
            style={styles.btnControl}
            onPress={() => updateGoal(key, key === 'water' || key === 'run' ? 0.5 : 1)}
          >
            <Text style={styles.btnControlText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>QUEST DIÁRIA</Text>
          <Text style={styles.subtitle}>Treine para se tornar um guerreiro</Text>
          <Text style={styles.timer}>
            Tempo restante: {formatTime(totalSeconds)}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>OBJETIVOS</Text>
          
          {Object.entries(questState).map(([key, goal]) => {
            if (key === 'completed' || key === 'finished' || key === 'lastUpdated') return null;
            return renderGoal(key, goal);
          })}
        </ScrollView>
        
        <View style={styles.footer}>
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              ATENÇÃO! SE A QUEST DIÁRIA NÃO FOR CONCLUÍDA, PENALIDADES SERÃO APLICADAS.
            </Text>
          </View>
          
          <Text style={[styles.reward, questState.completed && styles.completed]}>
            {questState.finished ? 'Recompensa: 100 XP (RECEBIDO)' : 'Recompensa: 100 XP'}
          </Text>
          
          <TouchableOpacity 
            style={[styles.finishButton, !questState.completed && styles.finishButtonDisabled]}
            onPress={finishQuest}
            disabled={!questState.completed || questState.finished}
          >
            <Text style={styles.finishButtonText}>
              {questState.finished ? 'QUEST CONCLUÍDA' : 'CONCLUIR QUEST'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  header: {
    backgroundColor: '#3a3a6d',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#ffcc00',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffcc00',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 204, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    marginBottom: 10,
  },
  timer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 20,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4e4e8d',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#ff5555',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  goalsContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    color: '#ffcc00',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  goalItem: {
    backgroundColor: 'rgba(30, 30, 60, 0.5)',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4e4e8d',
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#a0a0c0',
    fontSize: 16,
  },
  goalTarget: {
    fontSize: 12,
    color: '#a0a0c0',
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    marginRight: 10,
    fontSize: 14,
    color: '#ffcc00',
    minWidth: 70,
    textAlign: 'right',
  },
  btnControl: {
    backgroundColor: '#3a3a6d',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnControlText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#4e4e8d',
  },
  warning: {
    backgroundColor: 'rgba(120, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ff0000',
  },
  warningText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  reward: {
    marginVertical: 15,
    fontSize: 18,
    color: '#ffcc00',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#3a6d3a',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4e8d4e',
  },
  finishButtonDisabled: {
    backgroundColor: '#555',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  completed: {
    color: '#00ff00',
  },
});

export default QuestDiaria;