import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ActivitySquare, Key, MoreHorizontal, Trash} from 'lucide-react';
import {formatDate} from '@/utils/formatDate';
import { toast } from 'sonner';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from '@/features/users/userApi';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import defaultAvatar from '@/assets/default-image.jpg';

import type {IUser} from './type';

const UserActionsCell = ({user}: {user: IUser}) => {
  const [updateStatus] = useUpdateUserStatusMutation();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteInput, setDeleteInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleVerifyToggle = async () => {
    try {
      await updateStatus({id: user.id, isVerified: !user.isVerified}).unwrap();
      toast.success(
        !user.isVerified ? 'User verified!' : 'User unverified!'
      );
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update status');
    }
  };

  const handleRoleToggle = async () => {
    const newRole = user.role === 'SUPER_ADMIN' ? 'DJ' : 'SUPER_ADMIN';
    try {
      await updateRole({id: user.id, role: newRole}).unwrap();
      toast.success(`User is now a ${newRole}`);
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to update role');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      toast.success('User deleted successfully');
      setIsOpen(false);
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setDeleteInput(''); // reset on close
    }}>
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="py-3">
        {/* Verification Status */}
        {user.isVerified ? (
          <DropdownMenuItem
            className="text-yellow-600 cursor-pointer"
            onClick={handleVerifyToggle}>
            <Key className="mr-2" /> Unverify
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-green-600 cursor-pointer"
            onClick={handleVerifyToggle}>
            <ActivitySquare className="mr-2" /> Verify
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Role Change */}
        {user.role === 'SUPER_ADMIN' ? (
          <DropdownMenuItem
            className="text-blue-600 cursor-pointer"
            onClick={handleRoleToggle}>
            <ActivitySquare className="mr-2" /> Make DJ
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-purple-600 cursor-pointer"
            onClick={handleRoleToggle}>
            <ActivitySquare className="mr-2" /> Make Super Admin
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-destructive cursor-pointer"
            onSelect={(e) => e.preventDefault()}>
            <Trash className="mr-2 w-4 h-4" /> Delete User
          </DropdownMenuItem>
        </AlertDialogTrigger>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription className="space-y-4">
          <p>
            This action cannot be undone. This will permanently delete the user <span className="font-semibold text-foreground">"{user.firstName} {user.lastName}"</span>.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Please type <span className="font-bold text-destructive">delete</span> to confirm.
            </p>
            <Input 
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              placeholder="Type delete here..."
              className="w-full"
            />
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction 
          onClick={(e) => {
            e.preventDefault();
            if (deleteInput.toLowerCase() === 'delete') {
              handleDelete();
            }
          }} 
          disabled={deleteInput.toLowerCase() !== 'delete'}
          className="bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed">
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  );
};

export const columns: ColumnDef<IUser>[] = [
  //  User (Name + Email)
  {
    header: 'User',
    cell: ({row}) => {
      const user = row.original;
      const avatarSrc = user.profileImg || defaultAvatar;
      const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown';

      return (
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src={avatarSrc}
            alt={displayName}
            className="h-10 w-10 rounded-full object-cover border"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />

          {/* Name & Email */}
          <div className="flex flex-col">
            <span className="font-medium leading-none">{displayName}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },

  //  Role
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({row}) => {
      const role = row.original.role;

      const roleColor: Record<typeof role, string> = {
        SUPER_ADMIN: 'bg-purple-600',
        DJ: 'bg-blue-600',
      };

      return <Badge className={`${roleColor[role]} text-white`}>{role}</Badge>;
    },
  },

  //  Status
  {
    accessorKey: 'isVerified',
    header: 'Status',
    cell: ({row}) => {
      const isVerified = row.original.isVerified;

      return isVerified ? (
        <Badge className="bg-green-600 text-white">Verified</Badge>
      ) : (
        <Badge variant="outline">Unverified</Badge>
      );
    },
  },

  //  Joined
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({row}) => formatDate(row.original.createdAt),
  },

  //  Actions
  {
    id: 'actions',
    header: 'Actions',
    cell: ({row}) => <UserActionsCell user={row.original} />,
  },
];
