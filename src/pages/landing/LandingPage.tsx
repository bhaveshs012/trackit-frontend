import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import FlickeringGrid from "@/components/ui/flickering-grid";
import TypingAnimation from "@/components/ui/typing-animation";
import PlannerImage from "/images/landingPage/planner.png";
import PlannerImage2 from "/images/landingPage/planner2.png";
import InterviewImage from "/images/landingPage/interview.png";
import TrackerImage from "/images/landingPage/tracker.png";

function LandingPage() {
  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden flex flex-col">
        <Header />
        <div className="relative flex-grow flex flex-col justify-center items-center">
          <FlickeringGrid
            className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
            squareSize={4}
            gridGap={6}
            color="#60A5FA"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={800}
          />

          <main className="relative z-10 flex-grow w-2/3 mx-auto flex flex-col justify-center items-center h-full">
            <section className="h-[100vh] flex flex-col justify-center items-center">
              <div className="container text-center space-y-4">
                <TypingAnimation
                  duration={50}
                  className="text-5xl font-bold text-black dark:text-white font-mono align-center"
                  text="Simplify Your Job Hunt with TrackIT"
                />
                <p className="text-xl mb-8">
                  Stay organized, manage your applications, and never miss an
                  opportunity.
                </p>
                <Button variant={"outline"}>Get Started</Button>
              </div>
            </section>
          </main>

          <img
            src={PlannerImage}
            alt="Planner"
            className="w-64 h-auto dark:opacity-60 absolute top-6 left-12 -rotate-12 lg:visible invisible"
          />
          <img
            src={PlannerImage2}
            alt="Planner2"
            className="w-64 h-auto dark:opacity-60 absolute top-2 right-14 -rotate-12 lg:visible invisible"
          />
          <img
            src={InterviewImage}
            alt="Interview"
            className="w-64 h-auto dark:opacity-60 absolute bottom-20 left-10 -rotate-12 lg:visible invisible"
          />
          <img
            src={TrackerImage}
            alt="Tracker"
            className="w-64 h-auto dark:opacity-60 absolute bottom-24 right-12 rotate-6 lg:visible invisible"
          />
        </div>

        {/* Scrollable Content */}
        <div className="relative py-10">
          <p className="container mx-auto px-4 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Voluptate...
          </p>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
