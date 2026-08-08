import loginImage from '@/assets/photo_2025-12-13_06-28-16-removebg-preview.png';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Eye, EyeOff} from 'lucide-react';
import {useResetPassword} from './UseResetPassword';

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    showPassword,
    togglePasswordVisibility,
    showConfirmPassword,
    toggleConfirmPasswordVisibility,
  } = useResetPassword();

  return (
    <section className="min-h-screen bg-primary/10 py-12 lg:py-20 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
          {/* Left: Form */}
          <div className="space-y-10">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Reset Password
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Enter your <span className="text-primary">email</span>, the{' '}
                <span className="text-primary">OTP</span> sent to you, and your
                new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email..."
                  className="h-14 text-base rounded-xl border-border focus:border-primary"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-chart-1">{errors.email.message}</p>
                )}
              </div>

              {/* OTP */}
              <div className="space-y-2">
                <Label htmlFor="otp">OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP (e.g. 123456)..."
                  className="h-14 text-base rounded-xl border-border focus:border-primary"
                  {...register('otp')}
                />
                {errors.otp && (
                  <p className="text-sm text-chart-1">{errors.otp.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your new password..."
                    className="h-14 text-base rounded-xl pr-12"
                    {...register('newPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={togglePasswordVisibility}>
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-chart-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your new password..."
                    className="h-14 text-base rounded-xl pr-12"
                    {...register('confirmPassword')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={toggleConfirmPasswordVisibility}>
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-chart-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/80 rounded-xl shadow-lg transition-all disabled:opacity-50 text-white">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex justify-center">
            <img
              src={loginImage}
              alt="Team working together"
              width={650}
              height={650}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
