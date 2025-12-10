import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

export const formatDate = (date: string | Date | null | undefined, formatString = 'MMM d, yyyy'): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  return format(parsedDate, formatString);
};

export const formatDateTime = (date: string | Date | null | undefined): string => {
  return formatDate(date, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return 'Invalid Date';
  
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export const formatCurrency = (amount: number | null | undefined, currency = 'USD'): string => {
  if (amount === null || amount === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return 'N/A';
  
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};