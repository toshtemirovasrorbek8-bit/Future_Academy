export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  difficulty: 'Boshlang\'ich' | 'O\'rta' | 'Mukammal';
  price: string;
  rating: number;
  enrolledStudents: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  modules: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  recommended: boolean;
  badge?: string;
}

export interface CallLog {
  id: string;
  timestamp: string;
  duration: string;
  type: 'kiruvchi' | 'chiquvchi';
  status: 'bajarildi' | 'rad_etildi' | 'o\'tkazib_yuborildi';
  summary: string;
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  level: string;
  selectedCourseId: string;
  balance: number;
  idCardNumber: string;
  isRegistered: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'lola';
  text: string;
  timestamp: string;
}
