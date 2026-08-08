import loginImage from '@/assets/photo_2025-12-13_06-28-16-removebg-preview.png';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {NavLink} from 'react-router';
import {useForgotPassword} from './UseForgotPassword';

export default function ForgotPassword() {
  const {register, handleSubmit, errors, isLoading, isSuccess, isError} =
    useForgotPassword();

  return (
    <section className="min-h-screen bg-primary/3 py-12 lg:py-20 flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
          {/* Left: Form */}
          <div className="space-y-10">
            <div className="space-y-4 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
                Forgot Password
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Enter your <span className="text-primary">email address</span>{' '}
                and we will send you a one-time password (OTP) to reset your
                password.
              </p>
            </div>

            <div>
              {/* Success/Error Messages */}
              {isSuccess && (
                <div className="mb-6 p-4 bg-background border rounded-lg">
                  <p className="text-chart-2 text-sm font-medium">
                    OTP sent! Redirecting to reset page...
                  </p>
                </div>
              )}
              {isError && (
                <div className="mb-6 p-4 bg-background border rounded-lg">
                  <p className="text-chart-1 text-sm font-medium">
                    Could not send OTP. Please try again.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <p className="text-sm text-chart-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-medium bg-primary hover:bg-primary/80 rounded-xl shadow-lg transition-all disabled:opacity-50 text-white">
                  {isLoading ? 'Sending...' : 'Send OTP'}
                </Button>

                <div className="text-center mt-4">
                  <NavLink
                    to="/login"
                    className="text-sm text-primary font-medium hover:underline">
                    Back to Log In
                  </NavLink>
                </div>
              </form>
            </div>
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
