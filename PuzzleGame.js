import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing } from 'react-native';

const PuzzleGame = ({ dungeon, onClose, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();
  };

  // Puzzles organizados por nível de dificuldade (F a A)
  const puzzlesByDifficulty = {
    F: [
      {
        type: 'sequence',
        question: "Complete a sequência: 2, 4, 6, ?",
        options: ["7", "8", "9", "10"],
        correct: 1,
        explanation: "A sequência soma 2 a cada número: 2+2=4, 4+2=6, 6+2=8"
      },
      {
        type: 'pattern',
        question: "Qual figura completa o padrão? □ △ ○ □ △ ?",
        options: ["□", "△", "○", "●"],
        correct: 2,
        explanation: "O padrão se repete: quadrado, triângulo, círculo"
      },
      {
        type: 'math',
        question: "Se 1 maçã custa R$ 2, quanto custam 3 maçãs?",
        options: ["R$ 4", "R$ 5", "R$ 6", "R$ 7"],
        correct: 2,
        explanation: "3 maçãs × R$ 2 = R$ 6"
      }
    ],
    E: [
      {
        type: 'sequence',
        question: "Complete: 1, 3, 5, 7, ?",
        options: ["8", "9", "10", "11"],
        correct: 1,
        explanation: "Sequência de números ímpares: 1,3,5,7,9"
      },
      {
        type: 'math',
        question: "Se 3x + 5 = 20, qual é o valor de x?",
        options: ["3", "4", "5", "6"],
        correct: 2,
        explanation: "3x = 15, então x = 5"
      },
      {
        type: 'pattern',
        question: "Qual figura completa: 🔺 🔴 ⬛ 🔺 🔴 ?",
        options: ["⬛", "🔺", "🔴", "🔷"],
        correct: 0,
        explanation: "Padrão: triângulo, círculo, quadrado, repete"
      }
    ],
    D: [
      {
        type: 'sequence',
        question: "Complete: 2, 3, 5, 7, 11, ?",
        options: ["13", "15", "17", "19"],
        correct: 0,
        explanation: "Sequência de números primos: 2,3,5,7,11,13"
      },
      {
        type: 'math',
        question: "Resolva: (8 + 5) × 2 - 3",
        options: ["20", "21", "22", "23"],
        correct: 3,
        explanation: "(13) × 2 - 3 = 26 - 3 = 23"
      },
      {
        type: 'pattern',
        question: "Qual número completa: 1, 1, 2, 3, 5, ?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "Sequência de Fibonacci: 1+1=2, 1+2=3, 2+3=5, 3+5=8"
      }
    ],
    C: [
      {
        type: 'sequence',
        question: "Complete: 1, 4, 9, 16, 25, ?",
        options: ["36", "49", "64", "81"],
        correct: 0,
        explanation: "Sequência de quadrados: 1², 2², 3², 4², 5², 6²=36"
      },
      {
        type: 'math',
        question: "Resolva: 3² + 4² × 2",
        options: ["25", "41", "50", "98"],
        correct: 1,
        explanation: "3²=9, 4²=16, 16×2=32, 9+32=41"
      },
      {
        type: 'pattern',
        question: "Qual número completa: 1, 2, 6, 24, 120, ?",
        options: ["240", "480", "720", "840"],
        correct: 2,
        explanation: "Fatorial: 1!=1, 2!=2, 3!=6, 4!=24, 5!=120, 6!=720"
      }
    ],
    B: [
      {
        type: 'sequence',
        question: "Complete: 1, 3, 6, 10, 15, ?",
        options: ["20", "21", "22", "23"],
        correct: 1,
        explanation: "Números triangulares: 1, 1+2=3, 3+3=6, 6+4=10, 10+5=15, 15+6=21"
      },
      {
        type: 'math',
        question: "Resolva: 2³ + 3² × 4",
        options: ["32", "44", "52", "68"],
        correct: 1,
        explanation: "2³=8, 3²=9, 9×4=36, 8+36=44"
      },
      {
        type: 'pattern',
        question: "Qual número completa: 0, 1, 1, 2, 4, 7, 13, ?",
        options: ["20", "21", "24", "25"],
        correct: 2,
        explanation: "Sequência de Tribonacci: cada número é soma dos 3 anteriores: 4+7+13=24"
      }
    ],
    A: [
      {
        type: 'sequence',
        question: "Complete: 2, 12, 1112, 3112, 132112, ?",
        options: ["1113122112", "311311222112", "13211321322112", "1113122113121113222112"],
        correct: 0,
        explanation: "Sequência look-and-say: 'dois 1s, um 2, dois 1s' = 1113122112"
      },
      {
        type: 'math',
        question: "Resolva: ∫(2x + 3) dx de 0 a 2",
        options: ["8", "10", "12", "14"],
        correct: 1,
        explanation: "∫(2x+3)dx = x²+3x, de 0 a 2: (4+6)-(0+0)=10"
      },
      {
        type: 'pattern',
        question: "Qual número completa: 1, 11, 21, 1211, 111221, ?",
        options: ["312211", "321122", "212211", "122131"],
        correct: 0,
        explanation: "Sequência look-and-say: 'um 1'=11, 'dois 1s'=21, 'um 2, um 1'=1211, 'um 1, um 2, dois 1s'=111221, 'três 1s, dois 2s, um 1'=312211"
      }
    ]
  };

  // Seleciona 3 puzzles aleatórios baseados no nível da dungeon
  const getRandomPuzzles = () => {
    const difficultyPuzzles = puzzlesByDifficulty[dungeon.rank] || puzzlesByDifficulty.F;
    const shuffled = [...difficultyPuzzles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [puzzles] = useState(getRandomPuzzles());

  const handleAnswer = (selectedIndex) => {
    if (gameFinished) return;

    animateButton();

    if (selectedIndex === puzzles[currentPuzzle].correct) {
      const newSolved = puzzlesSolved + 1;
      setPuzzlesSolved(newSolved);
      Alert.alert('✅ Correto!', puzzles[currentPuzzle].explanation);
    } else {
      Alert.alert('❌ Errado!', `A resposta correta era: ${puzzles[currentPuzzle].options[puzzles[currentPuzzle].correct]}`);
    }

    if (currentPuzzle < puzzles.length - 1) {
      setTimeout(() => setCurrentPuzzle(currentPuzzle + 1), 1000);
    } else {
      setGameFinished(true);
      setTimeout(() => {
        const puzzleSuccess = puzzlesSolved >= 2;
        
        if (puzzleSuccess) {
          Alert.alert('🎉 Puzzles resolvidos!', `Você acertou ${puzzlesSolved}/${puzzles.length} puzzles!`);
          
          const recompensa = {
            xp: dungeon.difficulty * 30,
            gold: dungeon.difficulty * 25,
            itens: [
              { 
                id: Date.now(), 
                type: 'scroll', 
                name: 'Pergaminho da Inteligência', 
                effect: 'xp', 
                value: 40 
              }
            ]
          };
          
          onComplete(recompensa);
        } else {
          Alert.alert('💀 Puzzles falhou!', `Apenas ${puzzlesSolved}/${puzzles.length} corretos. Tente novamente!`);
          onClose();
        }
      }, 1500);
    }
  };

  const currentP = puzzles[currentPuzzle];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 PUZZLE {dungeon.rank}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{puzzlesSolved}/{puzzles.length}</Text>
        </View>
      </View>

      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>Dificuldade: {dungeon.rank}</Text>
      </View>

      {!gameFinished ? (
        <View style={styles.puzzleContainer}>
          <Text style={styles.puzzleNumber}>Puzzle {currentPuzzle + 1}/{puzzles.length}</Text>
          <Text style={styles.puzzleType}>{currentP.type.toUpperCase()}</Text>
          
          <View style={styles.questionCard}>
            <Text style={styles.puzzleText}>{currentP.question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {currentP.options.map((option, index) => (
              <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleAnswer(index)}
                  disabled={gameFinished}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Processando resultado...</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>🚪 SAIR</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0f0f1f',
    justifyContent: 'center'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(255, 215, 0, 0.4)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreContainer: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#9370DB',
  },
  score: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  difficultyBadge: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3498db',
  },
  difficultyText: {
    color: '#3498db',
    fontWeight: 'bold',
    fontSize: 14,
  },
  puzzleContainer: {
    marginBottom: 30,
  },
  puzzleNumber: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 10,
  },
  puzzleType: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  questionCard: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  puzzleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
    lineHeight: 28,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2980b9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c0392b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resultText: {
    fontSize: 18,
    color: '#BDC3C7',
    fontWeight: 'bold',
  },
});

export default PuzzleGame;