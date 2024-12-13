import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutAndServices = () => {
  return (
    <div className="relative py-10">
      {/* About Section */}
      <section className="container mx-auto px-4 mb-16 text-center max-w-5xl">
        <h2 className="text-4xl font-bold mb-6">About Us</h2>
        <p className="text-lg leading-relaxed">
          Welcome to the TrackIT - The Job Application Tracker! Our mission is
          to simplify your job-hunting journey. With features designed to keep
          you organized and motivated, we aim to be your go-to tool for managing
          applications, tracking progress, and achieving your career goals.
        </p>
      </section>

      <Separator className="my-8" />

      {/* Services Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-10">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Application Tracking
              </CardTitle>
              <CardDescription>
                Organize and monitor your job applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Keep track of every job application you submit with detailed
                statuses, deadlines, and notes in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Interview Management
              </CardTitle>
              <CardDescription>
                Schedule interviews with essential details like position,
                company name, interview rounds, and timing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Categorize interviews into rounds such as Phone Screening,
                Technical, HR, On-Site, and more.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Analytics and Insights
              </CardTitle>
              <CardDescription>
                Visualize your progress and identify areas to improve.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Gain insights into your job hunt with analytics like the number
                of applications submitted, interviews scheduled, and offers
                received.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutAndServices;
