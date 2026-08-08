import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {ActivitySquare, Key, MoreHorizontal, Trash} from 'lucide-react';
import {formatDate} from '@/utils/formatDate';
import toast from 'react-hot-toast';
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

import defaultAvatar from '@/assets/default-image.jpg';

import type {IUser} from './type';

const UserActionsCell = ({user}: {user: IUser}) => {
  const [updateStatus] = useUpdateUserStatusMutation();
  const [updateRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

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
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success('User deleted successfully');
    } catch (e: any) {
      toast.error(e?.data?.message || 'Failed to delete user');
    }
  };

  return (
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

        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={handleDelete}>
          <Trash className="mr-2 w-4 h-4" /> Delete User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
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
