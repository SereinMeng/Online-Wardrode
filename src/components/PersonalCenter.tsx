import React, { useState } from "react";
import { User, Shield, Lock, Smartphone, Database, CheckCircle, RefreshCcw, Bell, Eye, EyeOff } from "lucide-react";

interface PersonalCenterProps {
  curatorName: string;
  onUpdateName: (name: string) => void;
}

export default function PersonalCenter({ curatorName, onUpdateName }: PersonalCenterProps) {
  const [name, setName] = useState(curatorName);
  const [email, setEmail] = useState("admin@aurawardrobe.com");
  const [registerDate, setRegisterDate] = useState("2026-04-10");
  const [isSaved, setIsSaved] = useState(false);
  
  // Security Form States
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [showPwdFields, setShowPwdFields] = useState(false);
  const [pwdFeedback, setPwdFeedback] = useState("");

  // Two step Authentication State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateName(name);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPwd || !newPwd) {
      setPwdFeedback("Please input original keyphrase and new keyphrase.");
      return;
    }
    setPwdFeedback("SUCCESS: Security phrase updated successfully inside ward!");
    setCurrentPwd("");
    setNewPwd("");
    setTimeout(() => {
      setPwdFeedback("");
      setShowPwdFields(false);
    }, 3000);
  };

  return (
    <div id="personal-center-viewport" className="space-y-6 font-sans">
      
      {/* Visual Identity Profile Banner */}
      <div 
        id="pc-identity-banner" 
        className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-none"
      >
        {/* Profile Avatar Hotlink - Sharp corners */}
        <div id="pc-image-container" className="relative group">
          <div className="w-24 h-24 rounded-none overflow-hidden border border-editorial-ink bg-editorial-bg">
            <img 
              referrerPolicy="no-referrer"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAEoHSzx-U9nM8P9uvLH5HwHQUy8t1nnQ4dfCWAeyiocAs7kTgzy7OOMxfoYjSl3itATgFz--cpfzSAEL9mlKOboxHL4SFqRBOR2kfeSz4gCZeN2W5D6eP_5G3PgDvPLZokC-PBWWrHw3XruH4CVy-XJhCaaHreTH1yMA1xpOdltQsR1D_ROyRkXnevIOU0E82FxlxVq3aoomZgz8SSW98KMx6GGXywdy-7J_cSC56LJOVlctUeNr8RaG_wI9_cj-KY_XSMj71TA8" 
              alt="Curator Professional Portrait" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="absolute bottom-[-4px] right-[-4px] w-6 h-6 rounded-none bg-editorial-ink border border-editorial-paper flex items-center justify-center text-editorial-paper text-[10px] font-mono">1</span>
        </div>

        {/* Banner Quick info */}
        <div className="text-center md:text-left flex-1 space-y-1">
          <span className="bg-editorial-ink/10 text-editorial-ink font-mono text-[9px] uppercase px-2.5 py-0.5 rounded-none tracking-widest inline-block">SYSTEM PRINCIPAL</span>
          <h3 id="pc-display-name" className="text-xl md:text-2xl font-serif font-medium text-editorial-ink tracking-tight">
            {curatorName}
          </h3>
          <p className="text-xs text-editorial-muted font-sans font-light max-w-md leading-relaxed">
            Registered aesthetic identity warden. Managing 8 active premium items on Cloud container host.
          </p>
        </div>

        {/* Visual hotlink side support photo */}
        <div id="pc-side-photo-container" className="hidden lg:block w-36 h-20 rounded-none border border-editorial-ink/15 bg-editorial-bg opacity-80 hover:opacity-100 transition-opacity">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiS2QVU4SHQHDU8JYtnSC40ogHqqGr3RWz_DXTWiBNdTqnvKC7FAOJFkmaRw_JUsBpGTaPMQYQaMZnHcvS9y7cO9FNwrZYNwoKWaFat_zWdaAWCEhMl739hnwuiRDo5NFKL90Y4iwMeSkfRjJJN827N_huBCx48UzdDDoFiqdmgAcBqTEv4RDrmYCIa9iO-kzv08nocXSwfBDrs5Y6_CTjO1uz5db5uTbeP4wbHuMZYGPQpFyNOT2W-VvnmciMBLxIRdJnXhrxxnM" 
            alt="Warden side view closet details" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Grid of Profile Metadata and Security Controls */}
      <div id="pc-sections-grid" className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Profile Card Fields edit form */}
        <div id="pc-core-profile-card" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 shadow-none md:col-span-7 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-editorial-ink/10">
            <User className="w-4 h-4 text-editorial-ink" />
            <h4 className="text-xs font-mono tracking-widest text-editorial-ink uppercase">IDENTITY PROFILE MANAGEMENT</h4>
          </div>

          <form id="pc-profile-form" onSubmit={handleProfileSave} className="space-y-4">
            {isSaved && (
              <div id="pc-profile-success" className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-none flex items-center gap-2 font-mono">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Profile info synchronized successfully inside local node.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="pc-field-name" className="space-y-1.5">
                <label htmlFor="curator-name-field" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase">Registered Curator Name</label>
                <input 
                  id="curator-name-field"
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                />
              </div>

              <div id="pc-field-email" className="space-y-1.5">
                <label htmlFor="curator-email-field" className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase">Warden Secure Email</label>
                <input 
                  id="curator-email-field"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-editorial-bg text-xs text-editorial-ink px-3.5 py-2.5 rounded-none border border-editorial-ink/15 focus:outline-none focus:border-editorial-ink"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="pc-field-role" className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase">Security Role</label>
                <div className="bg-editorial-bg text-xs text-editorial-muted px-3.5 py-2.5 rounded-none border border-editorial-ink/10 select-none font-light">
                  Aura Sanctuary Master
                </div>
              </div>

              <div id="pc-field-registered" className="space-y-1.5">
                <label className="block text-[10px] font-mono tracking-wider text-editorial-muted uppercase">Verification Date</label>
                <div className="bg-editorial-bg text-xs text-editorial-muted px-3.5 py-2.5 rounded-none border border-editorial-ink/10 select-none font-light">
                  {registerDate} (Matured node)
                </div>
              </div>
            </div>

            <button
              id="pc-profile-submit"
              type="submit"
              className="px-5 py-2.5 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-[11px] font-mono uppercase tracking-widest rounded-none transition-all cursor-pointer font-medium"
            >
              Update Credentials
            </button>
          </form>
        </div>

        {/* Security Controls Side Card */}
        <div id="pc-security-controls" className="bg-editorial-paper border border-editorial-ink/15 rounded-none p-6 shadow-none md:col-span-5 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-editorial-ink/10">
            <Shield className="w-4 h-4 text-editorial-ink" />
            <h4 className="text-xs font-mono tracking-widest text-editorial-ink uppercase">SECURITY CENTRE & SECRETS</h4>
          </div>

          <div id="pc-security-actions" className="space-y-4 font-mono">
            
            {/* Action 1: Change Password toggle with form */}
            <div id="pc-action-pwd" className="border border-editorial-ink/10 rounded-none p-4 transition-all">
              <button 
                id="pc-change-pwd-toggle-btn"
                onClick={() => setShowPwdFields(!showPwdFields)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-none bg-editorial-ink/5 flex items-center justify-center text-editorial-ink">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-serif font-medium text-editorial-ink block group-hover:text-editorial-muted transition-colors">Change access phrase</span>
                    <span className="text-[10px] text-editorial-muted font-sans font-light">Update local password key.</span>
                  </div>
                </div>
                <span className="text-xs font-mono text-editorial-ink">{showPwdFields ? "Collapse" : "Expand"}</span>
              </button>

              {showPwdFields && (
                <form id="pc-pwd-form" onSubmit={handlePasswordChange} className="mt-4 pt-4 border-t border-editorial-ink/10 space-y-3">
                  {pwdFeedback && (
                    <p id="pc-pwd-toast" className={`text-[10.5px] font-mono ${pwdFeedback.includes("SUCCESS") ? "text-emerald-700" : "text-red-600"}`}>
                      {pwdFeedback}
                    </p>
                  )}
                  <input 
                    id="pc-pwd-current-input"
                    type="password" 
                    placeholder="Original keyphrase" 
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2 rounded-none border border-editorial-ink/15 focus:outline-none"
                  />
                  <input 
                    id="pc-pwd-new-input"
                    type="password" 
                    placeholder="New secure keyphrase" 
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    className="w-full bg-editorial-bg text-xs text-editorial-ink px-3 py-2 rounded-none border border-editorial-ink/15 focus:outline-none"
                  />
                  <button 
                    id="pc-pwd-submit-btn"
                    type="submit" 
                    className="w-full py-2 bg-editorial-ink hover:bg-transparent hover:text-editorial-ink border border-editorial-ink text-editorial-paper text-[10px] font-mono uppercase tracking-widest rounded-none transition-colors cursor-pointer"
                  >
                    Commit Secure Change
                  </button>
                </form>
              )}
            </div>

            {/* Action 2: Multi factor authentication trigger */}
            <div id="pc-action-mfa" className="border border-editorial-ink/10 rounded-none p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-editorial-ink/5 flex items-center justify-center text-editorial-ink">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif font-medium text-editorial-ink block">Dual factor credentials</span>
                  <span className="text-[10px] text-editorial-muted font-sans font-light">Require phone confirm keys.</span>
                </div>
              </div>
              <button
                id="pc-mfa-toggle-btn"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-10 h-5 border border-editorial-ink p-0.5 rounded-none flex items-center transition-all ${twoFactorEnabled ? 'bg-editorial-ink justify-end' : 'bg-transparent justify-start'}`}
              >
                <div className="w-3.5 h-3.5 bg-editorial-ink group-hover:bg-editorial-muted border border-editorial-paper"></div>
              </button>
            </div>

            {/* Action 3: Global session state */}
            <div id="pc-action-logs" className="border border-editorial-ink/10 rounded-none p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-none bg-editorial-ink/5 flex items-center justify-center text-editorial-ink">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-serif font-medium text-editorial-ink block">Browse device sessions</span>
                  <span className="text-[10px] text-editorial-muted font-sans font-light">Inspect unauthorized access.</span>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-editorial-ink text-[9.5px] text-editorial-paper font-mono rounded-none">All Secure</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
