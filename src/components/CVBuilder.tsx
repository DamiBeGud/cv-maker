import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useDownloadPDF } from '../hooks/use-download-pdf';
import { useHandleImageUpload } from '../hooks/use-handle-image-upload';
import translations from '../i18n/translations';
import { PersonalInfo } from '../interfaces/PersonalInfo';
import { Education } from '../interfaces/Education';
import { Experience } from '../interfaces/Experience';
import { Skill } from '../interfaces/Skill';
import { Language } from '../interfaces/Language';
import { CVData } from '../interfaces/CVData';
import { SupportedLanguage } from '../types/SupportedLanguage';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Preview } from './Preview';

export default function CVBuilder() {
  const [language, setLanguage] = useState<SupportedLanguage>('de');
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: '',
      dateOfBirth: '',
      showAge: false,
      profileImage: null,
      showImage: false
    },
    education: [],
    experience: [],
    skills: [],
    languages: []
  });

  const t = translations[language];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Utility function to chunk arrays for grid layout
  const chunkArray = (arr: any[], size: number) => 
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // --- Helper Functions ---

  // Distribute skills/languages into two columns as specified
  const distributeSkills = <T,>(items: T[]): [T[], T[]] => {
    const col1 = items.slice(0, 3);
    const col2 = items.slice(3, 6);
    items.slice(6).forEach((item, idx) => {
      (idx % 2 === 0 ? col1 : col2).push(item);
    });
    return [col1, col2];
  };

  // Validate image type and size
  const validTypes = [
    'image/jpeg', 'image/png', 'image/jpg', 'image/jfif', 'image/pjpeg', 'image/pjp', 'image/gif', 'image/bmp', 'image/webp'
  ];
  const validateImage = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    return validTypes.includes(file.type) && file.size <= maxSize;
  };

  // Validate URL (simple version)
  const isValidUrl = (url: string) => {
    try {
      if (!url) return false;
      const u = new URL(url.startsWith('http') ? url : 'https://' + url);
      return !!u.hostname;
    } catch {
      return false;
    }
  };

  const handleImageUpload = useHandleImageUpload(setCvData);

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string | boolean) => {
    setCvData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addEducation = () => {
    const newEducation: Education = {
      id: generateId(),
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const removeEducation = (id: string) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const addExperience = () => {
    const newExperience: Experience = {
      id: generateId(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeExperience = (id: string) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const addSkill = () => {
    const newSkill: Skill = {
      id: generateId(),
      name: '',
      level: 'intermediate'
    };
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    }));
  };

  const removeSkill = (id: string) => {
    setCvData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const addLanguage = () => {
    const newLanguage: Language = {
      id: generateId(),
      name: '',
      proficiency: 'conversational'
    };
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, newLanguage]
    }));
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    }));
  };

  const removeLanguage = (id: string) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== id)
    }));
  };

  const saveCV = () => {
    localStorage.setItem('cvData', JSON.stringify(cvData));
    toast({
      title: "CV Saved",
      description: "Your CV has been saved to local storage.",
      variant: "default"
    });
  };

  const loadCV = () => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      setCvData(JSON.parse(savedData));
      toast({
        title: "CV Loaded",
        description: "Your CV has been loaded from local storage.",
        variant: "default"
      });
    } else {
      toast({
        title: "No Saved CV",
        description: "No saved CV found in local storage.",
        variant: "destructive"
      });
    }
  };

  const downloadPDF = useDownloadPDF(cvData);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        t={t}
        loadCV={loadCV}
        saveCV={saveCV}
        downloadPDF={downloadPDF}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:h-[calc(100vh-120px)]">
          {/* Form Sidebar */}
          <Sidebar
            t={t}
            cvData={cvData}
            handleImageUpload={handleImageUpload.handleImageUpload}
            updatePersonalInfo={updatePersonalInfo}
            addEducation={addEducation}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addExperience={addExperience}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            addSkill={addSkill}
            updateSkill={updateSkill}
            removeSkill={removeSkill}
            addLanguage={addLanguage}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
            calculateAge={calculateAge}
            chunkArray={chunkArray}
          />

          {/* CV Preview */}
          <div className="self-start">
            <Preview
              t={t}
              cvData={cvData}
              calculateAge={calculateAge}
              distributeSkills={distributeSkills}
              isValidUrl={isValidUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}