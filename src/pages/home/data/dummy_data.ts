import { v4 as uuidv4 } from "uuid";
import { applicationStatusEnum } from "../models/application.model";
import { ApplicationModel } from "../models/application.model";
import { UniqueIdentifier } from "@dnd-kit/core";

type DNDType = {
  id: UniqueIdentifier; // The outer container with the application status
  title: string;
  items: {
    id: UniqueIdentifier;
    jobApplication: ApplicationModel;
  }[];
};

const dummyContainers: DNDType[] = [
  {
    id: uuidv4(),
    title: applicationStatusEnum.APPLIED,
    items: [
      {
        id: uuidv4(),
        jobApplication: {
          companyName: "TechCorp Inc.",
          position: "Senior Frontend Developer",
          jobLink: "https://example.com/job/1",
          applicationStatus: "APPLIED",
          resumeUploaded: "resume_techcorp.pdf",
          coverLetterUploaded: "cover_techcorp.pdf",
          notes: "Follow up in a week.",
          appliedOn: new Date("2024-01-10"),
        },
      },
      {
        id: uuidv4(),
        jobApplication: {
          companyName: "Innovatech Ltd.",
          position: "UI Engineer",
          jobLink: "https://example.com/job/2",
          applicationStatus: "APPLIED",
          resumeUploaded: "resume_innovatech.pdf",
          coverLetterUploaded: "cover_innovatech.pdf",
          notes: "Mentioned in referral program.",
          appliedOn: new Date("2024-02-14"),
        },
      },
    ],
  },
  {
    id: uuidv4(),
    title: applicationStatusEnum.INTERVIEWING,
    items: [
      {
        id: uuidv4(),
        jobApplication: {
          companyName: "DesignStudio",
          position: "Frontend Designer",
          jobLink: "https://example.com/job/3",
          applicationStatus: "INTERVIEWING",
          resumeUploaded: "resume_designstudio.pdf",
          coverLetterUploaded: "cover_designstudio.pdf",
          notes: "Technical round scheduled.",
          appliedOn: new Date("2024-01-22"),
        },
      },
    ],
  },
  {
    id: uuidv4(),
    title: applicationStatusEnum.OFFER_RECEIVED,
    items: [
      {
        id: uuidv4(),
        jobApplication: {
          companyName: "NextGen Tech",
          position: "React Developer",
          jobLink: "https://example.com/job/4",
          applicationStatus: "OFFER_RECEIVED",
          resumeUploaded: "resume_nextgen.pdf",
          coverLetterUploaded: "cover_nextgen.pdf",
          notes: "Negotiating the salary.",
          appliedOn: new Date("2024-02-05"),
        },
      },
    ],
  },
];

export default dummyContainers;
export type { DNDType };
