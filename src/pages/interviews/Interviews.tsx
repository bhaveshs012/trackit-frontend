import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArchiveIcon, MoveLeft, PlusCircle } from "lucide-react";
import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ScheduledInterviewCard from "./components/ScheduledInterviewCard";
import AddInterviewScheduleModal from "@/components/modals/AddInterviewSchedule";
import LoadingScreen from "../common/LoadingScreen";
import EmptyResultsScreen from "../common/EmptyResults";
import Pagination from "@/components/pagination/Pagination";
import apiClient from "@/api/apiClient";
import { ScheduledInterviewModel } from "./models/interview.model";
import { useNavigate } from "react-router-dom";

interface InterviewsPageProps {
  displayArchived: boolean;
}

const Interviews: React.FC<InterviewsPageProps> = ({ displayArchived }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleDialogClose = () => setIsOpen(false);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({
      queryKey: ["getAllInterviews", page],
    });
  };

  async function getAllInterviews(displayArchived: boolean): Promise<any> {
    let url = "/interviews";
    if (displayArchived) url = url + "/archived";

    const response = await apiClient.get(url, {
      params: {
        page: currentPage,
        limit: itemsPerPage,
      },
    });

    setTotalItems(response.data.data.pagination.totalDocs);
    return response.data.data.interviewRounds;
  }

  const { data, error, isLoading } = useQuery({
    queryKey: ["getAllInterviews", currentPage, displayArchived],
    queryFn: () => getAllInterviews(displayArchived),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingScreen />;

  if (error)
    return (
      <div className="text-center text-red-600">
        <p>Failed to fetch interviews. Please try again later.</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between gap-x-4">
        <div className="flex gap-x-4 gap-y-4 items-center">
          {displayArchived && (
            <Button
              variant={"secondary"}
              onClick={async () => {
                // Invalidate query to refresh interviews data
                await queryClient.invalidateQueries({
                  queryKey: ["getAllInterviews", currentPage],
                });

                // Navigate to the archived interviews page
                navigate("/dashboard/interviews");
              }}
            >
              <MoveLeft />
            </Button>
          )}
          <Heading
            title={displayArchived ? "Archived Interviews" : "Interviews"}
          />
          <Badge variant="outline">{totalItems}</Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-4 z-10">
          <div>
            <Button
              variant={"outline"}
              onClick={async () => {
                // Invalidate query to refresh interviews data
                await queryClient.invalidateQueries({
                  queryKey: ["getAllInterviews", currentPage],
                });

                // Navigate to the archived interviews page
                navigate("/dashboard/interviews/archived");
              }}
            >
              <div className="flex gap-x-4 items-center">
                <ArchiveIcon />
                <p>Archived Interviews</p>
              </div>
            </Button>
          </div>
          <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="z-10" variant="outline">
                  <div className="flex gap-x-4 items-center">
                    <PlusCircle />
                    <p>Add New Schedule</p>
                  </div>
                </Button>
              </DialogTrigger>
              <AddInterviewScheduleModal onClose={handleDialogClose} />
            </Dialog>
          </div>
        </div>
      </div>

      {/* Interview Cards Section */}
      <div className="flex w-full flex-wrap">
        {data && data.length === 0 ? (
          <EmptyResultsScreen
            title="No active Interview Schedules Found !!"
            description="You can find the expired interviews in the archived section !!"
          />
        ) : (
          data &&
          data.map((interview: ScheduledInterviewModel, index: number) => (
            <ScheduledInterviewCard
              key={String(index)}
              companyName={interview.companyName}
              scheduledOn={interview.scheduledOn}
              position={interview.position}
              interviewRound={interview.interviewRound}
            />
          ))
        )}
      </div>

      {/* Pagination Section */}
      {data && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Interviews;
