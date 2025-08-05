import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Save, 
  Upload, 
  Plus, 
  Trash2, 
  Languages, 
  User, 
  GraduationCap, 
  Briefcase, 
  Award,
  Globe,
  Camera
} from 'lucide-react';
import { useDownloadPDF } from '../hooks/use-download-pdf';
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
import { Card } from './ui/card';

export default function CVBuilder() {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateImage(file)) {
        toast({
          title: "Invalid Image",
          description: "Please upload an image (JPG, JPEG, PNG, JFIF, PJPEG, PJP, GIF, BMP, WEBP) under 2MB.",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCvData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, profileImage: result }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Form Sidebar */}
          <Sidebar
            t={t}
            cvData={cvData}
            handleImageUpload={handleImageUpload}
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
          <Card className="p-6 shadow-elegant">
            <div className="h-[calc(100vh-120px)] overflow-auto scrollbar-container">
              <div
                id="cv-preview"
                className="bg-white shadow-lg mx-auto p-8 cv-preview-container"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {/* Header */}
                <div className="border-b-2 border-primary pb-6 mb-6">
                  <div className="flex items-start gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold text-foreground mb-2">
                        {cvData.personalInfo.fullName || 'Your Name'}
                      </h1>
                      <div className="text-muted-foreground space-y-1">
                        {cvData.personalInfo.email && (
                          <div className="contact-item">
                            <span className="font-medium">{t.email}: </span>
                            {cvData.personalInfo.email}
                          </div>
                        )}
                        {cvData.personalInfo.phone && (
                          <div className="contact-item">
                            <span className="font-medium">{t.phone}: </span>
                            {cvData.personalInfo.phone}
                          </div>
                        )}
                        {cvData.personalInfo.address && (
                          <div className="contact-item">
                            <span className="font-medium">{t.address}: </span>
                            {cvData.personalInfo.address}
                          </div>
                        )}
                        {cvData.personalInfo.dateOfBirth && (
                          <div className="contact-item">
                            <span className="font-medium">
                              {cvData.personalInfo.showAge
                                ? `${t.age}: `
                                : `${t.dateOfBirth}: `}
                            </span>
                            {cvData.personalInfo.showAge
                              ? calculateAge(cvData.personalInfo.dateOfBirth)
                              : new Date(cvData.personalInfo.dateOfBirth).toLocaleDateString()}
                          </div>
                        )}
                        {isValidUrl(cvData.personalInfo.website) && (
                          <div className="contact-item">
                            <span className="font-medium">{t.website}: </span>
                            <a
                              href={
                                cvData.personalInfo.website.startsWith('http')
                                  ? cvData.personalInfo.website
                                  : 'https://' + cvData.personalInfo.website
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline break-all"
                            >
                              {cvData.personalInfo.website}
                            </a>
                          </div>
                        )}
                        {isValidUrl(cvData.personalInfo.linkedin) && (
                          <div className="contact-item">
                            <span className="font-medium">{t.linkedin}: </span>
                            <a
                              href={
                                cvData.personalInfo.linkedin.startsWith('http')
                                  ? cvData.personalInfo.linkedin
                                  : 'https://' + cvData.personalInfo.linkedin
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline break-all"
                            >
                              {cvData.personalInfo.linkedin}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    {cvData.personalInfo.profileImage && cvData.personalInfo.showImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={cvData.personalInfo.profileImage}
                          alt="Profile"
                          className="profile-image rounded-full object-cover border-2 border-primary"
                          style={{ width: 125, height: 125, aspectRatio: '1/1', objectFit: 'cover' }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience */}
                {cvData.experience.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">
                      {t.workExperience}
                    </h2>
                    <div className="space-y-4">
                      {cvData.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-foreground">{exp.jobTitle}</h3>
                            <span className="text-sm text-muted-foreground">
                              {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                              {exp.startDate && exp.endDate && ' - '}
                              {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : exp.startDate && t.present}
                            </span>
                          </div>
                          <div className="text-primary font-medium mb-2">{exp.company}</div>
                          {exp.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {cvData.education.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">
                      {t.education}
                    </h2>
                    <div className="space-y-4">
                      {cvData.education.map((edu) => (
                        <div key={edu.id}>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                            <span className="text-sm text-muted-foreground">
                              {edu.startDate && new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                              {edu.startDate && edu.endDate && ' - '}
                              {edu.endDate && new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                            </span>
                          </div>
                          <div className="text-primary font-medium mb-2">{edu.institution}</div>
                          {edu.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {cvData.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">
                      {t.skills}
                    </h2>
                    <div className="skills-grid flex gap-8">
                      {(() => {
                        const [skillsCol1, skillsCol2] = distributeSkills(cvData.skills);
                        return (
                          <>
                            <div className="skills-column flex flex-col gap-2 flex-1">
                              {skillsCol1.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{skill.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({t[skill.level as keyof typeof t] || skill.level})
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="skills-column flex flex-col gap-2 flex-1">
                              {skillsCol2.map((skill) => (
                                <div key={skill.id} className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{skill.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({t[skill.level as keyof typeof t] || skill.level})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {cvData.languages.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-4 border-b border-border pb-2">
                      {t.languages}
                    </h2>
                    <div className="skills-grid flex gap-8">
                      {(() => {
                        const [langCol1, langCol2] = distributeSkills(cvData.languages);
                        return (
                          <>
                            <div className="skills-column flex flex-col gap-2 flex-1">
                              {langCol1.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{lang.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({t[lang.proficiency as keyof typeof t] || lang.proficiency})
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="skills-column flex flex-col gap-2 flex-1">
                              {langCol2.map((lang) => (
                                <div key={lang.id} className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{lang.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    ({t[lang.proficiency as keyof typeof t] || lang.proficiency})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}