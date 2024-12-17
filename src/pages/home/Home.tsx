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

function Home() {
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: uuidv4(), title: "Applied", applications: [] },
    { id: uuidv4(), title: "Interviewing", applications: [] },
    { id: uuidv4(), title: "Offer Received", applications: [] },
  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch job applications by status
  useEffect(() => {
    const fetchApplications = async () => {
      try {
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
            return { ...container, applications };
          })
        );
        setContainers(updatedContainers);
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    fetchApplications();
  }, []);

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
    }

    setActiveId(null);
  };

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1 items-start">
          <Heading title="Welcome Back, Bhavesh!" />
          <SubHeading subtitle="Have a look at all the job applications" />
        </div>
        <Button variant="outline">
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
                  title={container.title}
                  key={container.id}
                  applications={container.applications}
                />
              ))}
            </SortableContext>

            {/* DragOverlay */}
            <DragOverlay>
              {activeId ? (
                <JobApplicationCard
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
