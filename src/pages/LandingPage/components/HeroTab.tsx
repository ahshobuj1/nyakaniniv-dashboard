import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateHeroMutation, useUpdateHeroMutation } from '@/features/landing-page/landingPageApi';
import { toast } from 'sonner';
import type { TLandingPageHero } from '@/features/landing-page/types';
import { Label } from '@/components/ui/label';

interface HeroTabProps {
  hero: TLandingPageHero | null;
}

export function HeroTab({ hero }: HeroTabProps) {
  const [createHero, { isLoading: isCreating }] = useCreateHeroMutation();
  const [updateHero, { isLoading: isUpdating }] = useUpdateHeroMutation();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [file3, setFile3] = useState<File | null>(null);

  useEffect(() => {
    if (hero) {
      setTitle(hero.title || '');
      setDescription(hero.description || '');
    }
  }, [hero]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('isActive', 'true');
      if (file1) formData.append('image1', file1);
      if (file2) formData.append('image2', file2);
      if (file3) formData.append('image3', file3);

      if (hero && hero.id) {
        await updateHero({ id: hero.id, data: formData }).unwrap();
        toast.success('Hero updated successfully');
      } else {
        await createHero(formData).unwrap();
        toast.success('Hero created successfully');
      }
      setFile1(null);
      setFile2(null);
      setFile3(null);
    } catch (error) {
      toast.error('Failed to save Hero');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <div>
              <Label>Slide 1 Image</Label>
              <p className="text-[0.8rem] text-muted-foreground">Recommended size: 1920x820px (21:9 aspect ratio) for best quality.</p>
            </div>
            {(file1 || hero?.imageUrl1) && (
              <div className="w-full max-w-3xl aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden mb-2 border">
                <img 
                  src={file1 ? URL.createObjectURL(file1) : hero?.imageUrl1!} 
                  alt="Slide 1 Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <Input type="file" accept="image/*" onChange={(e) => setFile1(e.target.files?.[0] || null)} />
          </div>
          <div className="grid gap-2">
            <div>
              <Label>Slide 2 Image</Label>
              <p className="text-[0.8rem] text-muted-foreground">Recommended size: 1920x820px (21:9 aspect ratio) for best quality.</p>
            </div>
            {(file2 || hero?.imageUrl2) && (
              <div className="w-full max-w-3xl aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden mb-2 border">
                <img 
                  src={file2 ? URL.createObjectURL(file2) : hero?.imageUrl2!} 
                  alt="Slide 2 Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <Input type="file" accept="image/*" onChange={(e) => setFile2(e.target.files?.[0] || null)} />
          </div>
          <div className="grid gap-2">
            <div>
              <Label>Slide 3 Image</Label>
              <p className="text-[0.8rem] text-muted-foreground">Recommended size: 1920x820px (21:9 aspect ratio) for best quality.</p>
            </div>
            {(file3 || hero?.imageUrl3) && (
              <div className="w-full max-w-3xl aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden mb-2 border">
                <img 
                  src={file3 ? URL.createObjectURL(file3) : hero?.imageUrl3!} 
                  alt="Slide 3 Preview" 
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <Input type="file" accept="image/*" onChange={(e) => setFile3(e.target.files?.[0] || null)} />
          </div>
          <Button onClick={handleSave} disabled={isCreating || isUpdating} className="w-fit">
            {isCreating || isUpdating ? 'Saving...' : 'Save Hero'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
