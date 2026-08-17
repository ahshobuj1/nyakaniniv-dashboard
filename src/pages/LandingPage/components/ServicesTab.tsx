import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } from '@/features/landing-page/landingPageApi';
import { toast } from 'sonner';
import type { TLandingPageService } from '@/features/landing-page/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ActionConfirmDialog } from '@/components/common/ActionConfirmDialog';

interface ServicesTabProps {
  services: TLandingPageService[];
}

export function ServicesTab({ services }: ServicesTabProps) {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [deleteService] = useDeleteServiceMutation();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TLandingPageService | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'delete' | 'restore';
    itemId: number | null;
    itemName: string;
  }>({ isOpen: false, action: 'delete', itemId: null, itemName: '' });

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    order: services.length + 1,
  });
  const [file, setFile] = useState<File | null>(null);

  const handleCreate = async () => {
    try {
      const formData = new FormData();
      formData.append('title', newItem.title);
      formData.append('description', newItem.description);
      formData.append('order', String(newItem.order));
      if (file) formData.append('image', file);

      await createService(formData).unwrap();
      toast.success('Service created successfully');
      setIsAddOpen(false);
      setNewItem({ title: '', description: '', order: services.length + 2 });
      setFile(null);
    } catch (error) {
      toast.error('Failed to create service');
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      const formData = new FormData();
      formData.append('title', editingItem.title);
      formData.append('description', editingItem.description || '');
      formData.append('order', String(editingItem.order));
      if (file) formData.append('image', file);

      await updateService({ id: editingItem.id, data: formData }).unwrap();
      toast.success('Service updated successfully');
      setIsEditOpen(false);
      setEditingItem(null);
      setFile(null);
    } catch (error) {
      toast.error('Failed to update service');
      console.error(error);
    }
  };

  const performRestoreDefault = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append('defaultImageUrl', 'null');
      await updateService({ id, data: formData }).unwrap();
      toast.success('Default icon restored successfully');
    } catch (error) {
      toast.error('Failed to restore icon');
    }
  };

  const performDelete = async (id: number) => {
    try {
      await deleteService(id).unwrap();
      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error('Failed to delete service');
      console.error(error);
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmDialog.itemId) return;
    if (confirmDialog.action === 'delete') {
      await performDelete(confirmDialog.itemId);
    } else {
      await performRestoreDefault(confirmDialog.itemId);
    }
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Services</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input type="number" value={newItem.order} onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>Image (Optional)</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title</Label>
                <Input value={editingItem.title} onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={editingItem.description || ''} onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input type="number" value={editingItem.order} onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="grid gap-2">
                <Label>Image</Label>
                <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((item) => (
          <Card key={item.id} className="relative group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className="flex gap-2">
                 <Button variant="ghost" size="sm" onClick={() => setConfirmDialog({ isOpen: true, action: 'restore', itemId: item.id, itemName: item.title })} className="text-xs mr-2">
                   Restore Default
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsEditOpen(true); }}>
                   <Pencil className="h-4 w-4 text-blue-600" />
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => setConfirmDialog({ isOpen: true, action: 'delete', itemId: item.id, itemName: item.title })}>
                   <Trash2 className="h-4 w-4 text-red-600" />
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionConfirmDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog((prev) => ({ ...prev, isOpen }))}
        title={confirmDialog.action === 'delete' ? 'Delete Service' : 'Restore Default Icon'}
        description={confirmDialog.action === 'delete' ? 'This action cannot be undone.' : 'This will remove the uploaded image and restore the default icon.'}
        actionName={confirmDialog.action}
        itemName={confirmDialog.itemName}
        onConfirm={executeConfirmAction}
      />
    </div>
  );
}
