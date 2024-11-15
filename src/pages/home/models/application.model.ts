const applicationStatusEnum = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER_RECEIVED: "Offer Received",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
} as const;

type ApplicationStatus = keyof typeof applicationStatusEnum;

interface ApplicationModel {
  companyName: string;
  position: string;
  jobLink: string;
  applicationStatus: ApplicationStatus;
  resumeUploaded: string;
  coverLetterUploaded: string;
  notes: string;
  appliedOn: Date;
}
export { applicationStatusEnum };

export type { ApplicationModel, ApplicationStatus };
