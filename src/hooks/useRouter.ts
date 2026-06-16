import { useState, useEffect } from 'react';

export type PageView = 'home' | 'courses' | 'course-detail' | 'professors' | 'professor-detail' | 'auth' | 'profile';

interface RouterState {
  view: PageView;
  params: { id?: string };
}

export const useRouter = () => {
  const [route, setRoute] = useState<RouterState>({ view: 'home', params: {} });

  // Parse URL hash to route state
  const parseHash = () => {
    const hash = window.location.hash || '#/';
    
    if (hash === '#/' || hash === '') {
      return { view: 'home' as PageView, params: {} };
    }
    
    if (hash.startsWith('#/courses/')) {
      const id = hash.replace('#/courses/', '');
      return { view: 'course-detail' as PageView, params: { id } };
    }
    
    if (hash === '#/courses') {
      return { view: 'courses' as PageView, params: {} };
    }
    
    if (hash.startsWith('#/professors/')) {
      const id = hash.replace('#/professors/', '');
      return { view: 'professor-detail' as PageView, params: { id } };
    }
    
    if (hash === '#/professors') {
      return { view: 'professors' as PageView, params: {} };
    }
    
    if (hash === '#/auth') {
      return { view: 'auth' as PageView, params: {} };
    }
    
    if (hash === '#/profile') {
      return { view: 'profile' as PageView, params: {} };
    }

    return { view: 'home' as PageView, params: {} };
  };

  useEffect(() => {
    // Initial parse
    setRoute(parseHash());

    const handleHashChange = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: PageView, params?: { id?: string }) => {
    let hash = '#/';
    switch (view) {
      case 'home':
        hash = '#/';
        break;
      case 'courses':
        hash = '#/courses';
        break;
      case 'course-detail':
        hash = `#/courses/${params?.id || ''}`;
        break;
      case 'professors':
        hash = '#/professors';
        break;
      case 'professor-detail':
        hash = `#/professors/${params?.id || ''}`;
        break;
      case 'auth':
        hash = '#/auth';
        break;
      case 'profile':
        hash = '#/profile';
        break;
    }
    window.location.hash = hash;
  };

  return {
    view: route.view,
    params: route.params,
    navigate,
  };
};
