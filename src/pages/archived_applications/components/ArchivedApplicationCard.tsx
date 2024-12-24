import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Briefcase, FileText, Calendar } from "lucide-react";
import ConfirmDeleteDialog from "@/components/alert-dialogs/ConfirmDelete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";

interface JobApplicationProps {
  _id: string;
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
  _id,
  companyName,
  position,
  jobLink,
  applicationStatus,
  resumeUploaded,
  notes,
  appliedOn,
}: JobApplicationProps) {
  const deleteArchivedApplicationById = async () => {
    const response = await apiClient.delete(`applications/${_id}`);
    return response.data.data;
  };

  const queryClient = useQueryClient();

  const deleteArchivedApplicationMutation = useMutation({
    mutationFn: deleteArchivedApplicationById,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getArchivedApplicationsByStatus"],
      });
      toast({
        title: "The job application has been deleted successfully !!",
      });
    },
    onError(error) {
      toast({
        title: "Error occurred while deleting the job application !!",
        description: error.toString(),
      });
    },
  });

  const handleDeleteArchivedApplication = () => {
    deleteArchivedApplicationMutation.mutate();
  };

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
        <ConfirmDeleteDialog
          onConfirm={handleDeleteArchivedApplication}
          description="This action cannot be undone. This will permanently delete the
            contact and remove your data from our servers."
        />
      </CardFooter>
    </Card>
  );
}
