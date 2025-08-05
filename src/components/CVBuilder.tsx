import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
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
      <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            {t.cvBuilder}
          </h1>
          
          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
              <SelectTrigger className="w-32">
                <Globe className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="hr">Hrvatski/Srpski/Bosanski</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadCV} size="sm">
                <Upload className="h-4 w-4 mr-2" />
                {t.load}
              </Button>
              <Button variant="outline" onClick={saveCV} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {t.save}
              </Button>
              <Button onClick={downloadPDF} size="sm" className="bg-gradient-primary hover:shadow-glow">
                <Download className="h-4 w-4 mr-2" />
                {t.download}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Form Sidebar */}
          <Card className="p-0 shadow-elegant overflow-hidden bg-card">
            <ScrollArea className="h-full bg-card scrollbar-container">
              <div className="p-6 bg-card">
                <div className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <User className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">{t.personalInformation}</h2>
                    </div>
                    <div className="space-y-4">
                      {/* Image Upload */}
                      <div className="space-y-3">
                        <Label htmlFor="profileImage">{t.uploadImage}</Label>
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Input
                              id="profileImage"
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="sr-only"
                            />
                            <Button
                              variant="outline"
                              onClick={() => document.getElementById('profileImage')?.click()}
                              className="flex items-center gap-2"
                              type="button"
                            >
                              <Camera className="h-4 w-4" />
                              {t.uploadImage}
                            </Button>
                          </div>
                          {cvData.personalInfo.profileImage && (
                            <div className="flex items-center gap-2">
                              <img
                                src={cvData.personalInfo.profileImage}
                                alt="Profile preview"
                                className="w-14 h-14 rounded-full object-cover border profile-image-preview"
                              />
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="showImage"
                                  checked={cvData.personalInfo.showImage}
                                  onCheckedChange={(checked) => updatePersonalInfo('showImage', checked)}
                                />
                                <Label htmlFor="showImage" className="text-sm">{t.showImage}</Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="fullName">{t.fullName}</Label>
                        <Input
                          id="fullName"
                          value={cvData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">{t.email}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={cvData.personalInfo.email}
                            onChange={(e) => updatePersonalInfo('email', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">{t.phone}</Label>
                          <Input
                            id="phone"
                            value={cvData.personalInfo.phone}
                            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="address">{t.address}</Label>
                        <Input
                          id="address"
                          value={cvData.personalInfo.address}
                          onChange={(e) => updatePersonalInfo('address', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="linkedin">{t.linkedin}</Label>
                          <Input
                            id="linkedin"
                            value={cvData.personalInfo.linkedin}
                            onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">{t.website}</Label>
                          <Input
                            id="website"
                            value={cvData.personalInfo.website}
                            onChange={(e) => updatePersonalInfo('website', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {/* Date of Birth */}
                      <div className="space-y-3">
                        <Label htmlFor="dateOfBirth">{t.dateOfBirth}</Label>
                        <div className="space-y-3">
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={cvData.personalInfo.dateOfBirth}
                            onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                          />
                          {cvData.personalInfo.dateOfBirth && (
                            <div className="flex items-center space-x-2">
                              <Switch
                                id="showAge"
                                checked={cvData.personalInfo.showAge}
                                onCheckedChange={(checked) => updatePersonalInfo('showAge', checked)}
                              />
                              <Label htmlFor="showAge" className="text-sm">{t.showAge}</Label>
                              {cvData.personalInfo.showAge && (
                                <span className="text-sm text-muted-foreground">
                                  (Age: {calculateAge(cvData.personalInfo.dateOfBirth)})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Education */}
                  <Accordion type="single" collapsible className="w-full" defaultValue="education">
                    <AccordionItem value="education">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">{t.education}</h2>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Button onClick={addEducation} size="sm" variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            {t.addEducation}
                          </Button>
                          <div className="space-y-6">
                            {cvData.education.map((edu) => (
                              <Card key={edu.id} className="p-4 bg-muted/50">
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">{t.education}</h3>
                                  <Button
                                    onClick={() => removeEducation(edu.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label>{t.degree}</Label>
                                    <Input
                                      value={edu.degree}
                                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>{t.institution}</Label>
                                    <Input
                                      value={edu.institution}
                                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>{t.startDate}</Label>
                                      <Input
                                        type="month"
                                        value={edu.startDate}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label>{t.endDate}</Label>
                                      <Input
                                        type="month"
                                        value={edu.endDate}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>{t.description}</Label>
                                    <Textarea
                                      value={edu.description}
                                      onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                                      className="mt-1"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Separator />

                  {/* Work Experience */}
                  <Accordion type="single" collapsible className="w-full" defaultValue="experience">
                    <AccordionItem value="experience">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <h2 className="text-lg font-semibold">{t.workExperience}</h2>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Button onClick={addExperience} size="sm" variant="outline" className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            {t.addExperience}
                          </Button>
                          <div className="space-y-6">
                            {cvData.experience.map((exp) => (
                              <Card key={exp.id} className="p-4 bg-muted/50">
                                <div className="flex justify-between items-start mb-4">
                                  <h3 className="font-medium">{t.workExperience}</h3>
                                  <Button
                                    onClick={() => removeExperience(exp.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label>{t.jobTitle}</Label>
                                    <Input
                                      value={exp.jobTitle}
                                      onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>{t.company}</Label>
                                    <Input
                                      value={exp.company}
                                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                      className="mt-1"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <Label>{t.startDate}</Label>
                                      <Input
                                        type="month"
                                        value={exp.startDate}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div>
                                      <Label>{t.endDate}</Label>
                                      <Input
                                        type="month"
                                        value={exp.endDate}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                        className="mt-1"
                                        placeholder={t.present}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label>{t.description}</Label>
                                    <Textarea
                                      value={exp.description}
                                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                      className="mt-1"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Separator />

                  {/* Skills */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{t.skills}</h2>
                      </div>
                      <Button onClick={addSkill} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        {t.addSkill}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {chunkArray(cvData.skills, 2).map((row, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {row.map((skill) => (
                            <div key={skill.id} className="flex items-end gap-3">
                              <div className="flex-1">
                                <Label>{t.skillName}</Label>
                                <Input
                                  value={skill.name}
                                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="w-32">
                                <Label>{t.level}</Label>
                                <Select
                                  value={skill.level}
                                  onValueChange={(value) => updateSkill(skill.id, 'level', value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="beginner">{t.beginner}</SelectItem>
                                    <SelectItem value="intermediate">{t.intermediate}</SelectItem>
                                    <SelectItem value="advanced">{t.advanced}</SelectItem>
                                    <SelectItem value="expert">{t.expert}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={() => removeSkill(skill.id)}
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive mb-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Languages */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{t.languages}</h2>
                      </div>
                      <Button onClick={addLanguage} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        {t.addLanguage}
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {chunkArray(cvData.languages, 2).map((row, index) => (
                        <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {row.map((lang) => (
                            <div key={lang.id} className="flex items-end gap-3">
                              <div className="flex-1">
                                <Label>{t.languageName}</Label>
                                <Input
                                  value={lang.name}
                                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="w-32">
                                <Label>{t.proficiency}</Label>
                                <Select
                                  value={lang.proficiency}
                                  onValueChange={(value) => updateLanguage(lang.id, 'proficiency', value)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="basic">{t.basic}</SelectItem>
                                    <SelectItem value="conversational">{t.conversational}</SelectItem>
                                    <SelectItem value="fluent">{t.fluent}</SelectItem>
                                    <SelectItem value="native">{t.native}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={() => removeLanguage(lang.id)}
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive mb-1"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>

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