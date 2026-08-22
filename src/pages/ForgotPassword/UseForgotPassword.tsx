import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate} from 'react-router';
import { toast } from 'sonner';
import {forgotPasswordSchema, type ForgotPasswordFormData} from './type';
import {useForgotPasswordMutation} from '@/features/auth/authApi';

export const useForgotPassword = () => {
  const [forgotPassword, {isLoading, isSuccess, isError}] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormData) => {
    try {
      const res = await forgotPassword({email: values.email}).unwrap();
      console.log('Forgot password success:', res);
      
      toast.success('If an account exists, a reset OTP has been sent.');
      setTimeout(() => {
        navigate('/reset-password', {state: {email: values.email}});
      }, 1500);
    } catch (err: any) {
      const message = err?.data?.message || 'Request failed. Please try again.';
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
  };
};
