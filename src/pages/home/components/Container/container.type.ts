import { UniqueIdentifier } from "@dnd-kit/core";

export default interface ContainerProps {
  id: UniqueIdentifier;
  children: React.ReactNode;
  title:
    | "Applied"
    | "Interviewing"
    | "Offer Received"
    | "Accepted"
    | "Rejected"
    | "Withdrawn";
  description?: string;
  onAddItem?: () => void;
}
