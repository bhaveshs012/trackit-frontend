import { useState } from "react";
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
import JobApplicationCard from "./components/ApplicationCard";
import dummyContainers, { DNDType } from "./data/dummy_data";
import SubHeading from "@/components/typography/SubHeading";

function Home() {
  const [containers, setContainers] = useState<DNDType[]>(dummyContainers);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function findContainerById(id: UniqueIdentifier) {
    return containers.find((container) =>
      container.items.some((item) => item.id === id)
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
      const oldIndex = activeContainer.items.findIndex(
        (i) => i.id === active.id
      );
      //* The new moved index
      const newIndex = overContainer.items.findIndex((i) => i.id === over.id);

      setContainers((prev) => {
        const newContainers = [...prev];
        newContainers[containerIndex].items = arrayMove(
          newContainers[containerIndex].items,
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
      const itemIndex = activeContainer.items.findIndex(
        (i) => i.id === active.id
      );

      //* Removing the element from the old container
      const [movedItem] = activeContainer.items.splice(itemIndex, 1);

      setContainers((prev) => {
        const newContainers = [...prev]; // creating a copy
        newContainers[activeContainerIndex].items = [...activeContainer.items]; // active container will be the same : item already removed
        newContainers[overContainerIndex].items = [
          ...overContainer.items,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                >
                  <SortableContext items={container.items.map((i) => i.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      {container.items.map((item) => (
                        <JobApplicationCard
                          key={item.id}
                          id={item.id}
                          jobApplication={item.jobApplication}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              ))}
            </SortableContext>

            {/* DragOverlay keeps the dragged item visible */}
            <DragOverlay>
              {activeId ? (
                <JobApplicationCard
                  id={activeId}
                  jobApplication={
                    findContainerById(activeId)?.items.find(
                      (item) => item.id === activeId
                    )?.jobApplication || null
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
