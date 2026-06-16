import { Course, Enrollment, Professor, User } from '../../types';
import { mockCourses, mockProfessors } from '../../data';

const API_BASE_URL = 'https://api.u-stom.uz/api/v1';

// Helper for managing simulated local data in case real API fails/offline
const getLocalData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(`ustom_local_${key}`);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalData = <T>(key: string, value: T): void => {
  localStorage.setItem(`ustom_local_${key}`, JSON.stringify(value));
};

// Initialize simulated database in localStorage
if (!localStorage.getItem('ustom_local_courses')) {
  setLocalData('courses', mockCourses);
}
if (!localStorage.getItem('ustom_local_professors')) {
  setLocalData('professors', mockProfessors);
}
if (!localStorage.getItem('ustom_local_enrollments')) {
  setLocalData('enrollments', [] as Enrollment[]);
}
if (!localStorage.getItem('ustom_local_users')) {
  setLocalData('users', [] as User[]);
}

export const api = {
  // --- AUTH METHODS ---
  async register(name: string, email: string, password: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, avatar: null }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Real API register failed, falling back to simulated mode', e);
    }

    // Simulated offline registration
    const users = getLocalData<any[]>('users', []);
    const existing = users.find(u => u.email === email);
    if (existing) {
      throw new Error('Ushbu email bilan ro\'yxatdan o\'tilgan!');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`, // Elegant placeholder avatar
      role: 'user',
    };

    users.push({ ...newUser, password });
    setLocalData('users', users);
    return newUser;
  },

  async login(email: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        // Set cookie for middleware indicator
        document.cookie = "ustom_auth=1; path=/; max-age=604800; SameSite=Lax";
        return data;
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Avtorizatsiya xatosi');
      }
    } catch (e) {
      console.warn('Real API login failed, falling back to simulated mode', e);
    }

    // Simulated offline login
    const users = getLocalData<any[]>('users', []);
    const user = users.find(u => u.email === email);
    
    // Create direct test user if any email/password matches a built-in test account or for easy onboarding
    if (!user && email === 'test@example.com') {
      const testUser = {
        id: 'user-test',
        name: 'Ali Valiyev',
        email: 'test@example.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        password: 'password123'
      };
      users.push(testUser);
      setLocalData('users', users);
      
      document.cookie = "ustom_auth=1; path=/; max-age=604800; SameSite=Lax";
      const token = `simulated-jwt-${testUser.id}`;
      return { access_token: token, refresh_token: `simulated-refresh-${testUser.id}` };
    }

    if (!user || user.password !== password) {
      throw new Error('Email yoki parol noto\'g\'ri!');
    }

    document.cookie = "ustom_auth=1; path=/; max-age=604800; SameSite=Lax";
    const token = `simulated-jwt-${user.id}`;
    return { access_token: token, refresh_token: `simulated-refresh-${user.id}` };
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem('ustom_access_token');
      await fetch(`${API_BASE_URL}/user/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (e) {
      console.warn('Real API logout non-blocking warning', e);
    }

    // Always clear storage anyway
    localStorage.removeItem('ustom_access_token');
    localStorage.removeItem('ustom_refresh_token');
    document.cookie = "ustom_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },

  // --- PROFILE METHODS ---
  async getProfile(accessToken: string): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Real API getProfile failed, fallback to simulated', e);
    }

    // Simulated offline profile retrieval from jwt token
    const userId = accessToken.replace('simulated-jwt-', '');
    const users = getLocalData<any[]>('users', []);
    const found = users.find(u => u.id === userId);
    
    if (found) {
      return {
        id: found.id,
        name: found.name,
        email: found.email,
        avatar: found.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: found.role || 'user'
      };
    }
    
    throw new Error('Sessiya muddati tugadi.');
  },

  // --- ENROLLMENT METHODS ---
  async getMyEnrollments(accessToken: string): Promise<Enrollment[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/enrollments/me`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      if (response.ok) {
        const list = await response.json();
        // Transform backend format to camelCase
        return list.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          courseId: item.course_id,
          status: item.status,
          enrolledAt: item.enrolled_at,
        }));
      }
    } catch (e) {
      console.warn('Real API getMyEnrollments failed, fallback to simulated', e);
    }

    // Simulated
    const userId = accessToken.replace('simulated-jwt-', '');
    const enrollments = getLocalData<Enrollment[]>('enrollments', []);
    return enrollments.filter(e => e.userId === userId);
  },

  // --- COURSES METHODS ---
  async getCourses(filters?: { search?: string; level?: string; tag?: string; professorId?: string }): Promise<Course[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.level) queryParams.append('level', filters.level);
      if (filters?.tag) queryParams.append('tag', filters.tag);
      if (filters?.professorId) queryParams.append('professor_id', filters.professorId);

      const response = await fetch(`${API_BASE_URL}/user/courses?${queryParams.toString()}`);
      if (response.ok) {
        const list = await response.json();
        // transform and return
        return list.map((item: any) => ({
          id: item.id,
          title: item.title,
          shortDesc: item.short_desc,
          fullDesc: item.full_desc,
          image: item.image,
          professorId: item.professor_id,
          date: item.date,
          time: item.time,
          price: Number(item.price),
          currency: item.currency,
          remainingSeats: item.remaining_seats,
          totalSeats: item.total_seats,
          location: item.location,
          tags: item.tags || [],
          level: item.level,
          category: item.category?.name || item.category || '',
          agenda: item.agenda || []
        }));
      }
    } catch (e) {
      console.warn('Real API getCourses failed, fallback to simulated', e);
    }

    // Simulated filtration
    let courses = getLocalData<Course[]>('courses', mockCourses);
    
    if (filters) {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        courses = courses.filter(c => 
          c.title.toLowerCase().includes(s) || 
          c.shortDesc.toLowerCase().includes(s) || 
          c.fullDesc.toLowerCase().includes(s)
        );
      }
      if (filters.level) {
        courses = courses.filter(c => c.level === filters.level);
      }
      if (filters.tag) {
        courses = courses.filter(c => c.tags.includes(filters.tag!));
      }
      if (filters.professorId) {
        courses = courses.filter(c => c.professorId === filters.professorId);
      }
    }

    return courses;
  },

  async getCourseById(id: string): Promise<Course & { professor?: Professor } | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/courses/${id}`);
      if (response.ok) {
        const item = await response.json();
        const course = {
          id: item.id,
          title: item.title,
          shortDesc: item.short_desc,
          fullDesc: item.full_desc,
          image: item.image,
          professorId: item.professor_id,
          date: item.date,
          time: item.time,
          price: Number(item.price),
          currency: item.currency,
          remainingSeats: item.remaining_seats,
          totalSeats: item.total_seats,
          location: item.location,
          tags: item.tags || [],
          level: item.level,
          category: item.category?.name || item.category || '',
          agenda: item.agenda || []
        };
        
        let professor: Professor | undefined;
        if (item.professor) {
          professor = {
            id: item.professor.id,
            name: item.professor.name,
            title: item.professor.title,
            bio: item.professor.bio,
            image: item.professor.image,
            specialties: item.professor.specialties,
            socials: item.professor.socials
          };
        } else {
          // If not in response, try to fetch or find
          const professors = await this.getProfessors();
          professor = professors.find(p => p.id === course.professorId);
        }

        return { ...course, professor };
      }
    } catch (e) {
      console.warn('Real API getCourseById failed, fallback to simulated', e);
    }

    // Simulated
    const courses = getLocalData<Course[]>('courses', mockCourses);
    const course = courses.find(c => c.id === id) || null;
    if (!course) return null;

    const professors = getLocalData<Professor[]>('professors', mockProfessors);
    const professor = professors.find(p => p.id === course.professorId);
    
    return { ...course, professor };
  },

  async enrollInCourse(accessToken: string, courseId: string): Promise<Enrollment> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const item = await response.json();
        return {
          id: item.id,
          userId: item.user_id,
          courseId: item.course_id,
          status: item.status,
          enrolledAt: item.enrolled_at,
        };
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Kursga yozilishda muammo yuz berdi');
      }
    } catch (e) {
      console.warn('Real API enrollInCourse failed, fallback to simulated', e);
    }

    // Simulated offline enrollment
    const userId = accessToken.replace('simulated-jwt-', '');
    const enrollments = getLocalData<Enrollment[]>('enrollments', []);
    const courses = getLocalData<Course[]>('courses', mockCourses);

    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) {
      throw new Error('Kurs topilmadi');
    }

    const course = courses[courseIndex];
    
    // Check if seats left
    if (course.remainingSeats <= 0) {
      throw new Error('Afsuski, barcha joylar to\'lgan!');
    }

    // Check if already enrolled
    const alreadyEnrolled = enrollments.some(e => e.userId === userId && e.courseId === courseId && e.status === 'active');
    if (alreadyEnrolled) {
      throw new Error('Siz ushbu darsga allaqachon yozilgansiz!');
    }

    // Decrement remaining seats of course
    course.remainingSeats -= 1;
    courses[courseIndex] = course;
    setLocalData('courses', courses);

    const newEnrollment: Enrollment = {
      id: `enroll-${Date.now()}`,
      userId,
      courseId,
      status: 'active',
      enrolledAt: new Date().toISOString()
    };

    enrollments.push(newEnrollment);
    setLocalData('enrollments', enrollments);

    return newEnrollment;
  },

  async cancelEnrollment(accessToken: string, enrollmentId: string): Promise<void> {
    // Simulated cancel enrollment
    const enrollments = getLocalData<Enrollment[]>('enrollments', []);
    const enrollIndex = enrollments.findIndex(e => e.id === enrollmentId);
    if (enrollIndex !== -1) {
      const enrollment = enrollments[enrollIndex];
      enrollment.status = 'cancelled';
      enrollments[enrollIndex] = enrollment;
      
      // Increment remaining seats of course
      const courses = getLocalData<Course[]>('courses', mockCourses);
      const courseIndex = courses.findIndex(c => c.id === enrollment.courseId);
      if (courseIndex !== -1) {
        courses[courseIndex].remainingSeats = Math.min(courses[courseIndex].remainingSeats + 1, courses[courseIndex].totalSeats);
        setLocalData('courses', courses);
      }
      
      setLocalData('enrollments', enrollments);
    }
  },

  // --- PROFESSORS METHODS ---
  async getProfessors(filters?: { search?: string }): Promise<Professor[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.search) queryParams.append('search', filters.search);

      const response = await fetch(`${API_BASE_URL}/user/professors?${queryParams.toString()}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Real API getProfessors failed, fallback to simulated', e);
    }

    // Simulated
    let professors = getLocalData<Professor[]>('professors', mockProfessors);

    if (filters?.search) {
      const s = filters.search.toLowerCase();
      professors = professors.filter(p => 
        p.name.toLowerCase().includes(s) || 
        p.title.toLowerCase().includes(s) || 
        p.bio.toLowerCase().includes(s)
      );
    }

    return professors;
  },

  async getProfessorById(id: string): Promise<Professor | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/professors/${id}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('Real API getProfessorById failed, fallback to simulated', e);
    }

    // Simulated
    const professors = getLocalData<Professor[]>('professors', mockProfessors);
    return professors.find(p => p.id === id) || null;
  }
};
