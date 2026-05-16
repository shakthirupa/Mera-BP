import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");

export default function InlineYoutubePlayer({ youtubeId, isFullscreen } : {youtubeId: string; isFullscreen?: boolean}) {
  return (
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <WebView
        source={{
          uri: `https://www.youtube.com/embed/${youtubeId}?controls=1&modestbranding=1`,
        }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        allowsFullscreenVideo={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 120,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  fullscreenContainer: {
    width: "100%",
    height: 250,
    backgroundColor: "#000",
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});