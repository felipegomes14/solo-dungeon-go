import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const QuizGame = ({ dungeon, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      question: "Qual é a capital do Brasil?",
      options: ["Rio de Janeiro", "Brasília", "São Paulo", "Salvador"],
      correct: 1
    },
    {
      question: "Quantos lados tem um hexágono?",
      options: ["4", "5", "6", "7"],
      correct: 2
    },
    {
      question: "Quem escreveu 'Dom Quixote'?",
      options: ["Machado de Assis", "Miguel de Cervantes", "William Shakespeare", "Fernando Pessoa"],
      correct: 1
    }
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + 1);
      Alert.alert('✅ Correto!', 'Resposta certa!');
    } else {
      Alert.alert('❌ Errado!', 'Tente a próxima pergunta.');
    }

    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 1000);
    } else {
      const quizSuccess = score >= 2;
      setTimeout(() => {
        if (quizSuccess) {
          Alert.alert('🎉 Quiz completo!', `Você acertou ${score}/${questions.length} perguntas!`);
          
          const recompensa = {
            xp: dungeon.difficulty * 25,
            gold: dungeon.difficulty * 20,
            itens: [
              { type: 'potion', name: 'Poção de Mana', effect: 'mana', value: 25 },
              { type: 'scroll', name: 'Pergaminho de Sabedoria', effect: 'xp', value: 50 }
            ]
          };
          
          onComplete(recompensa);
        } else {
          Alert.alert('💀 Quiz falhou!', `Apenas ${score}/${questions.length} corretas. Tente novamente!`);
          onClose();
        }
      }, 1500);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>❓ Quiz da Dungeon {dungeon.rank}</Text>
      <Text style={styles.score}>Pontuação: {score}/{currentQuestion}</Text>
      
      <View style={styles.questionContainer}>
        <Text style={styles.questionNumber}>Pergunta {currentQuestion + 1}/{questions.length}</Text>
        <Text style={styles.questionText}>{currentQ.question}</Text>
        
        {currentQ.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.optionButton}
            onPress={() => handleAnswer(index)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text style={styles.closeButtonText}>Desistir</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffde7',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#d35400'
  },
  score: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#e67e22',
    fontWeight: 'bold'
  },
  questionContainer: {
    marginBottom: 30
  },
  questionNumber: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50'
  },
  optionButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#2980b9'
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16
  }
});

export default QuizGame;