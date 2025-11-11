"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { TabsView } from "@/components/TabsView"
import Header from "@/components/Header"
import { FontAwesome5 } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { getCoinsRanking, getXpRanking } from "@/service/ranking"
import type { User } from "@/providers/AuthProvider"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

const RankingScreen = () => {
  const navigation = useNavigation()
  const [activeTab, setActiveTab] = useState<"coins" | "general">("coins")

  const { data: coinsRanking } = useQuery({
    queryFn: getCoinsRanking,
    queryKey: ["coins-ranking"],
  })

  const { data: xpRanking } = useQuery({
    queryFn: getXpRanking,
    queryKey: ["xp-ranking"],
  })

  const renderRankingItem = ({
    item,
    index,
  }: {
    item: User
    index: number
  }) => (
    <LinearGradient
      colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.rankingItem}
    >
      <View style={styles.positionContainer}>
        <Text style={[styles.position, index + 1 <= 3 ? styles.topPosition : null]}>#{index + 1}</Text>
      </View>

      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <FontAwesome5 name="user-astronaut" size={24} color="#fff" />
        </View>
        <Text style={styles.userName}>{item.name}</Text>
      </View>

      <View style={styles.scoreContainer}>
        {activeTab === "coins" ? (
          <View style={styles.scoreWrapper}>
            <FontAwesome5 name="coins" size={16} color="#FFD700" />
            <Text style={styles.scoreText}>{item.coins}</Text>
          </View>
        ) : (
          <View style={styles.scoreWrapper}>
            <FontAwesome5 name="star" size={16} color="#4CAF50" />
            <Text style={styles.scoreText}>{item.xp} XP</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="trophy" size={60} color="#007AFF" />
      </View>
      <Text style={styles.emptyTitle}>Nenhum ranking disponível</Text>
      <Text style={styles.emptySubtitle}>Complete missões para aparecer no ranking!</Text>
    </View>
  )

  return (
    <TabsView>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerContainer}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Ranking</Text>
              <Text style={styles.subHeaderText}>Veja sua posição entre os jogadores</Text>
            </View>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <FontAwesome5 name="users" size={16} color="#60A5FA" />
              <Text style={styles.statLabel}>Jogadores</Text>
              <Text style={styles.statValue}>
                {activeTab === "coins" ? coinsRanking?.length || 0 : xpRanking?.length || 0}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="trophy" size={16} color="#FCD34D" />
              <Text style={styles.statLabel}>Ranking</Text>
              <Text style={styles.statValue}>{activeTab === "coins" ? "Moedas" : "XP"}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "coins" && styles.activeTab]}
            onPress={() => setActiveTab("coins")}
          >
            <Text style={[styles.tabText, activeTab === "coins" && styles.activeTabText]}>Moedas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "general" && styles.activeTab]}
            onPress={() => setActiveTab("general")}
          >
            <Text style={[styles.tabText, activeTab === "general" && styles.activeTabText]}>Geral</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTab === "coins" ? coinsRanking : xpRanking}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </TabsView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    borderRadius: 20,
    marginHorizontal: 15,
    padding: 20,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  headerTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 16,
    backdropFilter: "blur(10px)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: "bold",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  positionContainer: {
    width: 40,
    alignItems: "center",
  },
  position: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  topPosition: {
    color: "#FFD700",
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  userName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  scoreContainer: {
    minWidth: 80,
    flex: 1,
    alignItems: "flex-end",
  },
  scoreWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  scoreText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(0, 122, 255, 0.2)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
})

export default RankingScreen
