import { useEffect, useRef, useState } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import ApplicationModal from "@/components/modals/ApplicationModal";
import JobApplicationCard from "../ApplicationCard";
import ContainerProps from "./container.type";

const Container = ({
  id,
  title,
  applications,
  onIntersect,
  setContainers,
}: ContainerProps) => {
  const { attributes, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: id,
      data: {
        type: "container",
      },
    });

  const [isOpen, setIsOpen] = useState(false);

  const handleDialogClose = () => setIsOpen(false);

  //* For Handling Infinite Scroll
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current || !scrollContainerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect(id); // Trigger fetch when sentinel is visible
        }
      },
      {
        root: scrollContainerRef.current, // Observe within the scrollable container
        rootMargin: "100px",
        threshold: 0.1, // Trigger when 10% of the sentinel is visible
      }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [title, onIntersect]);

  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        "w-full h-full p-4 rounded-xl flex flex-col gap-y-4 outline outline-1",
        isDragging && "opacity-50"
      )}
    >
      <div>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-xl">{title}</h1>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="z-10" variant={"outline"}>
                <div className="flex gap-x-4 items-center">
                  <PlusCircle />
                  <p>Add</p>
                </div>
              </Button>
            </DialogTrigger>
            <ApplicationModal
              setContainers={setContainers}
              onClose={handleDialogClose}
              inEditMode={false}
              applicationStatus={title}
            />
          </Dialog>
        </div>
      </div>
      <SortableContext items={applications.map((a) => a._id)}>
        <div
          ref={scrollContainerRef}
          className={clsx(
            "flex flex-col gap-y-4 overflow-y-auto application-container",
            "rounded-lg"
          )}
          style={{
            maxHeight: "400px", // Adjust the height as needed
          }}
        >
          {applications.map((application) => (
            <JobApplicationCard
              setContainers={setContainers}
              key={application._id}
              id={application._id}
              jobApplication={application}
            />
          ))}
          <div ref={sentinelRef} className="sentinel" />
        </div>
      </SortableContext>
    </div>
  );
};

export default Container;
