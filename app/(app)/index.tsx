import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { TabsView } from "@/components/TabsView";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import LottieView from "lottie-react-native";
import { Colors } from "@/constants/Colors";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/hooks/useAuth";
import { calculateLevelAndProgress } from "@/utils/user";
import { FontAwesome5 } from "@expo/vector-icons";
import AnimatedLogo from "@/components/LoopImages";

export default function Index() {
  const { user, logout } = useAuth();

  const { level, progress } = calculateLevelAndProgress(user?.xp);

  return (
    <TabsView>
      <View style={styles.container}>
        <View style={styles.header}>
          <LinearGradient
            colors={["#FFD700", "#FFAA00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.coinsContainer}
          >
            <LottieView
              source={require("@/assets/coin.json")}
              autoPlay
              loop
              style={{
                width: 50,
                height: 50,
                left: -15,
                top: -10,
                position: "absolute",
                zIndex: 2,
              }}
            />
            <Text style={styles.coinsText}>{user?.coins}</Text>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => router.push("/(app)/shop")}
            style={styles.shopButton}
          >
            <Text style={styles.shopText}>Loja</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              logout();
              router.push("/(auth)/login");
            }}
            style={styles.logoutButton}
          >
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <Text style={styles.greeting}>
            Olá, <Text style={styles.name}>{user?.name.split(" ")[0]}</Text>
          </Text>
        </View>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
           <AnimatedLogo/>
          </View>

          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>NÍVEL</Text>
            <Text style={styles.levelNumber}>{level}</Text>
          </View>

          <AnimatedCircularProgress
            width={20}
            size={400}
            rotation={0}
            fill={progress}
            style={styles.progressCircle}
            tintColor={Colors.electricBlue}
            onAnimationComplete={() => console.log("onAnimationComplete")}
            backgroundColor="#3d5875"
          />
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            onPress={() => router.push("/(app)/mission")}
            style={[styles.button, styles.missionButton]}
          >
            <Text style={styles.buttonText}>Missões</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/ranking")}
            style={[styles.button, styles.rankingButton]}
          >
            <Text style={styles.buttonText}>Ranking</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(app)/attitudes")}
            style={[styles.button, styles.attitudesButton]}
          >
            <Text style={styles.buttonText}>Atitudes</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => {
              logout();
              router.push("/login");
            }}
            style={[styles.button, styles.logoutButton]}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </TabsView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 25,
  },
  hero: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  coinsContainer: {
    position: "relative",
    alignItems: "center",
    backgroundColor: "#55286f",
    paddingVertical: 4,
    width: 100,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  coinsText: {
    marginLeft: 10,
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  shopButton: {
    backgroundColor: "#d8b4e2",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  shopText: {
    color: "#55286f",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  greeting: {
    fontSize: 42,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    color: "#4CAF50",
  },
  avatarWrapper: {
    position: "relative",
    alignItems: "center",
  },
  avatar: {
    width: 330,
    height: 370,
    borderRadius: 75,
  },
  levelBadge: {
    position: "absolute",
    top: -45,
    zIndex: 2,
    width: 80,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  levelText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  levelNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#FF7043",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 10,
  },
  progressContainer: {
    marginTop: 10,
    backgroundColor: "#d8b4e2",
    width: "60%",
    borderRadius: 10,
    alignItems: "center",
  },
  progressCircle: {
    position: "absolute",
    top: -25,
    zIndex: 1,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#55286f",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 30,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  missionButton: {
    backgroundColor: "#ff3b30",
  },
  rankingButton: {
    backgroundColor: "#007AFF",
  },
  attitudesButton: {
    backgroundColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
