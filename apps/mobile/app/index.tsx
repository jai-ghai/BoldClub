import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";

import { getBootstrapState } from "../src/lib/bootstrap";
import { routeForAccountStatus, type AppRoute } from "../src/lib/routes";

export default function IndexScreen() {
  const [route, setRoute] = useState<AppRoute | null>(null);

  useEffect(() => {
    void getBootstrapState().then((bootstrap) => {
      setRoute(routeForAccountStatus(bootstrap.accountStatus));
    });
  }, []);

  if (!route) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#FF4F7B" size="large" />
      </View>
    );
  }

  return <Redirect href={route} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0C0811",
  },
});
