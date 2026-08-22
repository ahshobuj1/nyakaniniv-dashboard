/* eslint-disable @typescript-eslint/no-explicit-any */

import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router';
import { toast } from 'sonner';
import {loginFormSchema, type LoginFormData} from './type';
import {useLoginMutation} from '@/features/auth/authApi';
import {UserRole} from '@/types/role';

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [login, {isLoading}] = useLoginMutation();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
    setValue,
    trigger,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange', // better UX: validate on onChange
    defaultValues: {
      email: 'ahshobuj11@gmail.com',
      password: 'ahshobuj11@gmail.comA',
      // terms: true, // pre-checked
    },
  });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const termsValue = watch('terms');

  const onSubmit = async (values: LoginFormData) => {
    setLoginSuccess(false);
    setLoginError(null);
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      console.log('Login success:', res);

      const userRole = res?.data?.user?.role;

      // Check role here — only SUPER_ADMIN or ADMIN are allowed in this dashboard
      if (!([UserRole.SUPER_ADMIN, UserRole.ADMIN] as string[]).includes(userRole)) {
        throw new Error('Access denied: You do not have permission to access the admin dashboard.');
      }

      if (res.success) {
        setLoginSuccess(true);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard', {replace: true});
        }, 500);
      }
    } catch (err: any) {
      const message =
        err?.message === 'Access denied: You do not have permission to access the admin dashboard.'
          ? err.message
          : err?.data?.message || err?.message || 'Login failed. Please check your credentials and try again.';
      
      setLoginError(message);
      toast.error(message);
    }
  };

  // Helper to safely update terms + trigger validation
  const handleTermsChange = (checked: boolean) => {
    setValue('terms', checked, {shouldValidate: true});
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isLoading,
    isSuccess: loginSuccess,
    isError: !!loginError,
    errorMessage: loginError,
    showPassword,
    togglePasswordVisibility,
    setValue, // Now available!
    trigger, // For manual validation
    terms: termsValue, // Current value of checkbox
    handleTermsChange, // Recommended way to handle checkbox
  };
};
