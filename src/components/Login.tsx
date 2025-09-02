import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBudgetStore } from '@/store/budgetStore';
import { Lock, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useBudgetStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(password);
    
    if (!success) {
      setError('Geçersiz şifre. Deneyin: budget123');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 via-transparent to-accent/10" />
      
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md bg-card-elevated border-card-border shadow-card backdrop-blur-sm relative z-10 rounded-xl">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-7 h-7 bg-white rounded-lg opacity-90" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                LifeManagement
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Finansal yönetim platformunuza erişin
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="password" className="text-foreground font-medium">
                Şifre
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 h-12 bg-input border-input-border text-foreground rounded-lg"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="text-destructive text-sm bg-destructive-light p-4 rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium"
              disabled={isLoading || !password}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="text-center text-sm text-muted-foreground bg-muted p-4 rounded-lg border border-border">
            <span className="font-medium">Demo şifresi:</span> <code className="font-mono bg-muted-dark px-2 py-1 rounded text-foreground">budget123</code>
          </div>
        </div>
      </Card>
    </div>
  );
};