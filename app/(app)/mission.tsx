import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { TabsView } from "@/components/TabsView";
import MissionCard from "@/components/MissionCard";
import Header from "@/components/Header";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import CongratulationsModal from "@/components/CongratulationsModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { completeMission, getMissions } from "@/service/missions";
import { Mission } from "@/types/mission";
import { useAuth } from "@/hooks/useAuth";
import Toast from "react-native-toast-message";

const ChallengesScreen = () => {
  const { user, updateUser } = useAuth();
  const navigation = useNavigation();
  const [selectedChallenge, setSelectedChallenge] =
    React.useState<Mission | null>(null);
  const [showModal, setShowModal] = React.useState(false);

  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["missions"],
    queryFn: () => getMissions(user?._id || ""),
    enabled: !!user,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (missionId: string) =>
      completeMission(user?._id || "", missionId),
    mutationKey: ["complete-mission"],
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: data.message,
        position: "bottom",
      });
      queryClient.invalidateQueries({
        queryKey: ["missions"],
      });
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

  const handleChallengePress = async (challenge: Mission) => {
    if (challenge.allowedUsers.find((item) => item === user?._id)) {
      setSelectedChallenge(challenge);

      setShowModal(true);
      await mutateAsync(challenge._id);

      if (user) {
        updateUser();
      }
    }
  };

  const renderItem = ({ item }: { item: Mission }) => (
    <MissionCard
      title={item.title}
      objective={item.description}
      reward={item.coins}
      progress={item.allowedUsers.find((item) => item === user?._id) ? 100 : 0}
      onPress={() => handleChallengePress(item)}
    />
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
            <Text style={styles.headerText}>Missões</Text>
            <Text style={styles.subHeaderText}>
              Complete missões para ganhar recompensas
            </Text>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    paddingHorizontal: 15,
    paddingBottom: 10,
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
    backgroundColor: "#ff3b30",
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
  scrollView: {
    paddingBottom: 20,
  },
});

export default ChallengesScreen;
