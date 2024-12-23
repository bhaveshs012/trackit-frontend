import Heading from "@/components/typography/Heading";
import SubHeading from "@/components/typography/SubHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import apiClient from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import LoadingScreen from "../common/LoadingScreen";
import ErrorScreen from "../common/ErrorScreen";
import { cardContent } from "./data/card_content";
import ApplicationTypeCard from "./components/ApplicationTypeCard";
import { useNavigate } from "react-router-dom";

const ArchivedApplicationsDashboard = () => {
  const navigate = useNavigate();

  //* Get the count for all the archived application statuses
  const getArchivedApplicationsCount = async () => {
    const response = await apiClient.get("/applications//archived/count");
    return response.data.data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["getArchivedApplicationsCount"],
    queryFn: getArchivedApplicationsCount,
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
          <Button variant={"secondary"} onClick={() => navigate("/dashboard")}>
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
      {/* Card Section */}
      <div className="flex w-full flex-wrap gap-8">
        {cardContent.map(
          (
            content: { title: string; description: string; status: string },
            index: number
          ) => (
            <ApplicationTypeCard
              key={String(index)}
              title={content.title}
              description={content.description}
              applicationCount={data[content.status]}
              handleClick={() => navigate(`${content.status.toLowerCase()}`)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ArchivedApplicationsDashboard;
