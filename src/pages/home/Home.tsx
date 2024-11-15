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
      const containerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );
      const oldIndex = activeContainer.items.findIndex(
        (i) => i.id === active.id
      );
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

      const itemIndex = activeContainer.items.findIndex(
        (i) => i.id === active.id
      );
      const [movedItem] = activeContainer.items.splice(itemIndex, 1);

      setContainers((prev) => {
        const newContainers = [...prev];
        newContainers[activeContainerIndex].items = [...activeContainer.items];
        newContainers[overContainerIndex].items = [
          ...overContainer.items,
          movedItem,
        ];
        return newContainers;
      });
    }
    setActiveId(null);
  }

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Welcome Back, Bhavesh!" />
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
