import React, { useState } from "react";
import { Sparkles, Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("curator");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a valid curator handle.");
      return;
    }
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      onLoginSuccess(username === "curator" ? "AURA Curator" : username);
      setIsLoading(false);
    }, 850);
  };

  return (
    <div id="login-container" className="min-h-screen w-full flex flex-col md:flex-row bg-editorial-bg text-editorial-ink">
      {/* LEFT ASPECT SIDEBAR - Brand Vision Hanger Photo */}
      <div 
        id="login-visual-section" 
        className="relative w-full md:w-[42%] lg:w-[45%] h-[280px] md:h-auto overflow-hidden bg-editorial-ink flex flex-col justify-between p-8 md:p-12"
      >
        {/* Ambient Dark Ink Overlay */}
        <div className="absolute inset-0 bg-editorial-ink/40 mix-blend-multiply z-10"></div>
        
        {/* Background Hanger Image Hotlink */}
        <img 
          id="login-wardrobe-hero"
          referrerPolicy="no-referrer"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAfbUN9nmh20Yq8jaDMjxrqF9rKfLZEGWYv9F0NxzIv6J0h4EGwG3oEMp0lNAbNr6kVquuYRaSBRSrue9vz72H5reKeAS3hnZxgD4gyTveC4ZJFDYppM1fBumOPYo_w2G7YbmG02ZXekYO-JtF731IcuEogyLl6GtMmxkYaCWEzVJPTyj995fA9l57ZrJTwXsZGJY8-PIr1aNi0ST6W1WObVb60sHBiPwtD115P09xReAUCEOco2Dm2ZGH76O82w-8sJlRcPSTtFoE" 
          alt="Aura Wardrobe Sanctuary Wood Hanger" 
          className="absolute inset-0 w-full h-full object-cover opacity-85 scale-102 transition-transform duration-10000 ease-out hover:scale-105"
        />

        {/* Floating Brand Badge */}
        <div id="login-vision-badge" className="relative z-20 flex items-center gap-2 bg-editorial-bg/95 backdrop-blur-sm py-1.5 px-3 rounded-none border border-editorial-ink self-start">
          <Sparkles className="w-3.5 h-3.5 text-editorial-ink" />
          <span className="text-[10px] tracking-widest font-mono text-editorial-ink uppercase font-semibold">Warm Curator Space</span>
        </div>

        {/* Typographic Foundation */}
        <div id="login-vision-typography" className="relative z-20 mt-auto pt-24 text-editorial-paper">
          <span className="text-[11px] font-mono tracking-[0.25em] text-editorial-muted uppercase block">PREMIUM IDENTITY DESIGN</span>
          <h1 className="text-3xl lg:text-4xl font-serif font-medium tracking-tight text-editorial-paper mt-1.5 leading-tight">
            Aura Wardrobe
          </h1>
          <p className="text-xs text-editorial-paper/80 mt-2 max-w-sm leading-relaxed font-serif italic">
            An organic digital sanctuary for identity. Curate conscious minimalist clothing palettes, catalog your silhouettes, and converse with our styling counselor.
          </p>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Authenticate curator */}
      <div id="login-form-section" className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:p-16 lg:p-24 bg-editorial-bg">
        <div className="w-full max-w-[420px] bg-editorial-paper border border-editorial-ink/15 rounded-none p-8 shadow-none">
          <div id="login-form-heading" className="mb-8">
            <h2 className="text-2xl font-serif font-medium text-editorial-ink tracking-tight">
              Curator Log In
            </h2>
            <p className="text-xs text-editorial-muted mt-1.5 font-sans">
              Welcome back. Access your sensory visual identity closet.
            </p>
          </div>

          <form id="login-authentication-form" onSubmit={handleLoginSubmit} className="space-y-5">
            {error && (
              <div id="login-error-toast" className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-none flex items-center gap-2 font-mono">
                <span className="w-1.5 h-1.5 bg-red-500"></span>
                <span>{error}</span>
              </div>
            )}

            {/* Email curate handle input */}
            <div id="login-field-username" className="space-y-1.5">
              <label htmlFor="curator-username-input" className="block text-[11px] font-mono tracking-wider text-editorial-muted uppercase font-medium">
                Curator Handle / Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-editorial-muted">
                  <Mail className="w-4 h-4 text-editorial-muted/60" />
                </div>
                <input 
                  id="curator-username-input"
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-editorial-bg text-xs text-editorial-ink rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink transition-all font-sans"
                  placeholder="e.g. curator"
                />
              </div>
            </div>

            {/* Password input */}
            <div id="login-field-password" className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="curator-password-input" className="block text-[11px] font-mono tracking-wider text-editorial-muted uppercase font-medium">
                  Secured Keyphrase
                </label>
                <button 
                  id="login-forgot-pwd-btn"
                  type="button" 
                  className="text-[10px] font-mono text-editorial-ink hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-editorial-muted">
                  <Lock className="w-4 h-4 text-editorial-muted/60" />
                </div>
                <input 
                  id="curator-password-input"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-editorial-bg text-xs text-editorial-ink rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink transition-all font-sans"
                  placeholder="Secured password"
                />
                <button
                  id="login-toggle-visible-pwd"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-editorial-muted hover:text-editorial-ink transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Auto login checkbox */}
            <div id="login-field-options" className="flex items-center justify-between pt-1 font-sans">
              <label id="login-checkbox-remember-label" className="flex items-center gap-2 cursor-pointer group">
                <input 
                  id="login-remember-checkbox"
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-none border flex items-center justify-center transition-all ${rememberMe ? 'bg-editorial-ink border-editorial-ink' : 'border-editorial-ink/20 bg-editorial-bg'}`}>
                  {rememberMe && <CheckCircle className="w-3 h-3 text-editorial-paper fill-current" />}
                </div>
                <span className="text-[11px] text-editorial-muted select-none font-light">Auto-login for 30 cycles</span>
              </label>
            </div>

            {/* Authenticate Trigger */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink text-editorial-paper text-xs font-mono uppercase tracking-widest py-3 rounded-none border border-editorial-ink transition-all flex items-center justify-center gap-2 cursor-pointer font-medium"
            >
              {isLoading ? (
                <span className="w-4 h-4 rounded-full border-2 border-editorial-paper/20 border-t-editorial-paper animate-spin"></span>
              ) : (
                "Authenticate & Access"
              )}
            </button>
          </form>

          {/* Quick sandbox logins helpful label */}
          <div id="login-demo-accounts" className="mt-8 pt-6 border-t border-editorial-ink/10 text-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-editorial-muted">Developer Sandbox Environment</span>
            <div className="flex gap-2 justify-center mt-2.5">
              <span className="text-[9.5px] bg-editorial-bg border border-editorial-ink/10 px-2.5 py-1 rounded-none text-editorial-ink font-mono">Curator: curator</span>
              <span className="text-[9.5px] bg-editorial-bg border border-editorial-ink/10 px-2.5 py-1 rounded-none text-editorial-ink font-mono">Keyphrase: any</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
