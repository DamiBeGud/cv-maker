import React from 'react';
import { Card } from './ui/card';

interface PreviewProps {
  t: any;
  cvData: any;
  calculateAge: (dateOfBirth: string) => number;
  distributeSkills: (items: any[]) => [any[], any[]];
  isValidUrl: (url: string) => boolean;
}

export const Preview: React.FC<PreviewProps> = ({ t, cvData, calculateAge, distributeSkills, isValidUrl }) => (
  <Card className="p-6 shadow-elegant">
    <div className="h-[calc(100vh-120px)] overflow-auto scrollbar-container">
      <div
        id="cv-preview"
        className="bg-white shadow-lg mx-auto p-8 cv-preview-container"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
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
                      {cvData.personalInfo.showAge ? `${t.age}: ` : `${t.dateOfBirth}: `}
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
                      href={cvData.personalInfo.website.startsWith('http') ? cvData.personalInfo.website : 'https://' + cvData.personalInfo.website}
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
                      href={cvData.personalInfo.linkedin.startsWith('http') ? cvData.personalInfo.linkedin : 'https://' + cvData.personalInfo.linkedin}
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
              {cvData.experience.map((exp: any) => (
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
              {cvData.education.map((edu: any) => (
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
                      {skillsCol1.map((skill: any) => (
                        <div key={skill.id} className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({t[skill.level as keyof typeof t] || skill.level})
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="skills-column flex flex-col gap-2 flex-1">
                      {skillsCol2.map((skill: any) => (
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
                      {langCol1.map((lang: any) => (
                        <div key={lang.id} className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{lang.name}</span>
                          <span className="text-sm text-muted-foreground">
                            ({t[lang.proficiency as keyof typeof t] || lang.proficiency})
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="skills-column flex flex-col gap-2 flex-1">
                      {langCol2.map((lang: any) => (
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
);
