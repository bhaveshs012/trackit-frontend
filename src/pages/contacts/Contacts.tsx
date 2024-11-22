import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import contacts from "./data/dummy_contacts";
import ContactModel from "./models/contact.model";
import ContactCard from "./components/ContactCard";
import { useId } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddContactModal from "@/components/modals/AddContactModal";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import LoadingScreen from "../common/LoadingScreen";

// Need to make the number of contacts and the list dynamic

function Contacts() {
  //* React Query
  const queryClient = useQueryClient();

  //* Get all contacts
  const getAllContacts = async () => {
    const response = await apiClient.get("/contacts");
    return response.data.data;
  };

  const {
    data: allContacts,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getAllContacts"],
    queryFn: getAllContacts,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Contacts" />
          <Badge variant="outline">10</Badge>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <div className="flex gap-x-4 items-center">
                <CircleUserRound />
                <p>Add New Contact</p>
              </div>
            </Button>
          </DialogTrigger>
          <AddContactModal />
        </Dialog>
      </div>
      {/* Contact Cards Section */}
      <div className="flex w-full flex-wrap">
        {contacts.map((contact: ContactModel) => {
          return (
            <ContactCard
              key={contact.email}
              name={contact.name}
              companyName={contact.companyName}
              linkedinProfile={contact.linkedinProfile}
              position={contact.position}
              email={contact.email}
              phoneNumber={contact.phoneNumber}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Contacts;
