const interviewRoundEnum = {
  PHONE_SCREENING: "Phone Screening",
  TECHNICAL_INTERVIEW: "Technical Interview",
  HR_INTERVIEW: "HR Interview",
  ON_SITE: "On-site",
  FINAL_ROUND: "Final Round",
  OFFER_DISCUSSION: "Offer Discussion",
  OTHER: "Other",
} as const;

type InterviewRound = keyof typeof interviewRoundEnum;

interface ScheduledInterviewModel {
  position: string;
  companyName: string;
  interviewRound: string;
  roundDetails: string;
  scheduledOn: Date;
}

interface EditScheduledInterviewModel {
  _id: string;
  position: string;
  companyName: string;
  interviewRound: String;
  roundDetails: string;
  scheduledOn: Date;
}

export type {
  ScheduledInterviewModel,
  InterviewRound,
  EditScheduledInterviewModel,
};
