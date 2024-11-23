import { useState } from "react";
import Heading from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { CircleUserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import contacts from "./data/dummy_contacts";
import ContactModel from "./models/contact.model";
import ContactCard from "./components/ContactCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddContactModal from "@/components/modals/AddContactModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/api/apiClient";
import LoadingScreen from "../common/LoadingScreen";
import Pagination from "@/components/pagination/Pagination";

function Contacts() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleDialogClose = () => setIsOpen(false);

  //* React Query
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [totalItems, setTotalItems] = useState<number>(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({
      queryKey: ["getAllContacts", currentPage],
    });
  };

  //* Get all contacts
  const getAllContacts = async () => {
    const response = await apiClient.get("/contacts", {
      params: {
        page: currentPage,
        limit: itemsPerPage,
      },
    });
    //* Set the pagination data as well
    setTotalItems(response.data.data.pagination.totalDocs);
    //* Return the contacts list
    return response.data.data.contacts;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["getAllContacts", currentPage],
    queryFn: getAllContacts,
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen p-6 gap-y-6">
      {/* Header Section */}
      <div className="flex flex-row justify-between">
        <div className="flex gap-x-4 items-center">
          <Heading title="Contacts" />
          <Badge variant="outline">{totalItems}</Badge>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant={"outline"}>
              <div className="flex gap-x-4 items-center">
                <CircleUserRound />
                <p>Add New Contact</p>
              </div>
            </Button>
          </DialogTrigger>
          <AddContactModal onClose={handleDialogClose} />
        </Dialog>
      </div>
      {/* Contact Cards Section */}
      <div className="flex w-full flex-wrap">
        {data.length === 0 ? (
          <p>No Contacts added</p>
        ) : (
          data.map((contact: ContactModel) => {
            return (
              <ContactCard
                key={contact.email}
                firstName={contact.firstName}
                lastName={contact.lastName}
                companyName={contact.companyName}
                linkedInProfile={contact.linkedInProfile}
                role={contact.role}
                email={contact.email}
                phoneNumber={contact.phoneNumber}
              />
            );
          })
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default Contacts;
