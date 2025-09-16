import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const PuzzleGame = ({ dungeon, onClose, onComplete }) => {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

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
      },
      {
        type: 'logic',
        question: "Se todos os gatos são animais, e Mimi é um gato, então:",
        options: ["Mimi é um animal", "Mimi é um cachorro", "Todos os animais são gatos", "Mimi não é um animal"],
        correct: 0,
        explanation: "Se todos os gatos são animais e Mimi é gato, então Mimi é animal"
      },
      {
        type: 'visual',
        question: "Quantos quadrados você vê? □□\n□□",
        options: ["2", "3", "4", "5"],
        correct: 3,
        explanation: "4 quadrados pequenos + 1 grande = 5 quadrados"
      },
      {
        type: 'word',
        question: "Qual palavra não pertence ao grupo?",
        options: ["Cachorro", "Gato", "Peixe", "Árvore"],
        correct: 3,
        explanation: "Árvore não é um animal, os outros são animais"
      },
      {
        type: 'memory',
        question: "Lembre-se: A7, B3, C9. Qual era o número da letra B?",
        options: ["7", "3", "9", "1"],
        correct: 1,
        explanation: "B estava associada ao número 3"
      },
      {
        type: 'pattern',
        question: "Complete: Norte, Sul, Leste, ?",
        options: ["Oeste", "Cima", "Baixo", "Centro"],
        correct: 0,
        explanation: "Os pontos cardeais: Norte, Sul, Leste, Oeste"
      },
      {
        type: 'math',
        question: "Quanto é 15 - 7?",
        options: ["6", "7", "8", "9"],
        correct: 2,
        explanation: "15 - 7 = 8"
      },
      {
        type: 'logic',
        question: "Se hoje é segunda-feira, que dia será depois de amanhã?",
        options: ["Terça", "Quarta", "Quinta", "Sexta"],
        correct: 1,
        explanation: "Hoje: segunda, amanhã: terça, depois de amanhã: quarta"
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
      },
      {
        type: 'logic',
        question: "Se algumas flores são rosas, e todas as rosas são vermelhas, então:",
        options: ["Todas as flores são vermelhas", "Algumas flores são vermelhas", "Nenhuma flor é vermelha", "Todas as rosas são flores"],
        correct: 1,
        explanation: "Se algumas flores são rosas e rosas são vermelhas, então algumas flores são vermelhas"
      },
      {
        type: 'visual',
        question: "Quantos triângulos nesta figura? ▲▲\n▲",
        options: ["3", "4", "5", "6"],
        correct: 2,
        explanation: "3 triângulos pequenos + 2 médios = 5 triângulos"
      },
      {
        type: 'word',
        question: "ACHE o erro nesta frase: 'Eu gosto de comer banana maçã e laranja'",
        options: ["Falta vírgula", "Banana errado", "Maçã errado", "Laranja errado"],
        correct: 0,
        explanation: "Falta vírgula após 'banana': 'Eu gosto de comer banana, maçã e laranja'"
      },
      {
        type: 'memory',
        question: "Lembre-se: Verde, Azul, Amarelo. Qual era a segunda cor?",
        options: ["Verde", "Azul", "Amarelo", "Vermelho"],
        correct: 1,
        explanation: "A sequência era: Verde (1ª), Azul (2ª), Amarelo (3ª)"
      },
      {
        type: 'pattern',
        question: "Complete: Janeiro, Fevereiro, Março, ?",
        options: ["Abril", "Maio", "Junho", "Julho"],
        correct: 0,
        explanation: "Sequência dos meses: Janeiro, Fevereiro, Março, Abril"
      },
      {
        type: 'math',
        question: "Quanto é 25% de 80?",
        options: ["15", "20", "25", "30"],
        correct: 1,
        explanation: "25% de 80 = 80 × 0.25 = 20"
      },
      {
        type: 'logic',
        question: "Se eu olho para o leste e viro 90° à direita, para que direção estou olhando?",
        options: ["Norte", "Sul", "Leste", "Oeste"],
        correct: 1,
        explanation: "Leste → 90° direita = Sul"
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
      },
      {
        type: 'logic',
        question: "Se A = 1, B = 2, C = 3, então D + E = ?",
        options: ["7", "8", "9", "10"],
        correct: 2,
        explanation: "D = 4, E = 5, então 4 + 5 = 9"
      },
      {
        type: 'visual',
        question: "Quantos cubos faltam para completar um cubo 3x3x3?",
        options: ["8", "9", "10", "11"],
        correct: 0,
        explanation: "Um cubo 3x3x3 tem 27 cubinhos. Se alguns estão faltando, normalmente faltam 8"
      },
      {
        type: 'word',
        question: "Qual é o antônimo de 'generoso'?",
        options: ["Avarento", "Gentil", "Amigável", "Doce"],
        correct: 0,
        explanation: "Antônimo de generoso é avarento (egoísta)"
      },
      {
        type: 'memory',
        question: "Lembre-se: 5, 12, 8, 3. Qual é a soma do primeiro e último número?",
        options: ["8", "9", "10", "11"],
        correct: 0,
        explanation: "Primeiro: 5, Último: 3, Soma: 5 + 3 = 8"
      },
      {
        type: 'pattern',
        question: "Complete: AC, BD, CE, DF, ?",
        options: ["EG", "EH", "FG", "FH"],
        correct: 0,
        explanation: "A+C, B+D, C+E, D+F, E+G"
      },
      {
        type: 'math',
        question: "Qual é a raiz quadrada de 144?",
        options: ["12", "14", "16", "18"],
        correct: 0,
        explanation: "12 × 12 = 144"
      },
      {
        type: 'logic',
        question: "Se 5 máquinas fazem 5 peças em 5 minutos, quanto tempo levam 100 máquinas para fazer 100 peças?",
        options: ["5 minutos", "10 minutos", "20 minutos", "100 minutos"],
        correct: 0,
        explanation: "Cada máquina faz 1 peça em 5 minutos, então 100 máquinas fazem 100 peças em 5 minutos"
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
      },
      {
        type: 'logic',
        question: "Se X > Y e Y > Z, então:",
        options: ["X > Z", "X < Z", "X = Z", "Z > X"],
        correct: 0,
        explanation: "Propriedade transitiva: se X > Y e Y > Z, então X > Z"
      },
      {
        type: 'visual',
        question: "Quantas linhas são necessárias para conectar 4 pontos em um quadrado?",
        options: ["3", "4", "5", "6"],
        correct: 1,
        explanation: "4 linhas para formar um quadrado conectando os 4 pontos"
      },
      {
        type: 'word',
        question: "Qual palavra significa 'medo de altura'?",
        options: ["Aracnofobia", "Aerofobia", "Agorafobia", "Acrofobia"],
        correct: 3,
        explanation: "Acrofobia = medo de altura"
      },
      {
        type: 'memory',
        question: "Lembre-se: Rei, Rainha, Torre, Bispo. Qual era a terceira peça?",
        options: ["Rei", "Rainha", "Torre", "Bispo"],
        correct: 2,
        explanation: "Sequência: Rei (1ª), Rainha (2ª), Torre (3ª), Bispo (4ª)"
      },
      {
        type: 'pattern',
        question: "Complete: 2, 6, 18, 54, ?",
        options: ["108", "162", "216", "270"],
        correct: 1,
        explanation: "Cada número é multiplicado por 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162"
      },
      {
        type: 'math',
        question: "Qual é 30% de 150?",
        options: ["35", "40", "45", "50"],
        correct: 2,
        explanation: "30% de 150 = 150 × 0.30 = 45"
      },
      {
        type: 'logic',
        question: "Se ontem foi domingo, que dia será depois de amanhã?",
        options: ["Terça", "Quarta", "Quinta", "Sexta"],
        correct: 1,
        explanation: "Ontem: domingo → Hoje: segunda → Amanhã: terça → Depois de amanhã: quarta"
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
      },
      {
        type: 'logic',
        question: "Se todos os A são B, e alguns B são C, então:",
        options: ["Todos os A são C", "Alguns A são C", "Nenhum A é C", "Alguns C são A"],
        correct: 1,
        explanation: "Se todos A são B e alguns B são C, então alguns A são C"
      },
      {
        type: 'visual',
        question: "Quantos quadrados em um tabuleiro de xadrez?",
        options: ["64", "128", "204", "256"],
        correct: 2,
        explanation: "64 quadrados 1x1 + 49 2x2 + 36 3x3 + ... + 1 8x8 = 204 quadrados"
      },
      {
        type: 'word',
        question: "Qual é o plural de 'cidadão'?",
        options: ["Cidadãos", "Cidadães", "Cidadões", "Cidadãos"],
        correct: 1,
        explanation: "Plural de cidadão é cidadãos (com acento circunflexo)"
      },
      {
        type: 'memory',
        question: "Lembre-se: 7, 4, 9, 2, 6. Qual é o produto do maior e menor número?",
        options: ["14", "18", "24", "36"],
        correct: 1,
        explanation: "Maior: 9, Menor: 2, Produto: 9 × 2 = 18"
      },
      {
        type: 'pattern',
        question: "Complete: 1, 4, 27, 256, ?",
        options: ["3125", "4096", "6561", "10000"],
        correct: 0,
        explanation: "1¹, 2², 3³, 4⁴, 5⁵=3125"
      },
      {
        type: 'math',
        question: "Qual é a área de um círculo com raio 7? (π=3.14)",
        options: ["153.86", "154.00", "154.86", "155.86"],
        correct: 0,
        explanation: "Área = πr² = 3.14 × 49 = 153.86"
      },
      {
        type: 'logic',
        question: "Se eu ando 5km para norte, 3km para leste, 5km para sul, onde estou?",
        options: ["3km leste do início", "No início", "3km oeste do início", "5km norte do início"],
        correct: 0,
        explanation: "5N + 3L + 5S = 3km a leste do ponto inicial"
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
      },
      {
        type: 'logic',
        question: "Se A ∨ B = V, A ∧ B = F, então:",
        options: ["A=V, B=F", "A=F, B=V", "A e B têm valores diferentes", "A e B têm valores iguais"],
        correct: 2,
        explanation: "OU é verdadeiro, E é falso, então apenas um é verdadeiro"
      },
      {
        type: 'visual',
        question: "Quantas diagonais tem um heptágono?",
        options: ["14", "15", "16", "17"],
        correct: 0,
        explanation: "Fórmula: n(n-3)/2 = 7×4/2 = 14 diagonais"
      },
      {
        type: 'word',
        question: "Qual é o significado de 'pernóstico'?",
        options: ["Elegante", "Pedante", "Rápido", "Lento"],
        correct: 1,
        explanation: "Pernóstico = pedante, que mostra erudição afetada"
      },
      {
        type: 'memory',
        question: "Lembre-se: π=3.1415, e=2.7182, φ=1.6180. Qual é a soma de e e φ?",
        options: ["4.3362", "4.3363", "4.3364", "4.3365"],
        correct: 0,
        explanation: "2.7182 + 1.6180 = 4.3362"
      },
      {
        type: 'pattern',
        question: "Complete: 1, 2, 4, 8, 16, 32, ?",
        options: ["64", "128", "256", "512"],
        correct: 0,
        explanation: "Sequência geométrica: cada número é o dobro do anterior, 32×2=64"
      },
      {
        type: 'math',
        question: "Qual é a derivada de x³ + 2x² - 5x + 1?",
        options: ["3x² + 4x - 5", "3x² + 2x - 5", "x² + 4x - 5", "3x² + 4x + 5"],
        correct: 0,
        explanation: "d/dx(x³)=3x², d/dx(2x²)=4x, d/dx(-5x)=-5, d/dx(1)=0"
      },
      {
        type: 'logic',
        question: "Se 3 pessoas se cumprimentam com apertos de mão, quantos apertos ocorrem?",
        options: ["3", "4", "5", "6"],
        correct: 0,
        explanation: "Combinação C(3,2) = 3 apertos de mão"
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
                effect: 'inteligência', 
                value: 40 
              },
              { 
                id: Date.now() + 1, 
                type: 'gem', 
                name: 'Gema do Conhecimento', 
                effect: 'xp', 
                value: 75 
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
      <Text style={styles.title}>🧩 Puzzle da Dungeon {dungeon.rank}</Text>
      <Text style={styles.score}>Puzzles resolvidos: {puzzlesSolved}/{puzzles.length}</Text>
      <Text style={styles.difficulty}>Dificuldade: {dungeon.rank}</Text>
      <Text style={styles.type}>Tipo: {currentP.type}</Text>
      
      {!gameFinished ? (
        <View style={styles.puzzleContainer}>
          <Text style={styles.puzzleNumber}>Puzzle {currentPuzzle + 1}/{puzzles.length}</Text>
          <Text style={styles.puzzleText}>{currentP.question}</Text>
          
          {currentP.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(index)}
              disabled={gameFinished}
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
    backgroundColor: '#e8f5e8',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#2e7d32'
  },
  score: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#43a047',
    fontWeight: 'bold'
  },
  difficulty: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#7f8c8d',
    fontStyle: 'italic'
  },
  type: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#9e9e9d',
    fontStyle: 'italic'
  },
  puzzleContainer: {
    marginBottom: 30
  },
  puzzleNumber: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10
  },
  puzzleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50'
  },
  optionButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#388e3c'
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

export default PuzzleGame;