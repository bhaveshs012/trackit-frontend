interface ContactModel {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  role: string;
  phoneNumber: string;
  linkedInProfile: string;
}

export interface EditContactModel {
  _id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  linkedInProfile: string;
  role: string;
  email: string;
  phoneNumber: string;
}

export default ContactModel;
