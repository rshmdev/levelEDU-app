"use client"

import { Fragment, useEffect, useState } from "react"
import { Text, View, StyleSheet, TouchableOpacity, ImageBackground, BackHandler, ActivityIndicator } from "react-native"
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { router } from "expo-router"
import { FontAwesome5 } from "@expo/vector-icons"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"
import Toast from "react-native-toast-message"
import { toastConfig } from "@/components/TabsView"
import { StatusBar } from "expo-status-bar"
import AnimatedLogo from "@/components/LoopImages"
import { LinearGradient } from "expo-linear-gradient"

const image = require("@/assets/images/bg-2.jpg")

const LoginScreen = () => {
  const [facing] = useState<CameraType>("front")
  const [scanned, setScanned] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const { setUser } = useAuth()

  const [permission, requestPermission] = useCameraPermissions()

  useEffect(() => {
    const handleBackPress = () => {
      if (isCameraActive) {
        setIsCameraActive(false)
        return true
      }
      return false
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackPress)
  }, [isCameraActive])

  if (!permission) {
    return <View />
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#0f0c29", "#302b63", "#24243e"]} style={styles.gradientContainer}>
          <View style={styles.permissionContainer}>
            <View style={styles.permissionIconContainer}>
              <FontAwesome5 name="camera" size={60} color="#a78bfa" />
            </View>
            <Text style={styles.permissionTitle}>Acesso à Câmera</Text>
            <Text style={styles.message}>Precisamos da sua permissão para usar a câmera e escanear QR Codes</Text>
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <LinearGradient
                colors={["#8b5cf6", "#a78bfa"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.permissionButtonText}>Conceder Permissão</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    )
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    try {
      setLoading(true)
      
      // Parse do QR code que agora deve conter: userId|tenantId
      const qrData = data.split('|')
      if (qrData.length !== 2) {
        throw new Error('QR Code inválido. Formato esperado: userId|tenantId')
      }
      
      const [userId, tenantId] = qrData
      
      const response = await api.post("/login", {
        userId,
        tenantId,
      })

      if (response?.data?.user) {
        setUser(response.data.user)
        router.push("/(app)")
        setScanned(true)
      }
    } catch (error: any) {
      setScanned(false)
      const apiErrorMessage = error?.response?.data?.message || error.message
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: apiErrorMessage,
        position: "bottom",
      })
    } finally {
      setLoading(false)
    }
  }

  const startScanning = () => {
    setIsCameraActive(true)
  }

  return (
    <Fragment>
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <LinearGradient
            colors={["rgba(15, 12, 41, 0.95)", "rgba(48, 43, 99, 0.9)", "rgba(36, 36, 62, 0.95)"]}
            style={styles.gradientOverlay}
          >
            <StatusBar style="light" />

            {!isCameraActive ? (
              <View style={styles.welcomeContainer}>

                <View style={styles.logoContainer}>
                  <AnimatedLogo />
                </View>

                <View style={styles.contentContainer}>
                  <Text style={styles.welcomeTitle}>Bem-vindo à</Text>
                  <Text style={styles.welcomeSubtitle}>LevelEDU</Text>

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.instructionText}>Escaneie seu QR Code para começar sua jornada espacial</Text>
                  </View>

                  <TouchableOpacity style={styles.startButton} onPress={startScanning} activeOpacity={0.8}>
                    <LinearGradient
                      colors={["#8b5cf6", "#a78bfa", "#c4b5fd"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <FontAwesome5 name="qrcode" size={24} color="#fff" style={styles.qrIconLeft} />
                      <Text style={styles.startButtonText}>Escanear QR Code</Text>
                      <FontAwesome5 name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
                    </LinearGradient>
                  </TouchableOpacity>

                </View>
              </View>
            ) : (
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing={facing}
                  onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                  barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                  }}
                >
                  <View style={styles.cameraOverlay}>
                    <View style={styles.cameraHeader}>
                      <TouchableOpacity style={styles.backButton} onPress={() => setIsCameraActive(false)}>
                        <FontAwesome5 name="arrow-left" size={20} color="#fff" />
                      </TouchableOpacity>
                      <Text style={styles.cameraTitle}>Escanear QR Code</Text>
                      <View style={styles.backButton} />
                    </View>

                    <View style={styles.scannerContainer}>
                      <View style={styles.unfocusedTop} />
                      <View style={styles.middleRow}>
                        <View style={styles.unfocusedSide} />
                        <View style={styles.scannerBox}>
                          <View style={[styles.corner, styles.cornerTopLeft]} />
                          <View style={[styles.corner, styles.cornerTopRight]} />
                          <View style={[styles.corner, styles.cornerBottomLeft]} />
                          <View style={[styles.corner, styles.cornerBottomRight]} />
                          <View style={styles.scanLine} />
                        </View>
                        <View style={styles.unfocusedSide} />
                      </View>
                      <View style={styles.unfocusedBottom}>
                        <View style={styles.instructionBox}>
                          <FontAwesome5 name="qrcode" size={24} color="#a78bfa" />
                          <Text style={styles.scanInstructionText}>Posicione o QR Code dentro da área</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </CameraView>
              </View>
            )}

            {loading && (
              <View style={styles.loadingOverlay}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#a78bfa" />
                  <Text style={styles.loadingText}>Autenticando...</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </ImageBackground>
      </View>
      <Toast config={toastConfig} topOffset={50} />
    </Fragment>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  gradientContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    flex: 1,
    ...StyleSheet.absoluteFillObject,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  decorativeCircle1: {
    position: "absolute",
    top: 100,
    right: 30,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(139, 92, 246, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: 150,
    left: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(196, 181, 253, 0.1)",
    borderWidth: 2,
    borderColor: "rgba(196, 181, 253, 0.3)",
  },
  logoContainer: {
    marginBottom: 30,
  },
  contentContainer: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "300",
    color: "#e0e7ff",
    textAlign: "center",
    letterSpacing: 1,
  },
  welcomeSubtitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(139, 92, 246, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  descriptionContainer: {
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.2)",
  },
  instructionText: {
    fontSize: 16,
    color: "#c4b5fd",
    textAlign: "center",
    lineHeight: 24,
  },
  startButton: {
    width: "100%",
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  qrIconLeft: {
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  featureContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    color: "#e0e7ff",
    fontSize: 14,
    fontWeight: "500",
  },
  featureDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(167, 139, 250, 0.3)",
  },
  // Permission screen styles
  permissionContainer: {
    alignItems: "center",
    padding: 40,
    maxWidth: 400,
  },
  permissionIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 2,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  permissionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    color: "#c4b5fd",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  permissionButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 18,
  },
  // Camera styles
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cameraHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  scannerContainer: {
    flex: 1,
  },
  unfocusedTop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  middleRow: {
    flexDirection: "row",
    height: 280,
  },
  unfocusedSide: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  scannerBox: {
    width: 280,
    height: 280,
    backgroundColor: "transparent",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#a78bfa",
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#a78bfa",
    shadowColor: "#a78bfa",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  unfocusedBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  instructionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    marginHorizontal: 20,
  },
  scanInstructionText: {
    color: "#e0e7ff",
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 12, 41, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    alignItems: "center",
    backgroundColor: "rgba(167, 139, 250, 0.1)",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(167, 139, 250, 0.3)",
  },
  loadingText: {
    color: "#c4b5fd",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
  },
})

export default LoginScreen
