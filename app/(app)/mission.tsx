"use client"

import React from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { TabsView } from "@/components/TabsView"
import MissionCard from "@/components/MissionCard"
import Header from "@/components/Header"
import { FontAwesome5 } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import CongratulationsModal from "@/components/CongratulationsModal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { completeMission, getMissions } from "@/service/missions"
import type { Mission } from "@/types/mission"
import { useAuth } from "@/hooks/useAuth"
import { LinearGradient } from "expo-linear-gradient"
import { Colors } from "@/constants/Colors"

const ChallengesScreen = () => {
  const { user, updateUser } = useAuth()
  const navigation = useNavigation()
  const [selectedChallenge, setSelectedChallenge] = React.useState<Mission | null>(null)
  const [showModal, setShowModal] = React.useState(false)

  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ["missions"],
    queryFn: () => getMissions(user?._id || ""),
    enabled: !!user,
  })

  const { mutateAsync } = useMutation({
    mutationFn: (missionId: string) => completeMission(user?._id || "", missionId),
    mutationKey: ["complete-mission"],
    onSuccess: (data) => {
      Alert.alert("Sucesso", data.message)
      queryClient.invalidateQueries({
        queryKey: ["missions"],
      })
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message
      Alert.alert("Erro", apiErrorMessage)
    },
  })

  const handleChallengePress = async (challenge: Mission) => {
    if (challenge.allowedUsers.find((item) => item === user?._id)) {
      setSelectedChallenge(challenge)

      setShowModal(true)
      await mutateAsync(challenge._id)

      if (user) {
        updateUser()
      }
    }
  }

  const renderItem = ({ item }: { item: Mission }) => (
    <MissionCard
      title={item.title}
      objective={item.description}
      reward={item.coins}
      progress={item.allowedUsers.find((item) => item === user?._id) ? 100 : 0}
      onPress={() => handleChallengePress(item)}
    />
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <FontAwesome5 name="rocket" size={60} color={Colors.primary[500]} />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma missão disponível</Text>
      <Text style={styles.emptySubtitle}>Novas missões em breve! Continue explorando.</Text>
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
              <Text style={styles.headerText}>Missões</Text>
              <Text style={styles.subHeaderText}>Complete missões para ganhar recompensas</Text>
            </View>
          </View>

          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <FontAwesome5 name="tasks" size={16} color="#FCA5A5" />
              <Text style={styles.statLabel}>Disponíveis</Text>
              <Text style={styles.statValue}>{data?.length || 0}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <FontAwesome5 name="trophy" size={16} color="#FCD34D" />
              <Text style={styles.statLabel}>Concluídas</Text>
              <Text style={styles.statValue}>
                {data?.filter((m: Mission) => m.allowedUsers.includes(user?._id || "")).length || 0}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {data && data.length > 0 && (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suas Missões</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>{data.length}</Text>
            </View>
          </View>
        )}

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
      {selectedChallenge && (
        <CongratulationsModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          reward={selectedChallenge.coins}
          title={selectedChallenge.title}
        />
      )}
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
    shadowColor: Colors.primary[500],
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  sectionBadge: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.white,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    backgroundColor: `${Colors.primary[500]}1A`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: `${Colors.primary[500]}33`,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.white,
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

export default ChallengesScreen
