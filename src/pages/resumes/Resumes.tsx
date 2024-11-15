import Heading from "@/components/typography/Heading";
import SubHeading from "@/components/typography/SubHeading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dummyResumes from "./data/dummy_resumes";
import ResumeModel from "./models/resume.model";
import { v4 as uuidv4 } from "uuid";
import ResumeDisplayCard from "./components/ResumeDisplayCard";

function Resumes() {
  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-x-4 items-start">
          <div className="flex justify-center items-center gap-x-4">
            <Heading title="Resumes" />
            <Badge variant="outline">4</Badge>
          </div>
          <SubHeading subtitle="Upload and save your resumes here" />
        </div>
        <Button variant={"outline"}>
          <div className="flex gap-x-4 items-center">
            <PlusCircle />
            <p>Add Resume</p>
          </div>
        </Button>
      </div>
      {/* Resume Cards Display */}
      <div className="flex w-full flex-wrap">
        {dummyResumes.map((resume: ResumeModel) => {
          return (
            <ResumeDisplayCard
              key={uuidv4()}
              fileName={resume.fileName}
              targetPosition={resume.targetPosition}
              resumeLink={resume.resumeLink}
              skills={resume.skills}
              uploadedOn={resume.uploadedOn}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Resumes;
