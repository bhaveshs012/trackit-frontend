import ContainerProps from "./container.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AddApplicationModal from "@/components/modals/AddApplicationModal";

const Container = ({ id, children, title, onAddItem }: ContainerProps) => {
  const { attributes, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: id,
      data: {
        type: "container",
      },
    });
  
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDialogClose = () => setIsOpen(false);

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
            <AddApplicationModal onClose={handleDialogClose} inEditMode={false} applicationStatus={title} />
          </Dialog>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Container;
