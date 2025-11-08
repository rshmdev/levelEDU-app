import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { TabsView } from "@/components/TabsView";
import Header from "@/components/Header";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getCoinsRanking, getXpRanking } from "@/service/ranking";
import { User } from "@/providers/AuthProvider";

const RankingScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"coins" | "general">("coins");

  const { data: coinsRanking } = useQuery({
    queryFn: getCoinsRanking,
    queryKey: ["coins-ranking"],
  });

  const { data: xpRanking } = useQuery({
    queryFn: getXpRanking,
    queryKey: ["xp-ranking"],
  });

  const renderRankingItem = ({
    item,
    index,
  }: {
    item: User;
    index: number;
  }) => (
    <View style={styles.rankingItem}>
      <View style={styles.positionContainer}>
        <Text
          style={[
            styles.position,
            index + 1 <= 3 ? styles.topPosition : null, // Destaque para o top 3
          ]}
        >
          #{index + 1} {/* Índice ajustado para começar do 1 */}
        </Text>
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
    </View>
  );

  return (
    <TabsView>
      <Header />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Ranking</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "coins" && styles.activeTab]}
            onPress={() => setActiveTab("coins")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "coins" && styles.activeTabText,
              ]}
            >
              Moedas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "general" && styles.activeTab]}
            onPress={() => setActiveTab("general")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "general" && styles.activeTabText,
              ]}
            >
              Geral
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={activeTab === "coins" ? coinsRanking : xpRanking}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </TabsView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
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
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
    paddingBottom: 20,
  },
  rankingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(124, 58, 237, 0.95)",
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  positionContainer: {
    width: 40,
    alignItems: "center",
  },
  position: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  topPosition: {
    color: "#FFD700",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
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
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  scoreText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "bold",
  },
});

export default RankingScreen;
