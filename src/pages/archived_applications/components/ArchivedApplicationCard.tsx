import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building2, Briefcase, FileText, Calendar, Trash } from "lucide-react";

interface JobApplicationProps {
  companyName: string;
  position: string;
  jobLink: string;
  applicationStatus: "Accepted" | "Rejected" | "Withdrawn";
  resumeUploaded: string;
  notes: string;
  appliedOn: string;
}

export type { JobApplicationProps };

const statusColors = {
  Accepted: "bg-purple-500",
  Rejected: "bg-red-500",
  Withdrawn: "bg-gray-500",
};

export default function ArchivedApplicationCard({
  companyName,
  position,
  jobLink,
  applicationStatus,
  resumeUploaded,
  notes,
  appliedOn,
}: JobApplicationProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{position}</CardTitle>
        <div className="flex items-center text-sm text-muted-foreground">
          <Building2 className="w-4 h-4 mr-2" />
          {companyName}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge className={`${statusColors[applicationStatus]} text-white`}>
            {applicationStatus}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            Applied: {new Date(appliedOn).toLocaleDateString()}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2" />
            <a
              href={jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              View Job Posting
            </a>
          </div>
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            <a
              href={resumeUploaded}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
            >
              View Uploaded Resume
            </a>
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex items-start">
            <p className="text-sm">{notes}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full hover:bg-red-950 hover:border-red-950"
        >
          <Trash className="w-4 h-4 mr-2" />
          Delete Application
        </Button>
      </CardFooter>
    </Card>
  );
}
