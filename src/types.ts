export type SummerSchoolStatus = 'açıyor' | 'açmıyor' | 'belirsiz';

export interface Course {
  id: string; // Auto-generated ID, usually slug of course code and name
  code: string;
  name: string;
}

export interface LastUpdatedByUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export interface Faculty {
  id: string; // Clean identifier (e.g. "eskisehir-osmangazi-ilh")
  city: string; // One of 81 Turkey cities
  univName: string; // University Name
  facultyName: string; // Faculty Title (İlahiyat / İslami İlimler)
  status: SummerSchoolStatus; // Current status
  announcementUrl?: string; // Link to announcement page
  coursesText?: string; // Raw text list of courses
  courses?: Course[]; // Structured course list
  lastUpdatedBy?: LastUpdatedByUser; // Meta details about the editor
  lastUpdatedAt?: any; // Firestore timestamp (or Date)
}
