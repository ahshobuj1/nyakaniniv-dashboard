import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateLandingPageSettingsMutation } from '@/features/landing-page/landingPageApi';
import type { TLandingPageSetting } from '@/features/landing-page/types';
import { toast } from 'sonner';
import {  Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';

interface BrandingTabProps {
  settings: TLandingPageSetting | null;
}

export function BrandingTab({ settings }: BrandingTabProps) {
  const [updateSettings, { isLoading }] = useUpdateLandingPageSettingsMutation();

  const [siteName, setSiteName] = useState('UpBeat Africa');
  const [headerLogoFile, setHeaderLogoFile] = useState<File | null>(null);
  const [footerLogoFile, setFooterLogoFile] = useState<File | null>(null);

  useEffect(() => {
    if (settings) {
      if (settings.siteName) setSiteName(settings.siteName);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('siteName', siteName);
      if (headerLogoFile) {
        formData.append('headerLogo', headerLogoFile);
      }
      if (footerLogoFile) {
        formData.append('footerLogo', footerLogoFile);
      }

      await updateSettings(formData).unwrap();
      toast.success('Branding & Logos updated successfully!');
      setHeaderLogoFile(null);
      setFooterLogoFile(null);
    } catch (error: any) {
      console.error('Failed to save branding:', error);
      toast.error(error?.data?.message || 'Failed to update branding settings');
    }
  };

  const headerPreview = headerLogoFile
    ? URL.createObjectURL(headerLogoFile)
    : settings?.headerLogoUrl || '/home/upbeat.png';

  const footerPreview = footerLogoFile
    ? URL.createObjectURL(footerLogoFile)
    : settings?.footerLogoUrl || '/home/footer-logo.png';

  return (
    <div className="space-y-6">
      <Card className="shadow-sm border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Website Branding & Logos
              </CardTitle>
              <CardDescription className="mt-1">
                Upload and manage high-resolution logos for the main website header and footer.
              </CardDescription>
            </div>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
     

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* 1. Header / Navbar Logo */}
            <div className="space-y-4 p-5 rounded-2xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Navbar / Header Logo
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Used on the top navigation bar of the landing and pricing pages.
                  </p>
                </div>
              </div>

              {/* Preview Box - Light Background */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center min-h-[140px]">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Header Live Preview (Light Theme)
                </p>
                <div className="p-3 bg-[#f0f0f0] rounded-lg w-full flex items-center justify-center">
                  <img
                    src={headerPreview}
                    alt="Header Logo Preview"
                    className="h-10 max-w-[240px] w-auto object-contain"
                  />
                </div>
              </div>

              {/* Specs & Upload Input */}
              <div className="space-y-3">
                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[12px] text-blue-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-blue-950">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    Recommended Specifications:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-blue-900 text-[11.5px] pl-0.5">
                    <li><strong>Format:</strong> SVG (Best) or Transparent PNG</li>
                    <li><strong>Dimensions:</strong> ~180 × 50 px to 240 × 60 px (4:1 Aspect Ratio)</li>
                    <li><strong>Background:</strong> Clean transparent background with no extra padding</li>
                  </ul>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Upload New Header Logo
                  </Label>
                  <Input
                    type="file"
                    accept="image/png, image/svg+xml, image/webp"
                    onChange={(e) => setHeaderLogoFile(e.target.files?.[0] || null)}
                    className="cursor-pointer bg-white file:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* 2. Footer Logo */}
            <div className="space-y-4 p-5 rounded-2xl border border-gray-200 bg-gray-50/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-600" />
                    Footer Logo / Icon
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Used on the dark website footer and brand representations.
                  </p>
                </div>
              </div>

              {/* Preview Box - Dark Background */}
              <div className="p-4 rounded-xl border border-dashed border-gray-300 bg-white flex flex-col items-center justify-center min-h-[140px]">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Footer Live Preview (Dark Theme)
                </p>
                <div className="p-3 bg-[#111620] rounded-lg w-full flex items-center justify-center">
                  <img
                    src={footerPreview}
                    alt="Footer Logo Preview"
                    className="h-14 max-w-[180px] w-auto object-contain"
                  />
                </div>
              </div>

              {/* Specs & Upload Input */}
              <div className="space-y-3">
                <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-[12px] text-purple-950 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-purple-950">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                    Recommended Specifications:
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-purple-900 text-[11.5px] pl-0.5">
                    <li><strong>Format:</strong> SVG (Best) or Transparent PNG</li>
                    <li><strong>Dimensions:</strong> ~150 × 150 px to 200 × 200 px (1:1 Aspect Ratio)</li>
                    <li><strong>Visibility:</strong> Optimized for dark background (#111620)</li>
                  </ul>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-gray-700 block mb-1.5">
                    Upload New Footer Logo
                  </Label>
                  <Input
                    type="file"
                    accept="image/png, image/svg+xml, image/webp"
                    onChange={(e) => setFooterLogoFile(e.target.files?.[0] || null)}
                    className="cursor-pointer bg-white file:cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

