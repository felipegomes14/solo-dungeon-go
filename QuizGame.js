import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const QuizGame = ({ dungeon, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

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
      },
      {
        question: "Que cor é formada pela mistura de azul e amarelo?",
        options: ["Verde", "Roxo", "Laranja", "Marrom"],
        correct: 0
      },
      {
        question: "Quantos dias tem uma semana?",
        options: ["5", "6", "7", "8"],
        correct: 2
      },
      {
        question: "Qual é o maior planeta do sistema solar?",
        options: ["Terra", "Marte", "Júpiter", "Saturno"],
        correct: 2
      },
      {
        question: "Que instrumento tem cordas e é tocado com arco?",
        options: ["Violão", "Piano", "Violino", "Bateria"],
        correct: 2
      },
      {
        question: "Qual fruta é conhecida como 'rei das frutas' no Brasil?",
        options: ["Maçã", "Banana", "Manga", "Uva"],
        correct: 2
      },
      {
        question: "Em que continente fica o Brasil?",
        options: ["Europa", "Ásia", "América do Sul", "África"],
        correct: 2
      },
      {
        question: "Que estação vem depois do verão?",
        options: ["Primavera", "Inverno", "Outono", "Verão de novo"],
        correct: 2
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
      },
      {
        question: "Que país tem a forma de uma bota?",
        options: ["França", "Itália", "Espanha", "Portugal"],
        correct: 1
      },
      {
        question: "Qual é o maior oceano do mundo?",
        options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
        correct: 2
      },
      {
        question: "Que animal é o símbolo da Austrália?",
        options: ["Canguru", "Coala", "Emu", "Ornitorrinco"],
        correct: 0
      },
      {
        question: "Quantos anos tem um século?",
        options: ["10", "50", "100", "1000"],
        correct: 2
      },
      {
        question: "Qual é a moeda oficial do Japão?",
        options: ["Yuan", "Won", "Yen", "Dólar"],
        correct: 2
      },
      {
        question: "Que planeta é conhecido como 'Planeta Vermelho'?",
        options: ["Vênus", "Marte", "Júpiter", "Saturno"],
        correct: 1
      },
      {
        question: "Qual é a capital da Argentina?",
        options: ["Buenos Aires", "Santiago", "Lima", "Montevidéu"],
        correct: 0
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
      },
      {
        question: "Quantos elementos tem a tabela periódica?",
        options: ["92", "118", "150", "206"],
        correct: 1
      },
      {
        question: "Qual é a montanha mais alta do mundo?",
        options: ["K2", "Monte Everest", "Mont Blanc", "Kilimanjaro"],
        correct: 1
      },
      {
        question: "Que escritor brasileiro escreveu 'O Cortiço'?",
        options: ["Machado de Assis", "Aluísio Azevedo", "José de Alencar", "Graciliano Ramos"],
        correct: 1
      },
      {
        question: "Qual é o maior deserto do mundo?",
        options: ["Deserto do Saara", "Deserto de Gobi", "Deserto da Arábia", "Antártida"],
        correct: 3
      },
      {
        question: "Que planeta tem anéis visíveis?",
        options: ["Júpiter", "Saturno", "Urano", "Netuno"],
        correct: 1
      },
      {
        question: "Qual é a capital da Rússia?",
        options: ["São Petersburgo", "Moscou", "Kiev", "Varsóvia"],
        correct: 1
      },
      {
        question: "Que ano começou a Segunda Guerra Mundial?",
        options: ["1914", "1939", "1941", "1945"],
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
      },
      {
        question: "Qual é o país com maior área territorial do mundo?",
        options: ["Canadá", "China", "Estados Unidos", "Rússia"],
        correct: 3
      },
      {
        question: "Que compositor era surdo?",
        options: ["Mozart", "Beethoven", "Bach", "Chopin"],
        correct: 1
      },
      {
        question: "Qual é o elemento mais abundante na crosta terrestre?",
        options: ["Oxigênio", "Silício", "Alumínio", "Ferro"],
        correct: 0
      },
      {
        question: "Que império foi liderado por Montezuma?",
        options: ["Inca", "Asteca", "Maiá", "Tolteca"],
        correct: 1
      },
      {
        question: "Qual é a velocidade da luz no vácuo?",
        options: ["300.000 km/s", "150.000 km/s", "450.000 km/s", "600.000 km/s"],
        correct: 0
      },
      {
        question: "Que escritor criou 'Harry Potter'?",
        options: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "C.S. Lewis"],
        correct: 1
      },
      {
        question: "Qual é o menor país do mundo?",
        options: ["Mônaco", "Vaticano", "San Marino", "Liechtenstein"],
        correct: 1
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
      },
      {
        question: "Qual é a capital da Austrália?",
        options: ["Sydney", "Melbourne", "Canberra", "Perth"],
        correct: 2
      },
      {
        question: "Que filósofo disse 'Penso, logo existo'?",
        options: ["Platão", "Aristóteles", "Descartes", "Kant"],
        correct: 2
      },
      {
        question: "Qual é o metal mais condutor de eletricidade?",
        options: ["Ouro", "Prata", "Cobre", "Alumínio"],
        correct: 1
      },
      {
        question: "Que país tem a bandeira com uma folha de maple?",
        options: ["Estados Unidos", "Canadá", "Austrália", "Nova Zelândia"],
        correct: 1
      },
      {
        question: "Qual é o livro mais vendido do mundo depois da Bíblia?",
        options: ["Dom Quixote", "Um Conto de Duas Cidades", "O Pequeno Príncipe", "Harry Potter"],
        correct: 0
      },
      {
        question: "Que cientista propôs as leis do movimento?",
        options: ["Galileu", "Newton", "Einstein", "Copérnico"],
        correct: 1
      },
      {
        question: "Qual é o rio mais longo do mundo?",
        options: ["Amazonas", "Nilo", "Mississippi", "Yangtzé"],
        correct: 0
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
      },
      {
        question: "Qual é a fórmula de Bhaskara?",
        options: ["x = -b ± √(b² - 4ac)/2a", "x = b ± √(b² - ac)/2a", "x = -b ± √(b² + 4ac)/2a", "x = b ± √(b² + ac)/2a"],
        correct: 0
      },
      {
        question: "Que teórico propôs a psicanálise?",
        options: ["Carl Jung", "Sigmund Freud", "B.F. Skinner", "Ivan Pavlov"],
        correct: 1
      },
      {
        question: "Qual é a capital do Cazaquistão?",
        options: ["Astana", "Bishkek", "Tashkent", "Dushanbe"],
        correct: 0
      },
      {
        question: "Que elemento químico tem número atômico 79?",
        options: ["Prata", "Mercúrio", "Ouro", "Platina"],
        correct: 2
      },
      {
        question: "Qual pintor espanhol é conhecido por sua fase 'azul'?",
        options: ["Salvador Dalí", "Pablo Picasso", "Joan Miró", "Diego Velázquez"],
        correct: 1
      },
      {
        question: "Que filósofo escreveu 'Assim Falou Zaratustra'?",
        options: ["Friedrich Nietzsche", "Arthur Schopenhauer", "Immanuel Kant", "Jean-Paul Sartre"],
        correct: 0
      },
      {
        question: "Qual é a velocidade do som no ar?",
        options: ["340 m/s", "300 m/s", "400 m/s", "500 m/s"],
        correct: 0
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
              },
              { 
                id: Date.now() + 1, 
                type: 'scroll', 
                name: 'Pergaminho de Sabedoria', 
                effect: 'xp', 
                value: 50 
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
      <Text style={styles.title}>❓ Quiz da Dungeon {dungeon.rank}</Text>
      <Text style={styles.score}>Pontuação: {score}/{questions.length}</Text>
      <Text style={styles.difficulty}>Dificuldade: {dungeon.rank}</Text>
      
      {!quizFinished ? (
        <View style={styles.questionContainer}>
          <Text style={styles.questionNumber}>Pergunta {currentQuestion + 1}/{questions.length}</Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>
          
          {currentQ.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(index)}
              disabled={quizFinished}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
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
    marginBottom: 10,
    color: '#d35400'
  },
  score: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#e67e22',
    fontWeight: 'bold'
  },
  difficulty: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#7f8c8d',
    fontStyle: 'italic'
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
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  resultText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: 'bold'
  }
});

export default QuizGame;