'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Client, ContentItem } from '../lib/schema';

// High-Fidelity Enterprise Mock Data
const initialEmployees: Employee[] = [
  { id: 'emp-1', name: 'Arjun Mehta', email: 'arjun@firm.com', department: 'Marketing', avatar: 'AM', goals: { monthlyTarget: 20, achieved: 16 } },
  { id: 'emp-2', name: 'Siddharth Nair', email: 'sid@firm.com', department: 'Technology', avatar: 'SN', goals: { monthlyTarget: 10, achieved: 9 } },
  { id: 'emp-3', name: 'Neha Sharma', email: 'neha@firm.com', department: 'Sales', avatar: 'NS', goals: { monthlyTarget: 15, achieved: 11 } }
];

const initialClients: Client[] = [
  { id: 'cli-1', companyName: 'Apex Analytics Corp', contactPerson: 'Rajesh Kumar', email: 'ops@apex.io', phone: '+91 98765 43210', address: 'Vijay Nagar, Indore', packageDetails: 'Premium Enterprise SEO & Video Suite', status: 'Active Pipeline', accessCredentialsDetails: 'GDocs Vault #A1, AWS Asset Bucket v2' },
  { id: 'cli-2', companyName: 'Nova Health Tech', contactPerson: 'Priyanka Choithram', email: 'dr.priyanka@novahealth.in', phone: '+91 91110 22233', address: 'Palasia Cross, Indore', packageDetails: 'SXO & Bi-Weekly Motion Graphics', status: 'Retainer', accessCredentialsDetails: 'WP-Admin Secure Node 4' }
];

const initialContent: ContentItem[] = [
  { id: 'cont-1', taskName: 'Q2 Performance Breakdown Video', clientId: 'cli-1', assignedEmployeeId: 'emp-1', contentType: 'Video', caption: 'Scaling SEO architectures in 2026. Here is the blueprint.', referenceUrl: 'https://vimeo.com/ref/992', scheduledDate: '2026-05-25', status: 'Editing' },
  { id: 'cont-2', taskName: 'SaaS UX High-Contrast System Graphics', clientId: 'cli-2', assignedEmployeeId: 'emp-2', contentType: 'Graphics', caption: 'Why dark layouts retain 40% more engineering focus.', referenceUrl: 'https://behance.net/ref/801', scheduledDate: '2026-05-26', status: 'Client Review', customerReviewRating: 5 },
  { id: 'cont-3', taskName: 'AI Optimization Trends Deck', clientId: 'cli-1', assignedEmployeeId: 'emp-1', contentType: 'Carousel', caption: 'Moving beyond legacy anchors into contextual answer generation.', referenceUrl: 'https://figma.com/ref/404', scheduledDate: '2026-05-28', status: 'Scheduled' }
];

interface CRMContextType {
  employees: Employee[];
  clients: Client[];
  content: ContentItem[];
  updateContentItem: (updatedItem: ContentItem) => void;
  addContentItem: (newItem: ContentItem) => void;
  updateClient: (updatedClient: Client) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [content, setContent] = useState<ContentItem[]>(initialContent);

  // Automation Loop: When content states change, automatically scale employee achievements
  useEffect(() => {
    const trackingMap: Record<string, number> = {};
    content.forEach(item => {
      if (item.status === 'Posted' || item.status === 'Scheduled') {
        trackingMap[item.assignedEmployeeId] = (trackingMap[item.assignedEmployeeId] || 0) + 1;
      }
    });

    setEmployees(prev =>
      prev.map(emp => ({
        ...emp,
        goals: {
          ...emp.goals,
          achieved: trackingMap[emp.id] || 0
        }
      }))
    );
  }, [content]);

  const updateContentItem = (updatedItem: ContentItem) => {
    setContent(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const addContentItem = (newItem: ContentItem) => {
    setContent(prev => [...prev, newItem]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  return (
    <CRMContext.Provider value={{ employees, clients, content, updateContentItem, addContentItem, updateClient }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be wrapped within a CRMProvider');
  return context;
}
