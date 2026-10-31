import {Calendar, CreditCard, Headphones, Disc, Bell} from 'lucide-react';
import type {TNotification} from '@/features/notifications/type';

export interface NotificationMeta {
  category: 'Payment' | 'Support' | 'Tenant' | 'Booking' | 'System';
  icon: typeof Bell;
  iconBg: string;
  iconColor: string;
  pillBadge: string;
  targetUrl: string;
}

export function getNotificationMeta(notification: TNotification): NotificationMeta {
  const type = notification.type;
  const title = (notification.title || '').toLowerCase();
  const message = (notification.message || '').toLowerCase();

  // 1. Subscription / Payment
  if (
    type === 'payment' ||
    title.includes('payment') ||
    title.includes('subscription') ||
    message.includes('payment') ||
    message.includes('subscribed') ||
    message.includes('invoice')
  ) {
    return {
      category: 'Payment',
      icon: CreditCard,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      pillBadge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
      targetUrl: notification.referenceId
        ? `/dashboard/transactions/${notification.referenceId}`
        : '/dashboard/transactions',
    };
  }

  // 2. Support Ticket
  if (
    title.includes('ticket') ||
    title.includes('support') ||
    message.includes('ticket') ||
    message.includes('support')
  ) {
    return {
      category: 'Support',
      icon: Headphones,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60',
      iconColor: 'text-amber-600 dark:text-amber-400',
      pillBadge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
      targetUrl: '/dashboard/support-tickets',
    };
  }

  // 3. DJ / Tenant Profile
  if (
    title.includes('tenant') ||
    title.includes('dj profile') ||
    title.includes('dj registered') ||
    message.includes('registered a new dj profile') ||
    message.includes('.deejay.africa')
  ) {
    return {
      category: 'Tenant',
      icon: Disc,
      iconBg: 'bg-purple-50 dark:bg-purple-950/60',
      iconColor: 'text-purple-600 dark:text-purple-400',
      pillBadge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
      targetUrl: '/dashboard/tenants',
    };
  }

  // 4. Booking
  if (
    type === 'booking_request' ||
    title.includes('booking') ||
    message.includes('booking') ||
    message.includes('booked')
  ) {
    return {
      category: 'Booking',
      icon: Calendar,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60',
      iconColor: 'text-blue-600 dark:text-blue-400',
      pillBadge: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
      targetUrl: notification.referenceId
        ? `/dashboard/bookings/${notification.referenceId}`
        : '/dashboard/bookings',
    };
  }

  return {
    category: 'System',
    icon: Bell,
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-400',
    pillBadge: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20',
    targetUrl: '/dashboard',
  };
}
