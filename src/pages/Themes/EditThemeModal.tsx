import React, {useState, useEffect} from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {useUpdateThemeMutation} from '@/features/themes/themeApi';
import {toast} from 'sonner';

interface EditThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: any;
}

export default function EditThemeModal({
  isOpen,
  onClose,
  theme,
}: EditThemeModalProps) {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [updateTheme, {isLoading}] = useUpdateThemeMutation();

  useEffect(() => {
    if (theme) {
      setName(theme.name || '');
      setFile(null); // Reset file on new selection
    }
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme) return;

    try {
      const formData = new FormData();
      if (name !== theme.name) {
        formData.append('name', name);
      }
      if (file) {
        formData.append('previewImage', file);
      }

      await updateTheme({id: theme.id, data: formData}).unwrap();
      toast.success('Theme updated successfully!');
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update theme');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Theme</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Theme Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kenzo Theme"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previewImage">Preview Image (Optional)</Label>
            <Input
              id="previewImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
