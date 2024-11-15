import ResumeModel from "../models/resume.model";

const dummyResumes: ResumeModel[] = [
  {
    fileName: "Bhavesh_Sengunthar_SDE.pdf",
    targetPosition: "Software Engineer",
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "MongoDB"],
    uploadedOn: new Date("2024-10-10T14:30:00Z"),
    resumeLink: "https://example.com/resumes/john_doe_resume.pdf",
  },
  {
    fileName: "Bhavesh_Sengunthar_PM.pdf",
    targetPosition: "Product Manager",
    skills: ["Agile", "Product Strategy", "Market Research", "UX/UI Design"],
    uploadedOn: new Date("2024-09-15T09:45:00Z"),
    resumeLink: "https://example.com/resumes/jane_smith_resume.pdf",
  },
  {
    fileName: "Bhavesh_Sengunthar_DataScientist.pdf",
    targetPosition: "Data Scientist",
    skills: ["Python", "Machine Learning", "Data Analysis", "SQL", "R"],
    uploadedOn: new Date("2024-11-01T08:00:00Z"),
    resumeLink: "https://example.com/resumes/alice_jones_resume.pdf",
  },
];

export default dummyResumes;
