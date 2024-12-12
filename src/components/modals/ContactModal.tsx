import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ContactModel from "@/pages/contacts/models/contact.model";
import apiClient from "@/api/apiClient";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import LoadingScreen from "@/pages/common/LoadingScreen";
import ErrorScreen from "@/pages/common/ErrorScreen";

//* Form Schema
const FormSchema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name cannot be empty"),
  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name cannot be empty"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Enter a valid email address"),
  companyName: z
    .string({ required_error: "Company Name is required" })
    .min(1, "Company Name cannot be empty"),
  role: z
    .string({ required_error: "Position/Role is required" })
    .min(1, "Position/Role cannot be empty"),
  phoneNumber: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  linkedInProfile: z
    .string()
    .regex(
      /^$|^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{5,30}\/?$/,
      "Please enter a valid Linked In URL"
    ),
});

interface AddContactModalProps {
  onClose: () => void; // Explicit type for the onClose prop
  inEditMode?: boolean;
  contactId?: string;
}

const ContactModal: React.FC<AddContactModalProps> = ({
  onClose,
  inEditMode,
  contactId,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      role: "",
      companyName: "",
      linkedInProfile: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    },
  });

  const { reset, watch } = form;

  //* React Query Client
  const queryClient = useQueryClient();

  //* When in edit mode this will get triggered
  const getContactById = async (contactId: string | undefined) => {
    if (contactId === undefined) return { message: "No Contact Found" };
    const response = await apiClient.get(`/contacts/${contactId}`);
    return response.data.data;
  };

  const {
    data: contactDetails,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["getContactById", contactId],
    queryFn: () => getContactById(contactId),
    enabled: !!contactId,
  });

  //* Set the default values in the form
  useEffect(() => {
    if (contactDetails && Object.keys(contactDetails).length > 0) {
      reset({
        email: contactDetails.email || "",
        firstName: contactDetails.firstName || "",
        lastName: contactDetails.lastName || "",
        phoneNumber: contactDetails.phoneNumber || "",
        companyName: contactDetails.companyName || "",
        role: contactDetails.role || "",
        linkedInProfile: contactDetails.linkedInProfile || "",
      });
    }
  }, [contactId, contactDetails, reset]);

  const addNewContact = async (newContact: ContactModel) => {
    const response = await apiClient.post("/contacts", newContact);
    return response.data.data;
  };

  const editContactById = async (newContact: ContactModel) => {
    const response = await apiClient.patch(
      `/contacts/${contactId}`,
      newContact
    );
    return response.data.data;
  };

  const mutation = useMutation({
    mutationFn: addNewContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllContacts"] });
      toast({
        title: "Contact has been added successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while adding contact !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  const editContactMutation = useMutation({
    mutationFn: editContactById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllContacts"] });
      toast({
        title: "Contact has been updated successfully !!",
      });
      onClose();
    },
    onError(error, variables, context) {
      toast({
        title: "Error occurred while updating contact !!",
        description: error.toString(),
      });
      onClose();
    },
  });

  //* Check if form state has changed
  const [valuesChanged, setValuesChanged] = useState<boolean>(false);
  const checkForChange = () => {
    if (contactDetails) {
      const hasChanged = Object.entries(form.getValues()).some(
        ([key, value]) => {
          return (
            contactDetails[key] &&
            value.toString() !== contactDetails[key].toString()
          );
        }
      );
      setValuesChanged(hasChanged);
    }
  };
  useEffect(() => {
    checkForChange();
  }, [watch()]);

  function onSubmit(values: z.infer<typeof FormSchema>) {
    const newContact = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      companyName: values.companyName,
      role: values.role,
      phoneNumber: values.phoneNumber,
      linkedInProfile: values.linkedInProfile,
    };
    if (inEditMode) {
      editContactMutation.mutate(newContact);
    } else {
      mutation.mutate(newContact);
    }
  }

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <ErrorScreen
        title="Error while fetching contact details"
        description="Could not find the contact"
      />
    );
  }

  return (
    <DialogContent className="modal overflow-auto max-h-screen scroll-mb-4 m-4 flex flex-col items-center max-w-xl w-full">
      <div className="w-full">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
          <DialogDescription>
            Save your contacts and references here !!
          </DialogDescription>
        </DialogHeader>
      </div>

      {/* Contact Addition Form */}
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="The person works at?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position/Role</FormLabel>
                    <FormControl>
                      <Input placeholder="The person works as a?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter the email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 12345 67890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedInProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="Enter the LinkedIn Profile URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                className={`w-full font-semibold ${
                  !valuesChanged ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={!valuesChanged}
              >
                {inEditMode ? "Update Contact" : "Save the Contact"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
};

export default ContactModal;
