import { UniqueIdentifier } from "@dnd-kit/core";
import { ApplicationModel } from "../../models/application.model";

export default interface ContainerType {
  id: UniqueIdentifier;
  title: "Applied" | "Interviewing" | "Offer Received";
  applications: ApplicationModel[];
  currentPage: number; // The current page for pagination
  totalPages: number; // Total number of pages for pagination
  onIntersect: (id: UniqueIdentifier) => void; // Callback for intersection events
}
