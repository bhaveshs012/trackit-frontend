import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SubHeading from "@/components/typography/SubHeading";

interface EmptyResultsScreenProps {
  title: string;
  description: string;
}

const ErrorScreen: React.FC<EmptyResultsScreenProps> = ({
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
        path: "/animations/error.json",
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
            width: "20%",
            height: "20%",
          }}
        ></div>
        <SubHeading subtitle={title} />
        <SubHeading subtitle={description} />
      </div>
    </div>
  );
};

export default ErrorScreen;
