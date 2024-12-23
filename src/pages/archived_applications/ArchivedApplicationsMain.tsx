import apiClient from "@/api/apiClient";
import Heading from "@/components/typography/Heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { capitalizeFirstLetter } from "@/utils/capitalize_string";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoveLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import ErrorScreen from "../common/ErrorScreen";
import EmptyResultsScreen from "../common/EmptyResults";
import ArchivedApplicationCard, {
  JobApplicationProps,
} from "./components/ArchivedApplicationCard";
import Pagination from "@/components/pagination/Pagination";
import PageNotFound from "../common/PageNotFound";

const ArchivedApplicationsMain = () => {
  const { applicationStatus } = useParams();
  const navigate = useNavigate();

  if (
    !(
      applicationStatus &&
      ["accepted", "rejected", "withdrawn"].includes(applicationStatus)
    )
  ) {
    return <PageNotFound />;
  }

  const queryClient = useQueryClient();
  //* Pagination Setup
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({
      queryKey: ["getArchivedApplicationsByStatus", page],
    });
  };

  //* Get the archived applications by status
  const getArchivedApplicationsByStatus = async () => {
    const response = await apiClient.get("/applications//archived", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        status: capitalizeFirstLetter(
          applicationStatus ? applicationStatus : ""
        ),
      },
    });
    setTotalItems(response.data.data.pagination.totalDocs);
    return response.data.data.applications;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["getArchivedApplicationsByStatus", currentPage],
    queryFn: getArchivedApplicationsByStatus,
  });

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <ErrorScreen
        title="Error while fetching archived application details"
        description="Could not fetch the archived application details due to some internal server error"
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between gap-x-4">
        <div className="flex gap-x-4 gap-y-4 items-center">
          <Button
            className="z-50"
            variant={"secondary"}
            onClick={() => navigate("/dashboard/applications/archived")}
          >
            <MoveLeft />
          </Button>
          <div className="flex flex-col flex-wrap space-y-1">
            <div className="flex flex-row space-x-4">
              <Heading
                title={
                  applicationStatus
                    ? capitalizeFirstLetter(applicationStatus)
                    : "Undefined"
                }
              />
              <Badge variant="outline">{totalItems}</Badge>
            </div>
          </div>
        </div>
      </div>
      {/* Cards Section */}
      <div className="flex w-full flex-wrap gap-8">
        {data && data.length === 0 ? (
          <EmptyResultsScreen
            title={`No Archived Applications with Status ${applicationStatus} Found !!`}
            description="You can find the archived applications once you update the status to archive them !!"
          />
        ) : (
          data &&
          data.map((application: JobApplicationProps, index: number) => (
            <ArchivedApplicationCard
              key={String(index)}
              companyName={application.companyName}
              applicationStatus={application.applicationStatus}
              appliedOn={application.appliedOn}
              jobLink={application.jobLink}
              notes={application.notes}
              position={application.position}
              resumeUploaded={application.resumeUploaded}
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

export default ArchivedApplicationsMain;
