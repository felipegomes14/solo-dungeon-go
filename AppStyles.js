import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flex: 1 },
  map: StyleSheet.absoluteFillObject,
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  regenIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    padding: 10,
    borderRadius: 20,
    maxWidth: '80%',
  },
  regenText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    gap: 10
  },
  controlButton: {
    backgroundColor: '#4B0082',
    padding: 15,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  playerInfo: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 10,
    borderRadius: 10,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 2,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  completedMarker: {
    opacity: 0.6
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});