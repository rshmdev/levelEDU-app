import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TabsView } from "@/components/TabsView";
import Header from "@/components/Header";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { claimAttitude, getUserAttitudes } from "@/service/attitudes";
import { Attitude } from "@/types/attitudes";
import { useAuth } from "@/hooks/useAuth";
import AttitudeCard from "@/components/AttitudeCard";
import AttitudeRewardModal from "@/components/AttitudeRewardModal";
import Toast from "react-native-toast-message";

const AttitudesScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const [selectedAttitude, setSelectedAttitude] = useState<Attitude | null>(
    null
  );

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryFn: () => getUserAttitudes(user?._id || ""),
    queryKey: ["user-attitudes", user],
    enabled: !!user,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (attitudeId: string) =>
      claimAttitude(user?._id || "", attitudeId),
    onSuccess: (data) => {
      updateUser();
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: data.message,
        position: "bottom",
      });
      queryClient.invalidateQueries({ queryKey: ["user-attitudes"] });
    },
    onError: (error: any) => {
      const apiErrorMessage = error?.response?.data?.message;
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: apiErrorMessage,
        position: "bottom",
      });
    },
  });

  const handleAttitudePress = async (attitude: Attitude) => {
    if (!attitude.isClaimed) {
      await mutateAsync(attitude._id);
      setSelectedAttitude(attitude);
    }
  };

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
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Atitudes</Text>
            <Text style={styles.subHeaderText}>
              Histórico de comportamentos e recompensas
            </Text>
          </View>
        </View>

        <FlatList
          data={data}
          renderItem={renderAttitudeItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
        {selectedAttitude && (
          <AttitudeRewardModal
            isVisible={!!selectedAttitude}
            onClose={() => setSelectedAttitude(null)}
            attitude={selectedAttitude}
          />
        )}
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
  glowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Ajuste para o brilho
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTextContainer: {
    marginLeft: 15,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  subHeaderText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  listContainer: {
    paddingBottom: 20,
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
});

export default AttitudesScreen;
