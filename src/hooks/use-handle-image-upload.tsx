import { useCallback, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import * as faceapi from 'face-api.js';

const validTypes = [
  'image/jpeg', 'image/png', 'image/jpg', 'image/jfif', 'image/pjpeg', 'image/pjp', 'image/gif', 'image/bmp', 'image/webp'
];
const validateImage = (file: File) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  return validTypes.includes(file.type) && file.size <= maxSize;
};

export function useHandleImageUpload(setCvData: (cb: any) => void) {
  const [loading, setLoading] = useState(false);

  const resizeAndCropImage = async (imageSrc: string): Promise<string> => {
    return new Promise(async (resolve) => {
      const img = new window.Image();
      img.onload = async () => {
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        let faceDetected = false;
        // --- Face detection (requires face-api.js) ---
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
          const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions());
          if (detections) {
            const { x, y, width, height } = detections.box;
            // Expand the crop to include the head and a bit more margin
            const margin = Math.max(width, height) * 0.7; // 70% margin around face
            sx = Math.max(0, x - margin / 2);
            sy = Math.max(0, y - margin / 2);
            sw = Math.min(img.width - sx, width + margin);
            sh = Math.min(img.height - sy, height + margin);
            faceDetected = true;
            console.log('Face detected. Cropping to face + head + extra margin:', { sx, sy, sw, sh });
          } else {
            console.log('No face detected. Using center crop.');
            // fallback to center crop
            if (sw !== sh) {
              if (sw > sh) {
                sx = (sw - sh) / 2; sw = sh;
              } else {
                sy = (sh - sw) / 2; sh = sw;
              }
            }
          }
        } catch (err) {
          console.log('Face detection error or model not loaded. Using center crop.', err);
          // fallback to center crop
          if (sw !== sh) {
            if (sw > sh) {
              sx = (sw - sh) / 2; sw = sh;
            } else {
              sy = (sh - sw) / 2; sh = sw;
            }
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = 125;
        canvas.height = 125;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, 125, 125);
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 125, 125);
          console.log('Image cropped and resized. Final crop:', { sx, sy, sw, sh, faceDetected });
          resolve(canvas.toDataURL('image/png'));
        } else {
          console.log('Canvas context not available. Returning original image.');
          resolve(imageSrc);
        }
      };
      img.src = imageSrc;
    });
  };

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateImage(file)) {
        toast({
          title: 'Invalid Image',
          description: 'Please upload an image (JPG, JPEG, PNG, JFIF, PJPEG, PJP, GIF, BMP, WEBP) under 2MB.',
          variant: 'destructive',
        });
        return;
      }
      setLoading(true);
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = e.target?.result as string;
        // Wait for the resized image before updating state
        const resized = await resizeAndCropImage(result);
        setCvData((prev: any) => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, profileImage: resized },
        }));
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  }, [setCvData]);

  // Spinner component for UI
  const Spinner = () => (
    loading ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 130 }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-4 text-primary">Processing image...</span>
      </div>
    ) : null
  );

  return { handleImageUpload, loading, Spinner };
}
