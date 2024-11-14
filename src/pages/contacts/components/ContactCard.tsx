import { Mail, Briefcase, Phone, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContactModel from "../models/Contact.model";

export default function ContactCard({
  name,
  email,
  companyName,
  position,
  phoneNumber,
  linkedinProfile,
  avatarUrl,
}: ContactModel) {
  return (
    <Card className="w-full max-w-md mx-auto mb-6 last:mb-0">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage alt={name} />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name}</CardTitle>
          <p className="text-sm text-muted-foreground">{position}</p>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span>{companyName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            {email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <a href={`tel:${phoneNumber}`} className="hover:underline">
            {phoneNumber}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Linkedin className="h-4 w-4 text-muted-foreground" />
          <a
            href={linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            LinkedIn Profile
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
