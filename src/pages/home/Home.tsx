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
  useEffect(() => {
    const getApplicationsByStatus = async () => {
      try {
        // Fetch applications for all containers
        const responses = await Promise.all(
          containers.map(async (container) => {
            const url = `/applications?status=${container.title}`;
            return apiClient.get(url).then((res) => res.data.data.applications);
          })
        );

        console.log("Applications :: ", responses);

        // Avoid redundant state updates
        setContainers((prev) => {
          const updatedContainers = prev.map((container, index) => ({
            ...container,
            applications: responses[index].map(
              (application: ApplicationModel) => ({
                ...application,
                appliedOn: new Date(application.appliedOn),
              })
            ),
          }));

          // Only update state if there's a change
          if (JSON.stringify(updatedContainers) !== JSON.stringify(prev)) {
            return updatedContainers;
          }
          return prev;
        });
      } catch (error) {
        console.error("Error fetching applications: ", error);
      }
    };

    getApplicationsByStatus();
  }, []); // No dependencies to avoid unnecessary triggers

  function findContainerById(id: UniqueIdentifier) {
    return containers.find((container) =>
      container.applications.some((item) => item._id === id)
    );
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    //* These are the items in the container and not the container itself
    const { active, over } = event;
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeContainer = findContainerById(active.id);
    const overContainer =
      findContainerById(over.id) || containers.find((c) => c.id === over.id);

    if (!activeContainer || !overContainer) return;

    if (activeContainer.id === overContainer.id) {
      //* Getting the container id where we have to drop the item : could be replaced by overContainer.id as well
      const containerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );

      //* Getting the old index of the item in the container
      const oldIndex = activeContainer.applications.findIndex(
        (i) => i._id === active.id
      );
      //* The new moved index
      const newIndex = overContainer.applications.findIndex(
        (i) => i._id === over.id
      );

      setContainers((prev) => {
        const newContainers = [...prev];
        newContainers[containerIndex].applications = arrayMove(
          newContainers[containerIndex].applications,
          oldIndex,
          newIndex
        );
        return newContainers;
      });
    } else {
      const activeContainerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (c) => c.id === overContainer.id
      );

      // The item index to be moved
      const itemIndex = activeContainer.applications.findIndex(
        (i) => i._id === active.id
      );

      //* Removing the element from the old container
      const [movedItem] = activeContainer.applications.splice(itemIndex, 1);

      setContainers((prev) => {
        const newContainers = [...prev]; // creating a copy
        newContainers[activeContainerIndex].applications = [
          ...activeContainer.applications,
        ]; // active container will be the same : item already removed
        newContainers[overContainerIndex].applications = [
          ...overContainer.applications,
          movedItem,
        ]; // over container will have the new item added to the end
        return newContainers;
      });
    }
    setActiveId(null);
  }

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col gap-y-1 items-start">
          <Heading title="Welcome Back, Bhavesh!" />
          <SubHeading subtitle="Have a look at all the job applications" />
        </div>
        <Button variant={"outline"}>
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
                ></Container>
              ))}
            </SortableContext>

            {/* DragOverlay keeps the dragged item visible */}
            {/* <DragOverlay>
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
            </DragOverlay> */}
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default Home;
