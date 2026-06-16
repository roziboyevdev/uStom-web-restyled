export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

export interface Professor {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  specialties: string[];
  socials?: {
    instagram?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface CourseAgendaItem {
  time: string;
  activity: string;
}

export interface Course {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  professorId: string;
  date: string;
  time: string;
  price: number;
  currency: string;
  remainingSeats: number;
  totalSeats: number;
  location: string;
  tags: string[];
  level: CourseLevel;
  category: string;
  agenda: CourseAgendaItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'cancelled';
  enrolledAt: string;
}
