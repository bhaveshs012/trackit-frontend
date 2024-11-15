import ContainerProps from "./container.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const Container = ({ id, children, title, onAddItem }: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "container",
    },
  });
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
          <Button
            className="flex items-center space-x-2"
            variant="outline"
            onClick={onAddItem}
          >
            <PlusCircle />
            <p>Add</p>
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Container;
