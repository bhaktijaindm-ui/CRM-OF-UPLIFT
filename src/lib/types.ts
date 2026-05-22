export type UserRole = 'admin' | 'manager' | 'sales';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export type ContactStatus = 'Lead' | 'Contacted' | 'Qualified' | 'Unqualified';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string; // Job title
  companyId: string; // Linked company
  status: ContactStatus;
  ownerId: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string; // e.g. "1-10", "11-50", "51-200", "201+"
  phone: string;
  address: string;
  ownerId: string; // User ID
  createdAt: string;
  updatedAt: string;
}

export type DealStage = 'New' | 'Contacted' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  name: string;
  amount: number;
  stage: DealStage;
  companyId: string;
  contactId: string;
  ownerId: string; // User ID
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'Pending' | 'Completed';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string; // User ID
  linkedType: 'contact' | 'deal' | 'none';
  linkedId: string; // ID of contact or deal
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  linkedType: 'contact' | 'deal';
  linkedId: string; // ID of contact or deal
  createdBy: string; // User ID
  createdAt: string;
}

export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'System';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  linkedType: 'contact' | 'deal' | 'none';
  linkedId: string;
  createdBy: string; // User ID or 'system'
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  contacts: Contact[];
  companies: Company[];
  deals: Deal[];
  tasks: Task[];
  notes: Note[];
  activities: Activity[];
}
