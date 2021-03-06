export interface Competition {
  id?: string;
  name: string;
  shortName: string;
  typeId: string;
  type: string;
  startDate: any;
  endDate: any;
  dateRange: string;
  place: string;
  organizer: string;
  isJunior: boolean;
  status: string;
  medals?: string;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}

export interface CompetitionApplication {
  id?: string;
  competitionId: string;
  registry: string
  lastName: string;
  firstName: string;
  age: number;
  gender: 'Эр' | 'Эм';
  rank: string;
  range: string[];
  rangeTitles: string[];
  health: string;
  photoURL?: string;
  uploadedBy?: string;
  uploadedId?: string;
  uploadedAt?: any;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}

export interface Race {
  id?: string;
  date: any;
  order: number;
  title: string
  gender: ['Эр'] | ['Эм'] | ['Эр', 'Эм'];
  distance: number;
  type: string;
  createdAt?: any;
  createdBy?: string;
  createdId?: string;
  updatedAt?: any;
  updatedBy?: string;
  updatedId?: string;
}
