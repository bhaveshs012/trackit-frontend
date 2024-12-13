import Heading from "@/components/typography/Heading";
import SubHeading from "@/components/typography/SubHeading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ResumeModel from "./models/resume.model";
import ResumeDisplayCard from "./components/ResumeDisplayCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddResumeModal from "@/components/modals/AddResumeModal";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import LoadingScreen from "../common/LoadingScreen";
import Pagination from "@/components/pagination/Pagination";
import EmptyResultsScreen from "../common/EmptyResults";

function Resumes() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const handleDialogClose = () => setIsOpen(false);

  //* React Query
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState<number>(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({
      queryKey: ["getAllResumes", currentPage],
    });
  };

  //* Get all resumes
  const getAllResumes = async () => {
    const response = await apiClient.get("users/resume", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
      },
    });
    //* Set the pagination data as well
    setTotalItems(response.data.data.pagination.totalDocs);
    //* Return the resumes list
    return response.data.data.resumes;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["getAllResumes", currentPage],
    queryFn: getAllResumes,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-x-4 items-start">
          <div className="flex justify-center items-center gap-x-4">
            <Heading title="Resumes" />
            <Badge variant="outline">{totalItems}</Badge>
          </div>
          <SubHeading subtitle="Upload and save your resumes here" />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <div className="flex gap-x-4 items-center">
                <PlusCircle />
                <p>Add Resume</p>
              </div>
            </Button>
          </DialogTrigger>
          <AddResumeModal onClose={handleDialogClose} />
        </Dialog>
      </div>
      {/* Resume Cards Display */}
      <div className="flex w-full flex-wrap">
        {data && data.length === 0 ? (
          <EmptyResultsScreen
            title="No Resumes Found !!"
            description="Please save some resumes to view them here"
          />
        ) : (
          data &&
          data.map((resume: ResumeModel, index: number) => {
            return (
              <ResumeDisplayCard
                key={String(index)}
                skills={resume.skills}
                resumeLink={resume.resumeLink}
                fileName={resume.fileName}
                targetPosition={resume.targetPosition}
                uploadedOn={resume.uploadedOn}
              />
            );
          })
        )}
      </div>
      {data && data.length !== 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Resumes;
