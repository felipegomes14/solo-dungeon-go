import { useState, useEffect } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";

const defaultCoords = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1
};

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permissão negada", "O app precisa de acesso ao GPS! Usando localização padrão.");
          setLocation({ coords: defaultCoords });
          setIsLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(pos);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        Alert.alert("Erro", "Não foi possível obter a localização. Usando localização padrão.");
        setLocation({ coords: defaultCoords });
        setIsLoading(false);
      }
    })();
  }, []);

  const getSafeCoords = () => {
    if (!location || !location.coords) {
      return defaultCoords;
    }
    return {
      latitude: location.coords.latitude || defaultCoords.latitude,
      longitude: location.coords.longitude || defaultCoords.longitude,
      latitudeDelta: location.coords.latitudeDelta || defaultCoords.latitudeDelta,
      longitudeDelta: location.coords.longitudeDelta || defaultCoords.longitudeDelta
    };
  };

  return {
    location,
    isLoading,
    safeCoords: getSafeCoords(),
    defaultCoords
  };
};

export default useLocation;