import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Easing } from 'react-native';

const QuizGame = ({ dungeon, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
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

  // Questões organizadas por nível de dificuldade (F a A)
  const questionsByDifficulty = {
    F: [
      {
        question: "Qual é a capital do Brasil?",
        options: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
        correct: 1
      },
      {
        question: "Quantos lados tem um triângulo?",
        options: ["2", "3", "4", "5"],
        correct: 1
      },
      {
        question: "Qual animal mia?",
        options: ["Cachorro", "Gato", "Vaca", "Galinha"],
        correct: 1
      }
    ],
    E: [
      {
        question: "Quantos lados tem um hexágono?",
        options: ["4", "5", "6", "7"],
        correct: 2
      },
      {
        question: "Quem escreveu 'Dom Quixote'?",
        options: ["Machado de Assis", "Miguel de Cervantes", "William Shakespeare", "Fernando Pessoa"],
        correct: 1
      },
      {
        question: "Qual é o elemento químico representado por 'O'?",
        options: ["Ouro", "Oxigênio", "Ósmio", "Osmio"],
        correct: 1
      }
    ],
    D: [
      {
        question: "Quem pintou 'Mona Lisa'?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correct: 2
      },
      {
        question: "Qual é o símbolo químico do ouro?",
        options: ["Au", "Ag", "Fe", "Cu"],
        correct: 0
      },
      {
        question: "Que idioma é falado no Brasil?",
        options: ["Espanhol", "Português", "Inglês", "Francês"],
        correct: 1
      }
    ],
    C: [
      {
        question: "Quem descobriu a penicilina?",
        options: ["Marie Curie", "Alexander Fleming", "Louis Pasteur", "Robert Koch"],
        correct: 1
      },
      {
        question: "Qual é o maior osso do corpo humano?",
        options: ["Fêmur", "Tíbia", "Úmero", "Crânio"],
        correct: 0
      },
      {
        question: "Que filósofo grego foi professor de Alexandre, o Grande?",
        options: ["Sócrates", "Platão", "Aristóteles", "Pitágoras"],
        correct: 2
      }
    ],
    B: [
      {
        question: "Quem formulou a teoria da relatividade?",
        options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Stephen Hawking"],
        correct: 1
      },
      {
        question: "Qual é a fórmula química da água?",
        options: ["H2O", "CO2", "O2", "NaCl"],
        correct: 0
      },
      {
        question: "Que pintor cortou a própria orelha?",
        options: ["Pablo Picasso", "Vincent van Gogh", "Salvador Dalí", "Claude Monet"],
        correct: 1
      }
    ],
    A: [
      {
        question: "Quem foi o primeiro presidente do Brasil?",
        options: ["Dom Pedro II", "Deodoro da Fonseca", "Getúlio Vargas", "Juscelino Kubitschek"],
        correct: 1
      },
      {
        question: "Qual é a unidade de medida da força no Sistema Internacional?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        correct: 2
      },
      {
        question: "Que compositor escreveu 'As Quatro Estações'?",
        options: ["Mozart", "Beethoven", "Vivaldi", "Bach"],
        correct: 2
      }
    ]
  };

  // Seleciona 3 perguntas aleatórias baseadas no nível da dungeon
  const getRandomQuestions = () => {
    const difficultyQuestions = questionsByDifficulty[dungeon.rank] || questionsByDifficulty.F;
    const shuffled = [...difficultyQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const [questions] = useState(getRandomQuestions());

  const handleAnswer = (selectedIndex) => {
    if (quizFinished) return;

    animateButton();

    let newScore = score;
    if (selectedIndex === questions[currentQuestion].correct) {
      newScore = score + 1;
      setScore(newScore);
      Alert.alert('✅ Correto!', 'Resposta certa!');
    } else {
      Alert.alert('❌ Errado!', 'Tente a próxima pergunta.');
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      setQuizFinished(true);
      setTimeout(() => {
        const quizSuccess = newScore >= 2;
        
        if (quizSuccess) {
          Alert.alert('🎉 Quiz completo!', `Você acertou ${newScore}/${questions.length} perguntas!`);
          
          const recompensa = {
            xp: dungeon.difficulty * 25,
            gold: dungeon.difficulty * 20,
            itens: [
              { 
                id: Date.now(), 
                type: 'potion', 
                name: 'Poção de Mana', 
                effect: 'mana', 
                value: 25 
              }
            ]
          };
          
          onComplete(recompensa);
        } else {
          Alert.alert('💀 Quiz falhou!', `Apenas ${newScore}/${questions.length} corretas. Tente novamente!`);
          onClose();
        }
      }, 1500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❓ QUIZ {dungeon.rank}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{score}/{questions.length}</Text>
        </View>
      </View>

      <View style={styles.difficultyBadge}>
        <Text style={styles.difficultyText}>Dificuldade: {dungeon.rank}</Text>
      </View>

      {!quizFinished ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Pergunta {currentQuestion + 1}/{questions.length}</Text>
          
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQ.question}</Text>
          </View>
          
          <View style={styles.optionsContainer}>
            {currentQ.options.map((option, index) => (
              <Animated.View key={index} style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => handleAnswer(index)}
                  disabled={quizFinished}
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
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e74c3c',
  },
  difficultyText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionContainer: {
    marginBottom: 30,
  },
  questionNumber: {
    fontSize: 16,
    color: '#BDC3C7',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: 'rgba(45, 45, 77, 0.8)',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4B0082',
  },
  questionText: {
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
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#c0392b',
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

export default QuizGame;