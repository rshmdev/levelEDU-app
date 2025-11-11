"use client"

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { TabsView } from "@/components/TabsView"
import { AnimatedCircularProgress } from "react-native-circular-progress"
import LottieView from "lottie-react-native"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "@/hooks/useAuth"
import { calculateLevelAndProgress } from "@/utils/user"
import { FontAwesome5, Ionicons } from "@expo/vector-icons"
import AnimatedLogo from "@/components/LoopImages"
import { Colors } from "@/constants/Colors"

export default function Index() {
  const { user, logout } = useAuth()
  const { level, progress } = calculateLevelAndProgress(user?.xp)

  return (
    <TabsView>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.header}>
            <LinearGradient
              colors={[Colors.warning[400], Colors.warning[500], Colors.warning[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.coinsCard}
            >
              <View style={styles.coinsIconWrapper}>
                <LottieView source={require("@/assets/coin.json")} autoPlay loop style={styles.coinAnimation} />
              </View>
              <View style={styles.coinsContent}>
                <Text style={styles.coinsValue}>{user?.coins || 0} Moedas</Text>
              </View>
            </LinearGradient>

            <TouchableOpacity onPress={() => router.push("/(app)/shop")} style={styles.shopCard}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.shopGradient}
              >
                <Ionicons name="storefront" size={20} color={Colors.white} />
                <Text style={styles.shopText}>Loja</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                logout()
                router.push("/(auth)/login")
              }}
              style={styles.logoutCard}
            >
              <LinearGradient
                colors={[Colors.error[500], Colors.error[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoutGradient}
              >
                <FontAwesome5 name="sign-out-alt" size={18} color={Colors.white} />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.greeting}>Olá,</Text>
            <Text style={styles.userName}>{user?.name.split(" ")[0]}</Text>
            <Text style={styles.subtitle}>Continue sua jornada espacial!</Text>
          </View>

          <View style={styles.statsCard}>
            <LinearGradient
              colors={[`${Colors.primary[500]}33`, `${Colors.primary[600]}1A`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statsGradient}
            >
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <Ionicons name="trophy" size={24} color="#fbbf24" />
                  </View>
                  <Text style={styles.statValue}>{level}</Text>
                  <Text style={styles.statLabel}>Nível</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <Ionicons name="flash" size={24} color="#a78bfa" />
                  </View>
                  <Text style={styles.statValue}>{user?.xp || 0}</Text>
                  <Text style={styles.statLabel}>XP Total</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <View style={styles.statIconWrapper}>
                    <Ionicons name="rocket" size={24} color="#60a5fa" />
                  </View>
                  <Text style={styles.statValue}>{Math.round(progress)}%</Text>
                  <Text style={styles.statLabel}>Progresso</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.progressRing}>
                <AnimatedCircularProgress
                  width={12}
                  size={340}
                  rotation={0}
                  fill={progress}
                  tintColor="#a78bfa"
                  backgroundColor="rgba(168, 85, 247, 0.15)"
                  lineCap="round"
                />
              </View>

              <View style={styles.avatarWrapper}>
                <AnimatedLogo />
              </View>

              <View style={styles.levelBadge}>
                <LinearGradient
                  colors={[Colors.success[500], Colors.success[600]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.levelGradient}
                >
                  <Ionicons name="star" size={14} color={Colors.white} style={styles.levelIcon} />
                  <Text style={styles.levelLabel}>NÍVEL</Text>
                  <Text style={styles.levelNumber}>{level}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>

          <View style={styles.actionsGrid}>
            <TouchableOpacity onPress={() => router.push("/(app)/mission")} style={styles.actionCard}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconWrapper}>
                  <Ionicons name="rocket-outline" size={32} color={Colors.white} />
                </View>
                <Text style={styles.actionTitle}>Missões</Text>
                <Text style={styles.actionSubtitle}>Complete desafios</Text>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/(app)/ranking")} style={styles.actionCard}>
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconWrapper}>
                  <Ionicons name="trophy-outline" size={32} color={Colors.white} />
                </View>
                <Text style={styles.actionTitle}>Ranking</Text>
                <Text style={styles.actionSubtitle}>Veja sua posição</Text>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(app)/attitudes")}
              style={[styles.actionCard, styles.actionCardWide]}
            >
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.actionGradient}
              >
                <View style={styles.actionIconWrapper}>
                  <Ionicons name="checkmark-circle-outline" size={32} color={Colors.white} />
                </View>
                <Text style={styles.actionTitle}>Atitudes</Text>
                <Text style={styles.actionSubtitle}>Registre suas conquistas</Text>
                <View style={styles.actionArrow}>
                  <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.7)" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.motivationCard}>
            <View style={styles.motivationContent}>
              <Ionicons name="sparkles" size={24} color="#fbbf24" />
              <View style={styles.motivationText}>
                <Text style={styles.motivationTitle}>Continue assim!</Text>
                <Text style={styles.motivationSubtitle}>Você está fazendo um ótimo trabalho</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </TabsView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  coinsCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  coinsIconWrapper: {
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  coinAnimation: {
    width: 50,
    height: 50,
  },
  coinsContent: {
    marginLeft: 16,
  },
  coinsLabel: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  coinsValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  shopCard: {
    borderRadius: 16,
    shadowColor: "#a855f7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  shopGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  shopText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  logoutCard: {
    borderRadius: 16,
    shadowColor: "#ef4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutGradient: {
    padding: 12,
    borderRadius: 16,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 36,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  userName: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: "rgba(168, 85, 247, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
  statsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(168, 85, 247, 0.3)",
  },
  statsGradient: {
    padding: 20,
    backgroundColor: "rgba(30, 30, 50, 0.6)",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconWrapper: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(168, 85, 247, 0.3)",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressRing: {
    position: "absolute",
    top: -15,
  },
  avatarWrapper: {
    width: 300,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  levelBadge: {
    position: "absolute",
    top: -30,
    zIndex: 10,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  levelGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  levelIcon: {
    marginRight: 2,
  },
  levelLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  levelNumber: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
  actionsGrid: {
    paddingHorizontal: 20,
    gap: 12,
  },
  actionCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionCardWide: {
    marginTop: 0,
  },
  actionGradient: {
    padding: 20,
    minHeight: 120,
    justifyContent: "space-between",
  },
  actionIconWrapper: {
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  actionArrow: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  motivationCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(30, 30, 50, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  motivationContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  motivationText: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  motivationSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  },
})
