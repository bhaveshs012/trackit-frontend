import Heading from "@/components/typography/Heading";
import SubHeading from "@/components/typography/SubHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const ArchivedApplications = () => {
  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between gap-x-4">
        <div className="flex gap-x-4 gap-y-4 items-center">
          <Button variant={"secondary"}>
            <MoveLeft />
          </Button>
          <div className="flex flex-col flex-wrap space-y-1">
            <div className="flex flex-row space-x-4">
              <Heading title={"Archived Applications"} />
              <Badge variant="outline">{10}</Badge>
            </div>
            <SubHeading subtitle="You can find all your archived applications here (Rejected, Withdrawn or Accepted)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivedApplications;
