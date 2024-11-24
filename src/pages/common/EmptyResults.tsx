import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SubHeading from "@/components/typography/SubHeading";

interface EmptyResultsScreenProps {
  title: string;
  description: string;
}

const EmptyResultsScreen: React.FC<EmptyResultsScreenProps> = ({
  title,
  description,
}) => {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      // Initialize the Lottie animation
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/empty_results.json", // Replace with your JSON animation path
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
      <div className="flex flex-col gap-y-2 items-center">
        <div
          ref={animationContainer}
          style={{
            width: "35%",
            height: "35%",
          }}
        ></div>
        <SubHeading subtitle={title} />
        <SubHeading subtitle={description} />
      </div>
    </div>
  );
};

export default EmptyResultsScreen;
