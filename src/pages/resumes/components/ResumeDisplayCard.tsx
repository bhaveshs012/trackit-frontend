import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, FileIcon, ExternalLinkIcon } from "lucide-react";
import ResumeModel from "../models/resume.model";
import { formatDate } from "@/utils/format_date";

export default function ResumeDisplayCard({
  fileName,
  targetPosition,
  skills,
  uploadedOn,
  resumeLink,
}: ResumeModel) {
  return (
    <Card className="flex flex-col justify-between w-full max-w-md mr-4 mb-4">
      <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <FileIcon className="w-4 h-4 inline-block mr-2" />
            {fileName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-y-6 ">
            <Badge variant="secondary" className="w-fit">
              {targetPosition}
            </Badge>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Added on {formatDate(uploadedOn)}
          </div>
        </CardContent>
      </div>
      <div>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => window.open(resumeLink, "_blank")}
          >
            <ExternalLinkIcon className="w-4 h-4 mr-2" />
            Open Resume
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
