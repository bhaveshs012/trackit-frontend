import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

const LoadingScreen: React.FC = () => {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      // Initialize the Lottie animation
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/white_loader.json", // Replace with your JSON animation path
      });

      // Cleanup the animation on unmount
      return () => {
        animation.destroy();
      };
    }
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <div
        ref={animationContainer}
        style={{
          width: "5%",
          height: "5%",
        }}
      ></div>
    </div>
  );
};

export default LoadingScreen;
