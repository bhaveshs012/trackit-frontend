import { UniqueIdentifier } from "@dnd-kit/core";
import { ApplicationModel } from "../../models/application.model";

export default interface ContainerType {
  id: UniqueIdentifier;
  title: "Applied" | "Interviewing" | "Offer Received";
  applications: ApplicationModel[];
}
