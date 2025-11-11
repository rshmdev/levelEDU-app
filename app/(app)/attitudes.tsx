"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { TabsView } from "@/components/TabsView"
import Header from "@/components/Header"
import { FontAwesome5 } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { claimAttitude, getUserAttitudes } from "@/service/attitudes"
import type { Attitude } from "@/types/attitudes"
import { useAuth } from "@/hooks/useAuth"
import AttitudeCard from "@/components/AttitudeCard"
import AttitudeRewardModal from "@/components/AttitudeRewardModal"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

const AttitudesScreen = () => {
  const navigation = useNavigation()
  const { user, updateUser } = useAuth()
  const [selectedAttitude, setSelectedAttitude] = useState<Attitude | null>(null)

  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryFn: () => getUserAttitudes(user?._id || ""),
    queryKey: ["user-attitudes", user],
    enabled: !!user,
  })

  const { mutateAsync } = useMutation({
    mutationFn: (attitudeId: string) => claimAttitude(user?._id || "", attitudeId),
    onSuccess: (data) => {
      updateUser()
      Alert.alert("Sucesso", data.message)
      queryClient.invalidateQueries({ queryKey: ["user-attitudes"] })
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message
      Alert.alert("Erro", apiErrorMessage)
    },
  })

  const handleAttitudePress = async (attitude: Attitude) => {
    if (!attitude.isClaimed) {
      await mutateAsync(attitude._id)
      setSelectedAttitude(attitude)
    }
  }

  const renderAttitudeItem = ({ item }: { item: Attitude }) => (
    <TouchableOpacity onPress={() => handleAttitudePress(item)}>
      <AttitudeCard
        title={item.title}
        description={item.description}
        createdAt={item.createdAt}
        isPositive={item.isPositive}
        isClaimed={item.isClaimed}
        coins={item.coins}
        xp={item.xp}
      />
    </TouchableOpacity>
  )

  const positiveCount = data?.filter((a: Attitude) => a.isPositive).length || 0
  const negativeCount = data?.filter((a: Attitude) => !a.isPositive).length || 0
  const totalCount = data?.length || 0

  return (
    <TabsView>
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600], Colors.primary[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={20} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Atitudes</Text>
              <Text style={styles.subHeaderText}>Histórico de comportamentos e recompensas</Text>
            </View>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <FontAwesome5 name="smile" size={16} color="#FFD700" />
              <Text style={styles.statLabel}>Positivas</Text>
              <Text style={styles.statValue}>{positiveCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="frown" size={16} color="#FF6B6B" />
              <Text style={styles.statLabel}>Negativas</Text>
              <Text style={styles.statValue}>{negativeCount}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="chart-bar" size={16} color="#fff" />
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{totalCount}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.badgeContainer}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <FontAwesome5 name="history" size={14} color={Colors.white} />
            <Text style={styles.badgeText}>
              {totalCount} {totalCount === 1 ? "atitude registrada" : "atitudes registradas"}
            </Text>
          </LinearGradient>
        </View>

        {totalCount === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="clipboard-list" size={48} color={Colors.primary[500]} />
            <Text style={styles.emptyTitle}>Nenhuma atitude registrada</Text>
            <Text style={styles.emptyDescription}>Suas atitudes e comportamentos aparecerão aqui</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            renderItem={renderAttitudeItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}

        {selectedAttitude && (
          <AttitudeRewardModal
            isVisible={!!selectedAttitude}
            onClose={() => setSelectedAttitude(null)}
            attitude={selectedAttitude}
          />
        )}
      </View>
    </TabsView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  headerGradient: {
    borderRadius: 20,
    marginHorizontal: 15,
    padding: 20,
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 8,
  },
  badgeContainer: {
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    transform: [{ skewX: "-20deg" }],
  },
  attitudeCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
  },
  impactContainer: {
    flexDirection: "row",
    gap: 12,
  },
  impactItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  impactText: {
    color: "#fff",
    fontWeight: "bold",
  },
})

export default AttitudesScreen
