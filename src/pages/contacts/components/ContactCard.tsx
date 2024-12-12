import { Mail, Briefcase, Phone, Linkedin, Edit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditContactModel } from "../models/contact.model";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ContactModal from "@/components/modals/ContactModal";
import { useState } from "react";

export default function ContactCard({
  firstName,
  lastName,
  email,
  companyName,
  role,
  phoneNumber,
  linkedInProfile,
  _id,
}: EditContactModel) {
  const [isOpen, setIsOpen] = useState(false);
  const handleDialogClose = () => setIsOpen(false);

  return (
    <Card className="w-full max-w-md m-4 mb-6">
      <CardHeader className="flex flex-row items-center gap-4 justify-between">
        <div className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage alt={firstName} />
            <AvatarFallback>{firstName[0] + lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{firstName + " " + lastName}</CardTitle>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="z-10" variant={"outline"}>
              <Edit />
            </Button>
          </DialogTrigger>
          <ContactModal
            onClose={handleDialogClose}
            inEditMode={true}
            contactId={_id}
          />
        </Dialog>
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
            href={linkedInProfile}
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
