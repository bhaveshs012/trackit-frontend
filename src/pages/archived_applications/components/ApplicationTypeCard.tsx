import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoveRight } from "lucide-react";

interface ApplicationTypeCardProps {
  title: string;
  description: string;
  applicationCount: number;
  handleClick: () => void;
}

const ApplicationTypeCard: React.FC<ApplicationTypeCardProps> = ({
  title,
  description,
  applicationCount,
  handleClick,
}) => {
  return (
    <Card className="w-fit max-w-lg">
      <CardHeader>
        <CardTitle className="text-3xl">{title}</CardTitle>
        <CardDescription className="max-w-sm">{description}</CardDescription>
      </CardHeader>
      <CardDescription>
        <div className="p-6 flex justify-between items-center">
          <p className="text-5xl font-extrabold">{applicationCount}</p>
          <Button className="p-6" variant="outline" onClick={handleClick}>
            <MoveRight />
          </Button>
        </div>
      </CardDescription>
    </Card>
  );
};

export default ApplicationTypeCard;
