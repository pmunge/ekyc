export interface Staff {
  id: string;
  username: string;
  firstName: string;
  middleName?: string;
  surName: string;
  email: string;
  phoneNumber?: string;
  idNumber?: string;
  county?: string;
  profileId?: string | number;
  profile?: string;
  status?: string;
}

export interface CreateUserPayload {
  username: string;
  firstName: string;
  middleName?: string;
  surName: string;
  email: string;
  phoneNumber?: string;
  idNumber?: string;
  county?: string;
  profileId: string | number;
}
