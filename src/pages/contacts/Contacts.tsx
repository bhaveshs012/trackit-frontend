import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import contacts from "./data/dummyContacts";
import ContactModel from "./models/Contact.model";
import ContactCard from "./components/ContactCard";

// Need to make the number of contacts and the list dynamic

function Contacts() {
  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Contacts" />
          <Badge variant="outline">4</Badge>
        </div>
        <Button variant={"outline"}>
          <div className="flex gap-x-4 items-center">
            <CircleUserRound />
            <p>Add New Contact</p>
          </div>
        </Button>
      </div>
      {/* Contact Cards Section */}
      <div className="flex w-full flex-wrap">
        {contacts.map((contact: ContactModel) => {
          return (
            <ContactCard
              name={contact.name}
              companyName={contact.companyName}
              linkedinProfile={contact.linkedinProfile}
              position={contact.position}
              email={contact.email}
              phoneNumber={contact.phoneNumber}
              avatarUrl={contact.avatarUrl}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Contacts;
