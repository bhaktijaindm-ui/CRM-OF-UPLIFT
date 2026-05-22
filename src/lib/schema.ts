export type Department = 'Marketing' | 'Technology' | 'Sales';
export type ContentType = 'Video' | 'Graphics' | 'Carousel';
export type ContentStatus = 'Briefing' | 'Editing' | 'Client Review' | 'Scheduled' | 'Posted';
export type ClientStatus = 'Lead' | 'Active Pipeline' | 'Retainer' | 'Completed' | 'Offboarded';

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: Department;
  avatar: string;
  goals: {
    monthlyTarget: number;
    achieved: number;
  };
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  packageDetails: string;
  status: ClientStatus;
  accessCredentialsDetails: string; // Linked secure vaults
}

export interface ContentItem {
  id: string;
  taskName: string;
  clientId: string;       // Foreign Key -> Client
  assignedEmployeeId: string; // Foreign Key -> Employee
  contentType: ContentType;
  caption: string;
  referenceUrl: string;
  liveLink?: string;
  scheduledDate: string;  // YYYY-MM-DD
  status: ContentStatus;
  customerReviewRating?: number; // 1-5 Stars added automatically during review stage
}
