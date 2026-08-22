import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate, useLocation} from 'react-router';
import { toast } from 'sonner';
import {resetPasswordSchema, type ResetPasswordFormData} from './type';
import {useResetPasswordMutation} from '@/features/auth/authApi';

export const useResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPassword, {isLoading, isSuccess, isError}] = useResetPasswordMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: location.state?.email || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const onSubmit = async (values: ResetPasswordFormData) => {
    try {
      const res = await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword,
      }).unwrap();
      
      console.log('Reset password success:', res);
      toast.success('Password has been reset successfully! Redirecting...');
      
      setTimeout(() => {
        navigate('/login', {replace: true});
      }, 1500);
    } catch (err: any) {
      const message = err?.data?.message || 'Failed to reset password. Please try again.';
      toast.error(message);
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess,
    isError,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
  };
};
