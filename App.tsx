import { useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  Easing,
  WithSpringConfig,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const DURATION = 400;
const TRANSLATE_Y = -80;

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

export default function App() {
  const isOpened = useRef(false);
  const transYinstagram = useSharedValue(0);
  const transYgithub = useSharedValue(0);
  const transYlinkedin = useSharedValue(0);
  const opacity = useSharedValue(1);

  const instagramAnimateStyles = useAnimatedStyle(() => {
    const INTERPOLATE = interpolate(
      transYinstagram.value,
      [TRANSLATE_Y, 0],
      [1, 0]
    );

    return {
      transform: [
        { translateY: transYinstagram.value },
        { scale: INTERPOLATE },
      ],
    };
  }, []);

  const githubAnimateStyles = useAnimatedStyle(() => {
    const INTERPOLATE_Y = interpolate(
      transYgithub.value,
      [TRANSLATE_Y, 0],
      [TRANSLATE_Y / 2, 0]
    );

    const INTERPOLATE_X = interpolate(
      transYgithub.value,
      [TRANSLATE_Y, 0],
      [-60, 0]
    );

    return {
      transform: [
        { translateY: INTERPOLATE_Y },
        { translateX: INTERPOLATE_X },
        { scale: interpolate(transYgithub.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  }, []);

  const linkedinAnimateStyles = useAnimatedStyle(() => {
    const INTERPOLATE_Y = interpolate(
      transYlinkedin.value,
      [TRANSLATE_Y, 0],
      [26, 0]
    );

    return {
      transform: [
        { translateY: INTERPOLATE_Y },
        { translateX: transYlinkedin.value },
        { scale: interpolate(transYlinkedin.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  }, []);

  const plusAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(opacity.value, [0, 1], [90, 0]).toString() + "deg",
        },
      ],
      opacity: opacity.value,
    };
  }, []);

  const minusAnimateStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(opacity.value, [0, 1], [0, -90]).toString() + "deg",
        },
      ],
    };
  }, []);

  const handlePress = () => {
    if (isOpened.current) {
      transYinstagram.value = withDelay(
        DURATION,
        withTiming(0, {
          duration: DURATION,
          easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
        })
      );
      transYgithub.value = withDelay(
        DURATION / 2,
        withTiming(0, {
          duration: DURATION,
          easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
        })
      );
      transYlinkedin.value = withTiming(0, {
        duration: DURATION,
        easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
      });
      //OPACITY BUTTON PLUS
      opacity.value = withTiming(1, { duration: DURATION });
    } else {
      const config: WithSpringConfig = { damping: 12 };

      transYinstagram.value = withTiming(TRANSLATE_Y, config);
      transYgithub.value = withDelay(
        DURATION / 2,
        withSpring(TRANSLATE_Y, config)
      );
      transYlinkedin.value = withDelay(
        DURATION,
        withSpring(TRANSLATE_Y, config)
      );
      //OPACITY BUTTON PLUS
      opacity.value = withTiming(0, { duration: DURATION });
    }

    isOpened.current = !isOpened.current;
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePress}
          activeOpacity={1}
          style={styles.button}
        >
          <Animated.View style={plusAnimateStyles}>
            <Entypo name="plus" size={36} color="#fff" />
          </Animated.View>
          <Animated.View style={[minusAnimateStyles, { position: "absolute" }]}>
            <Entypo name="minus" size={36} color="#fff" />
          </Animated.View>
        </TouchableOpacity>
        <AnimatedPressable
          style={[styles.cameraButton, instagramAnimateStyles]}
        >
          <AntDesign name="instagram" size={24} color="#000" />
        </AnimatedPressable>
        <AnimatedPressable style={[styles.cameraButton, githubAnimateStyles]}>
          <AntDesign name="github" size={24} color="#000" />
        </AnimatedPressable>
        <AnimatedPressable style={[styles.cameraButton, linkedinAnimateStyles]}>
          <AntDesign name="linkedin-square" size={24} color="#000" />
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    right: 30,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: "red",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraButton: {
    width: 50,
    height: 50,
    backgroundColor: "orange",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: -1,
  },
});
