import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import interviewData from "./data/dummy_interviews";
import { ScheduledInterviewModel } from "./models/interview.model";
import ScheduledInterviewCard from "./components/ScheduledInterviewCard";
import { useId } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddInterviewScheduleModal from "@/components/modals/AddInterviewSchedule";

function Interviews() {
  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Interviews" />
          <Badge variant="outline">10</Badge>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <div className="flex gap-x-4 items-center">
                <PlusCircle />
                <p>Add New Schedule</p>
              </div>
            </Button>
          </DialogTrigger>
          <AddInterviewScheduleModal />
        </Dialog>
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
