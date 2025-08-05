import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useCallback } from 'react';
import { useToast } from '../components/ui/use-toast';
import { CVData } from '../interfaces/CVData';

export function useDownloadPDF(cvData: CVData) {
  const { toast } = useToast();

  const downloadPDF = useCallback(async () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;

    try {
      // Pre-render image loading guarantee
      await new Promise<void>(resolve => {
        if (document.images.length > 0) {
          const img = document.images[0];
          img.onload = () => resolve();
          if (img.complete) resolve();
        } else resolve();
      });

      // Create a temporary container for PDF generation
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.height = '297mm';
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '10mm';
      tempContainer.style.boxSizing = 'border-box';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';

      // Clone the CV content
      const clonedElement = element.cloneNode(true) as HTMLElement;
      clonedElement.style.width = '100%';
      clonedElement.style.height = '100%';
      clonedElement.style.margin = '0';
      clonedElement.style.padding = '0';
      clonedElement.style.backgroundColor = '#ffffff';

      // --- Profile image PDF enhancement ---
      const images = clonedElement.querySelectorAll('img.profile-image');
      images.forEach(img => {
        const image = img as HTMLImageElement;
        // Force a perfect circle and correct border for PDF rendering
        image.style.width = '125px';
        image.style.height = '125px';
        image.style.borderRadius = '50%';
        image.style.borderWidth = '2px';
        image.style.borderStyle = 'solid';
        image.style.borderColor = '#2563eb'; // Tailwind primary color fallback
        image.style.objectFit = 'cover';
        image.style.aspectRatio = '1/1';
        image.style.background = '#fff';
        image.style.boxSizing = 'border-box';
        image.style.display = 'block';
      });

      // --- Font size and scaling fix for PDF ---
      // Match the preview font size (16px) and line height
      clonedElement.style.fontSize = '16px';
      clonedElement.style.lineHeight = '1.5';
      // Also set for all children
      clonedElement.querySelectorAll('*').forEach(el => {
        (el as HTMLElement).style.fontSize = '';
        (el as HTMLElement).style.lineHeight = '';
      });

      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      // Use html2canvas at devicePixelRatio for best fidelity
      const canvas = await html2canvas(tempContainer, {
        scale: window.devicePixelRatio || 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4', true);

      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 7.5;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);

      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const scaleX = contentWidth / imgWidth;
      const scaleY = contentHeight / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const x = margin + (contentWidth - scaledWidth) / 2;
      const y = margin + (contentHeight - scaledHeight) / 2;

      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      pdf.save(`${cvData.personalInfo.fullName || 'CV'}.pdf`);

      toast({
        title: 'PDF Downloaded',
        description: 'Your CV has been downloaded as a PDF.',
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export CV as PDF. Please try again.',
        variant: 'destructive',
      });
    }
  }, [cvData, toast]);

  return downloadPDF;
}
