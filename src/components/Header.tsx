import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Button } from './ui/button';
import { Upload, Save, Download, Globe, Menu, X } from 'lucide-react';
import { SupportedLanguage } from '../types/SupportedLanguage';

interface HeaderProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: any;
  loadCV: () => void;
  saveCV: () => void;
  downloadPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage, t, loadCV, saveCV, downloadPDF }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          {t.cvBuilder}
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
            <SelectTrigger className="w-32">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
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

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-border py-4 px-4 flex flex-col items-center gap-4">
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
        </div>)}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-border py-4 px-4 flex flex-col items-center gap-4">
          <Select value={language} onValueChange={(value) => setLanguage(value as SupportedLanguage)}>
            <SelectTrigger className="w-full">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Español</SelectItem>
              <SelectItem value="hr">Hrvatski/Srpski/Bosanski</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};
