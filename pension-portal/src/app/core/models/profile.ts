export interface Profile {
  id?: string | number;
  name: string;
  description?: string;
  status?: string;
  roles?: string[];
}

export const PROFILE_STATUSES = ['Active', 'Inactive'] as const;
