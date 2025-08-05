import { PersonalInfo } from './PersonalInfo';
import { Education } from './Education';
import { Experience } from './Experience';
import { Skill } from './Skill';
import { Language } from './Language';

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
}
