import React from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { User, Camera, GraduationCap, Plus, Trash2, Briefcase, Award, Languages } from 'lucide-react';

interface SidebarProps {
  t: any;
  cvData: any;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  updatePersonalInfo: (field: string, value: string | boolean) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, field: string, value: string) => void;
  removeExperience: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: string) => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  updateLanguage: (id: string, field: string, value: string) => void;
  removeLanguage: (id: string) => void;
  calculateAge: (dateOfBirth: string) => number;
  chunkArray: (arr: any[], size: number) => any[][];
}

export const Sidebar: React.FC<SidebarProps> = ({
  t, cvData, handleImageUpload, updatePersonalInfo,
  addEducation, updateEducation, removeEducation,
  addExperience, updateExperience, removeExperience,
  addSkill, updateSkill, removeSkill,
  addLanguage, updateLanguage, removeLanguage,
  calculateAge, chunkArray
}) => (
  <Card className="p-0 shadow-elegant overflow-hidden bg-card">
    <ScrollArea className="h-full scrollbar-container sidebar-scroll">
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
                      className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start"
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
                    {cvData.education.map((edu: any) => (
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
                    {cvData.experience.map((exp: any) => (
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
              <Button onClick={addSkill} size="sm" variant="outline" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                {t.addSkill}
              </Button>
            </div>
            <div className="space-y-4">
              {chunkArray(cvData.skills, 2).map((row: any[], index: number) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {row.map((skill: any) => (
                    <div key={skill.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label>{t.skillName}</Label>
                        <Input
                          value={skill.name}
                          onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="w-full sm:w-32">
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
              <Button onClick={addLanguage} size="sm" variant="outline" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                {t.addLanguage}
              </Button>
            </div>
            <div className="space-y-4">
              {chunkArray(cvData.languages, 2).map((row: any[], index: number) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {row.map((lang: any) => (
                    <div key={lang.id} className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label>{t.languageName}</Label>
                        <Input
                          value={lang.name}
                          onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="w-full sm:w-32">
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
);
