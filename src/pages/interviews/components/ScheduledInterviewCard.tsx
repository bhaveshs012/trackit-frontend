import { CalendarDays, Building, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScheduledInterviewModel } from "../models/interview.model";
import { convertISODateToString } from "@/utils/input_date_formatter";
export default function ScheduledInterviewCard({
  position,
  companyName,
  interviewRound,
  scheduledOn,
}: ScheduledInterviewModel) {
  //* Helper Functions

  const getRoundIcon = (round: String) => {
    switch (round) {
      case "Phone Screening":
        return "📞";
      case "Technical Interview":
        return "💻";
      case "HR Interview":
        return "👥";
      case "On-Site":
        return "🏢";
      case "FInal Round":
        return "🏁";
      case "Offer Discussion":
        return "💼";
      default:
        return "❓";
    }
  };

  return (
    <Card className="w-full max-w-md mb-6">
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
            <span>{convertISODateToString(scheduledOn.toString())}</span>
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
