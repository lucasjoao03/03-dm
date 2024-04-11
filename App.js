import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import Constants from "expo-constants";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import CustomButton from "./src/components/CustomButton";

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imagem, setImagem] = useState(null);
  const [tipo, setTipo] = useState(Camera.Constants.Type.back);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const tirarFoto = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        setImagem(data.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const salvar = async () => {
    if (imagem) {
      try {
        const asset = await MediaLibrary.createAssetAsync(imagem);
        alert("foto salva");
        setImagem(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>Sem acesso para a câmera</Text>;
  }

  return (
    <View style={styles.container}>
      {!imagem ? (
        <Camera style={styles.camera} type={tipo} ref={cameraRef}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 30,
            }}
          >
            <CustomButton
              title="trocar camera"
              icon="camera"
              onPress={() => {
                setTipo(
                  tipo === CameraType.back ? CameraType.front : CameraType.back
                );
              }}
            />
          </View>
        </Camera>
      ) : (
        <Image style={styles.camera} />
      )}

      <View>
        {imagem ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 50,
            }}
          >
            <CustomButton
              title="tirar nova foto"
              onPress={() => setImagem(null)}
              icon="back"
            />
            <CustomButton title="salvar" onPress={salvar} icon="save" />
          </View>
        ) : (
          <CustomButton onPress={tirarFoto} icon="circle" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
    padding: 8,
  },
  button: {
    height: 40,
  },
  text: {
    fontWeight: "bold",
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
  camera: {
    flex: 5,
    borderRadius: 20,
  },
});
