import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/locales/i18n';
import type { Language } from '@/types';

interface LanguageState {
  language: Language;
  dir: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      dir: 'ltr',
      setLanguage: (language) => {
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        set({ language, dir });
        i18n.changeLanguage(language);
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
        if (language === 'ar') {
          document.documentElement.classList.add('font-arabic');
        } else {
          document.documentElement.classList.remove('font-arabic');
        }
      },
      toggleLanguage: () => {
        const current = useLanguageStore.getState().language;
        const next = current === 'en' ? 'ar' : 'en';
        const dir = next === 'ar' ? 'rtl' : 'ltr';
        set({ language: next, dir });
        i18n.changeLanguage(next);
        document.documentElement.dir = dir;
        document.documentElement.lang = next;
        if (next === 'ar') {
          document.documentElement.classList.add('font-arabic');
        } else {
          document.documentElement.classList.remove('font-arabic');
        }
      },
    }),
    {
      name: 'language-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const { language } = state;
          const dir = language === 'ar' ? 'rtl' : 'ltr';
          state.dir = dir;
          i18n.changeLanguage(language);
          document.documentElement.dir = dir;
          document.documentElement.lang = language;
          if (language === 'ar') {
            document.documentElement.classList.add('font-arabic');
          }
        }
      },
    }
  )
);
