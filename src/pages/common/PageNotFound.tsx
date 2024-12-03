import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import SubHeading from "@/components/typography/SubHeading";

const PageNotFound = () => {
  const animationContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (animationContainer.current) {
      // Initialize the Lottie animation
      const animation = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/animations/page_not_found.json",
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
            width: "40%",
            height: "40%",
          }}
        ></div>
        <SubHeading
          subtitle={"We could not find the page you're looking for !!"}
        />
      </div>
    </div>
  );
};

export default PageNotFound;
