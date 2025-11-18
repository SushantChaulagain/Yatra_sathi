import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, Mountain } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Get the hash from URL (Supabase sends confirmation in hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');

        if (type === 'signup' && accessToken) {
          // Email confirmed successfully
          const { data: { user }, error } = await supabase.auth.getUser(accessToken);

          if (error) throw error;

          if (user) {
            setStatus('success');
            setMessage('Email verified successfully! Redirecting...');

            // Wait 2 seconds to show success message, then close tab
            setTimeout(() => {
              // Try to close the tab (only works if opened via window.open)
              window.close();

              // If window.close() doesn't work (user opened link manually), redirect
              setTimeout(() => {
                navigate('/');
              }, 500);
            }, 2000);
          }
        } else {
          // No valid confirmation found
          setStatus('error');
          setMessage('Invalid confirmation link. Please try again.');
          setTimeout(() => navigate('/auth'), 3000);
        }
      } catch (error: any) {
        console.error('Email confirmation error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. Please try again.');
        setTimeout(() => navigate('/auth'), 3000);
      }
    };

    handleEmailConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Same beautiful background as Auth page */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--mountain-shadow))] via-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--mountain-purple))]" />

      {/* Animated starfield */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[15%] w-1 h-1 bg-white/60 rounded-full animate-pulse" />
        <div className="absolute top-[20%] right-[20%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-[30%] left-[30%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-md p-6 relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[hsl(var(--himalayan-deep-blue))] to-[hsl(var(--forest-green))] rounded-2xl flex items-center justify-center shadow-2xl">
            <Mountain className="h-8 w-8 text-white" />
          </div>
          <span className="text-4xl font-extrabold tracking-tight">
            <span className="text-white">Yatra</span>
            <span className="bg-gradient-to-r from-[hsl(var(--golden-amber))] to-[hsl(var(--terracotta))] bg-clip-text text-transparent"> Sathi</span>
          </span>
        </div>

        <Card className="border-2 border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {status === 'loading' && (
                <Loader2 className="h-16 w-16 text-[hsl(var(--himalayan-deep-blue))] animate-spin" />
              )}
              {status === 'success' && (
                <CheckCircle2 className="h-16 w-16 text-green-600 animate-bounce" />
              )}
              {status === 'error' && (
                <XCircle className="h-16 w-16 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Verifying Email'}
              {status === 'success' && 'Email Verified!'}
              {status === 'error' && 'Verification Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">{message}</p>
            {status === 'success' && (
              <p className="text-sm text-muted-foreground">
                This tab will close automatically...
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-muted-foreground">
                Redirecting to login page...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthCallback;
