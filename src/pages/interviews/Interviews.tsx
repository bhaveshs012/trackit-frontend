import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import interviewData from "./data/dummy_interviews";
import { ScheduledInterviewModel } from "./models/interview.model";
import ScheduledInterviewCard from "./components/ScheduledInterviewCard";
import { useId } from "react";

function Interviews() {
  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Interviews" />
          <Badge variant="outline">10</Badge>
        </div>
        <Button variant={"outline"}>
          <div className="flex gap-x-4 items-center">
            <PlusCircle />
            <p>Add Interview Schedule</p>
          </div>
        </Button>
      </div>
      {/* Interview Cards Section */}
      <div className="flex w-full flex-wrap">
        {interviewData.map((interview: ScheduledInterviewModel) => {
          const id = useId();
          return (
            <ScheduledInterviewCard
              key={id}
              companyName={interview.companyName}
              scheduledOn={interview.scheduledOn}
              position={interview.position}
              interviewRound={interview.interviewRound}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Interviews;
