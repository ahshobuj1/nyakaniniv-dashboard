import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useCreateFaqMutation, useUpdateFaqMutation, useDeleteFaqMutation } from '@/features/landing-page/landingPageApi';
import { toast } from 'sonner';
import type { TLandingPageFaq } from '@/features/landing-page/types';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ActionConfirmDialog } from '@/components/common/ActionConfirmDialog';

interface FaqsTabProps {
  faqs: TLandingPageFaq[];
}

export function FaqsTab({ faqs }: FaqsTabProps) {
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq] = useDeleteFaqMutation();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TLandingPageFaq | null>(null);
  
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    itemId: number | null;
  }>({ isOpen: false, itemId: null });

  const [newItem, setNewItem] = useState({
    question: '',
    answer: '',
    order: faqs.length + 1,
  });

  const handleCreate = async () => {
    try {
      await createFaq(newItem).unwrap();
      toast.success('FAQ created successfully');
      setIsAddOpen(false);
      setNewItem({ question: '', answer: '', order: faqs.length + 2 });
    } catch (error) {
      toast.error('Failed to create FAQ');
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    try {
      await updateFaq({ id: editingItem.id, data: {
        question: editingItem.question,
        answer: editingItem.answer,
        order: editingItem.order,
      } }).unwrap();
      toast.success('FAQ updated successfully');
      setIsEditOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error('Failed to update FAQ');
      console.error(error);
    }
  };

  const performDelete = async (id: number) => {
    try {
      await deleteFaq(id).unwrap();
      toast.success('FAQ deleted successfully');
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error(error);
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmDialog.itemId) return;
    await performDelete(confirmDialog.itemId);
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage FAQs</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Add FAQ</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New FAQ</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Question</Label>
                <Input value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Answer</Label>
                <Textarea value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input type="number" value={newItem.order} onChange={(e) => setNewItem({ ...newItem, order: parseInt(e.target.value) || 0 })} />
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
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Question</Label>
                <Input value={editingItem.question} onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Answer</Label>
                <Textarea value={editingItem.answer} onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label>Order</Label>
                <Input type="number" value={editingItem.order} onChange={(e) => setEditingItem({ ...editingItem, order: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>{isUpdating ? 'Updating...' : 'Update'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-4">
        {faqs.map((item) => (
          <Card key={item.id} className="relative group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{item.question}</CardTitle>
              <div className="flex gap-2">
                 <Button variant="ghost" size="icon" onClick={() => { setEditingItem(item); setIsEditOpen(true); }}>
                   <Pencil className="h-4 h-4 text-blue-600" />
                 </Button>
                 <Button variant="ghost" size="icon" onClick={() => setConfirmDialog({ isOpen: true, itemId: item.id })}>
                   <Trash2 className="h-4 h-4 text-red-600" />
                 </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <ActionConfirmDialog
        isOpen={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog((prev) => ({ ...prev, isOpen }))}
        title="Delete FAQ"
        description="This action cannot be undone."
        actionName="delete"
        itemName="FAQ"
        onConfirm={executeConfirmAction}
      />
    </div>
  );
}
