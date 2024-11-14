import { CalendarDays, Building, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ScheduledInterviewModel,
  InterviewRound,
} from "../models/interview.model";
import { formatDate } from "@/utils/format_date";
export default function ScheduledInterviewCard({
  position,
  companyName,
  interviewRound,
  scheduledOn,
}: ScheduledInterviewModel) {
  //* Helper Functions

  const getRoundIcon = (round: InterviewRound) => {
    switch (round) {
      case "PHONE_SCREENING":
        return "📞";
      case "TECHNICAL_INTERVIEW":
        return "💻";
      case "HR_INTERVIEW":
        return "👥";
      case "ON_SITE":
        return "🏢";
      case "FINAL_ROUND":
        return "🏁";
      case "OFFER_DISCUSSION":
        return "💼";
      default:
        return "❓";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-6 last:mb-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{position}</CardTitle>
        <Badge variant="secondary" className="text-xs">
          {getRoundIcon(interviewRound)}{" "}
          {interviewRound === "TECHNICAL_INTERVIEW"
            ? "TECHNICAL_ROUND"
            : interviewRound}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 text-sm">
            <Building className="h-4 w-4 opacity-70" />
            <span>{companyName}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <CalendarDays className="h-4 w-4 opacity-70" />
            <span>{formatDate(scheduledOn)}</span>
          </div>
          <Button variant="outline" className="mt-4 w-full">
            View Details
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
