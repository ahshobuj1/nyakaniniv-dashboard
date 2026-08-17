import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Instagram, Facebook, Linkedin } from 'lucide-react';
import { useCreateSocialMutation, useUpdateSocialMutation } from '@/features/landing-page/landingPageApi';
import { toast } from 'sonner';
import type { TLandingPageSocial } from '@/features/landing-page/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface SocialTabProps {
  socials: TLandingPageSocial[];
}

const STATIC_SOCIALS = [
  { name: 'Instagram', icon: Instagram },
  { name: 'Facebook', icon: Facebook },
  { name: 'Linkedin', icon: Linkedin },
];

export function SocialTab({ socials = [] }: SocialTabProps) {
  const [createSocial, { isLoading: isCreating }] = useCreateSocialMutation();
  const [updateSocial, { isLoading: isUpdating }] = useUpdateSocialMutation();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');

  const getSocialByPlatform = (platform: string) => {
    return socials.find(s => s.platform.toLowerCase() === platform.toLowerCase());
  };

  const openEdit = (platformName: string) => {
    const existing = getSocialByPlatform(platformName);
    setEditingPlatform(platformName);
    setEditUrl(existing?.url || '');
    setIsEditOpen(true);
  };

  const handleSave = async () => {
    if (!editingPlatform) return;
    const existing = getSocialByPlatform(editingPlatform);
    
    try {
      if (existing) {
        await updateSocial({
          id: existing.id,
          data: { url: editUrl, platform: editingPlatform }
        }).unwrap();
      } else {
        await createSocial({
          platform: editingPlatform,
          url: editUrl,
          icon: editingPlatform.toLowerCase(),
          isActive: true
        }).unwrap();
      }
      toast.success(`${editingPlatform} URL saved successfully!`);
      setIsEditOpen(false);
    } catch (error) {
      toast.error('Failed to save URL');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Footer Social Links</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STATIC_SOCIALS.map((social) => {
          const Icon = social.icon;
          const existing = getSocialByPlatform(social.name);
          return (
            <Card key={social.name} className="relative group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  {social.name}
                </CardTitle>
                <div className="flex gap-2">
                   <Button variant="ghost" size="icon" onClick={() => openEdit(social.name)}>
                     <Pencil className="h-4 w-4 text-blue-600" />
                   </Button>
                </div>
              </CardHeader>
              <CardContent>
                <a href={existing?.url || '#'} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline break-all">
                  {existing?.url || 'No URL configured'}
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingPlatform} Link</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>URL</Label>
              <Input 
                value={editUrl} 
                onChange={(e) => setEditUrl(e.target.value)} 
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isCreating || isUpdating}>
              {(isCreating || isUpdating) ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
