"use client";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ApplicationModel } from "../../models/application.model";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, GripVertical } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ApplicationModal from "@/components/modals/ApplicationModal";
import ContainerType from "../Container/container.type";

type ItemsType = {
  id: UniqueIdentifier;
  jobApplication: ApplicationModel | null;
  setContainers: React.Dispatch<React.SetStateAction<ContainerType[]>>;
};

export default function JobApplicationCard({
  id,
  jobApplication,
  setContainers,
}: ItemsType) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: "item",
    },
  });

  const { companyName, position, appliedOn } = jobApplication || {};

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleDialogClose = () => setIsOpen(false);

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={`w-full ${isDragging ? "opacity-50" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{position}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-move"
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Drag handle</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2">{companyName}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-2 space-x-4">
        <p className="text-xs text-muted-foreground">
          Applied: {appliedOn && appliedOn.toDateString()}
        </p>
        <div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" asChild>
                <div className="flex gap-x-4 items-center">
                  <ExternalLink />
                  <p>View Details</p>
                </div>
              </Button>
            </DialogTrigger>
            <ApplicationModal
              setContainers={setContainers}
              onClose={handleDialogClose}
              inEditMode={true}
              applicationId={jobApplication?._id}
            />
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
