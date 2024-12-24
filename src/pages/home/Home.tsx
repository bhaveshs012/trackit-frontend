import { useEffect, useState } from "react";
import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { ArchiveIcon } from "lucide-react";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import Container from "./components/Container";
import SubHeading from "@/components/typography/SubHeading";
import ContainerType from "./components/Container/container.type";
import apiClient from "@/api/apiClient";
import { v4 as uuidv4 } from "uuid";
import { ApplicationModel } from "./models/application.model";
import JobApplicationCard from "./components/ApplicationCard";
import { toast } from "@/components/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import ErrorScreen from "../common/ErrorScreen";

function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [containers, setContainers] = useState<ContainerType[]>([
    {
      id: uuidv4(),
      title: "Applied",
      applications: [],
      currentPage: 1, // Initial currentPage for pagination
      totalPages: 1,
      setContainers: () => {},
      onIntersect: (id: UniqueIdentifier) => {
        console.log(`Intersected with status: ${id}`);
      },
    },
    {
      id: uuidv4(),
      title: "Interviewing",
      applications: [],
      currentPage: 1,
      totalPages: 1,
      setContainers: () => {},
      onIntersect: (id: UniqueIdentifier) => {
        console.log(`Intersected with status: ${id}`);
      },
    },
    {
      id: uuidv4(),
      title: "Offer Received",
      applications: [],
      currentPage: 1,
      setContainers: () => {},
      totalPages: 1,
      onIntersect: (id: UniqueIdentifier) => {
        console.log(`Intersected with status: ${id}`);
      },
    },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  //* Initial Fetch :: Fetch job applications by status
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const updatedContainers = await Promise.all(
          containers.map(async (container) => {
            const response = await apiClient.get(
              `/applications?status=${container.title}`
            );
            const applications = response.data.data.applications.map(
              (app: ApplicationModel) => ({
                ...app,
                appliedOn: new Date(app.appliedOn),
              })
            );
            const totalPages = response.data.data.pagination.totalPages;
            return { ...container, applications, totalPages };
          })
        );
        setContainers(updatedContainers);
      } catch (error: any) {
        setError(error);
        console.error("Error fetching applications: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleIntersect = async (containerId: UniqueIdentifier) => {
    const containerIndex = containers.findIndex((c) => c.id === containerId);

    if (containerIndex === -1) return;

    const currentPage = containers[containerIndex].currentPage;
    const totalPages = containers[containerIndex].totalPages;

    if (currentPage > totalPages) {
      return;
    }

    try {
      const response = await apiClient.get("/applications", {
        params: {
          status: containers[containerIndex].title,
          page: currentPage + 1,
          limit: 10,
        },
      });

      const newApplications = response.data.data.applications.map(
        (app: ApplicationModel) => ({
          ...app,
          appliedOn: new Date(app.appliedOn),
        })
      );

      setContainers((prev) => {
        const updatedContainers = [...prev];
        updatedContainers[containerIndex] = {
          ...updatedContainers[containerIndex],
          applications: [
            ...updatedContainers[containerIndex].applications,
            ...newApplications,
          ],
          currentPage: currentPage + 1,
        };
        return updatedContainers;
      });
    } catch (error) {
      toast({
        title: `Error fetching more applications for ( ${
          containerIndex === 0
            ? "Applied"
            : containerIndex === 1
            ? "Interviewing"
            : "Offer Received"
        }) state`,
      });
    }
  };

  const findContainerById = (id: UniqueIdentifier) => {
    return containers.find((container) =>
      container.applications.some((item) => item._id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    // If there's no valid drop target, reset active ID and exit
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainerById(active.id);
    const overContainer =
      findContainerById(over.id) || containers.find((c) => c.id === over.id);

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }
    if (activeContainer.id === overContainer.id) {
      // Reordering within the same container
      const containerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );
      const oldIndex = activeContainer.applications.findIndex(
        (i) => i._id === active.id
      );
      const newIndex = overContainer.applications.findIndex(
        (i) => i._id === over.id
      );

      if (oldIndex !== newIndex) {
        setContainers((prev) => {
          const newContainers = [...prev];
          newContainers[containerIndex] = {
            ...newContainers[containerIndex],
            applications: arrayMove(
              [...newContainers[containerIndex].applications],
              oldIndex,
              newIndex
            ),
          };
          return newContainers;
        });
      }
    } else {
      // Moving between different containers
      const activeContainerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (c) => c.id === overContainer.id
      );

      const itemIndex = activeContainer.applications.findIndex(
        (i) => i._id === active.id
      );

      setContainers((prev) => {
        const newContainers = [...prev];
        const movedItem = activeContainer.applications[itemIndex];

        newContainers[activeContainerIndex] = {
          ...newContainers[activeContainerIndex],
          applications: newContainers[activeContainerIndex].applications.filter(
            (item) => item._id !== active.id
          ),
        };

        newContainers[overContainerIndex] = {
          ...newContainers[overContainerIndex],
          applications: [
            ...newContainers[overContainerIndex].applications,
            movedItem,
          ],
        };

        return newContainers;
      });

      //* Hit the API to change application status
      const applicationId = activeContainer.applications[itemIndex]._id;
      const applicationStatus =
        overContainerIndex === 0
          ? "Applied"
          : overContainerIndex === 1
          ? "Interviewing"
          : "Offer Received";
      mutation.mutate({ applicationId, applicationStatus });
    }
    setActiveId(null);
  };

  //* Change application status
  const changeApplicationStatus = async (applicationData: {
    applicationId: string;
    applicationStatus: "Applied" | "Interviewing" | "Offer Received";
  }) => {
    const response = await apiClient.patch(
      `/applications/${applicationData.applicationId}`,
      {
        applicationStatus: applicationData.applicationStatus,
      }
    );
    return response.data.data;
  };

  const mutation = useMutation({
    mutationFn: changeApplicationStatus,
    onSuccess: () => {
      toast({
        title: "Job application status has been changed successfully !!",
      });
    },
    onError(error) {
      toast({
        title: "Error occurred while updating the job application status !!",
        description: error.toString(),
      });
    },
  });

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <ErrorScreen
        title="Error while fetching the job applications"
        description="Could not fetch the job applications due to some internal server error"
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1 items-start">
          <Heading title="Welcome Back, Bhavesh!" />
          <SubHeading subtitle="Have a look at all the job applications" />
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/applications/archived")}
        >
          <div className="flex gap-x-4 items-center">
            <ArchiveIcon />
            <p>Archived Applications</p>
          </div>
        </Button>
      </div>
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={containers.map((c) => c.id)}>
              {containers.map((container) => (
                <Container
                  id={container.id}
                  setContainers={setContainers}
                  title={container.title}
                  key={container.id}
                  applications={container.applications}
                  onIntersect={handleIntersect}
                  totalPages={container.totalPages}
                  currentPage={container.currentPage}
                />
              ))}
            </SortableContext>

            {/* DragOverlay */}
            <DragOverlay>
              {activeId ? (
                <JobApplicationCard
                  setContainers={setContainers}
                  id={activeId}
                  jobApplication={
                    findContainerById(activeId)?.applications.find(
                      (item) => item._id === activeId
                    ) || null
                  }
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default Home;
