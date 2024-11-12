import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { Button } from "@/components/ui/button";
import FlickeringGrid from "@/components/ui/flickering-grid";
import TypingAnimation from "@/components/ui/typing-animation";

function LandingPage() {
  return (
    <>
      <div className="relative w-full min-h-screen overflow-hidden border flex flex-col">
        <Header />
        <FlickeringGrid
          className="absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
          height={800}
        />
        <main className="relative z-10 flex-grow w-2/3 mx-auto flex flex-col justify-center h-full">
          <section className="py-20">
            <div className="container mx-auto text-center space-y-4">
              <TypingAnimation
                duration={50}
                className="text-4xl font-bold text-black dark:text-white"
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
        <Footer />
      </div>
    </>
  );
}

export default LandingPage;
