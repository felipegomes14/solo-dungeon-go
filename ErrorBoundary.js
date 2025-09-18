// ErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>⚠️ Erro na Quest Diária</Text>
          <Text style={styles.errorText}>
            Algo deu errado ao carregar as missões diárias.
          </Text>
          <Text style={styles.errorSubText}>
            {this.state.error && this.state.error.toString()}
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={this.props.onBack}
          >
            <Text style={styles.backButtonText}>Voltar ao Jogo</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  errorTitle: {
    fontSize: 22,
    color: '#ff5555',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: '#e6e6e6',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  errorSubText: {
    color: '#a0a0a0',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 12,
  },
  backButton: {
    backgroundColor: '#3a3a6d',
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ErrorBoundary;