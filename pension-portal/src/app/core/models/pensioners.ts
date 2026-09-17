export interface Pensioner {
  id: number;
  title: string;
  firstName: string;
  otherNames: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  nationalId: string;
  kraPin: string;
  dateOfBirth: string;
  pensionNumber: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  mpesaNumber: string;
  photoBase64: string;
  photoUrl: string;
  status: string;
  role: string;
  approvalStatus: string;
  enrolledByPensionEnrollmentId: number;
  enrolledByPensionName: string;
}

export interface CreatePensionerPayload {
  title: string;
  firstName: string;
  otherNames: string;
  emailAddress: string;
  phoneNumber: string;
  nationalId: string;
  kraPin?: string;
  dateOfBirth: string;
  pensionNumber: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  mpesaNumber: string;
  password: string;
  pin: string;
  photoBase64?: string;
  photoUrl?: string;
}
