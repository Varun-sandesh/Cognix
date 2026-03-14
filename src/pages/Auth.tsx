import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, GraduationCap, Eye, EyeOff, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: college, 2: credentials
  const [collegeName, setCollegeName] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (!collegeName.trim()) {
      toast.error("Please enter your college name");
      return;
    }
    if (isSignUp && !fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim() || !password.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const fakeEmail = email || `${rollNumber.toLowerCase().replace(/\s/g, "")}@${collegeName.toLowerCase().replace(/\s/g, "")}.edu`;
      if (isSignUp) {
        await signUp(fakeEmail, password, { full_name: fullName, college_name: collegeName, roll_number: rollNumber });
        toast.success("Account created! Welcome to Cognix 🎉");
      } else {
        await signIn(fakeEmail, password);
        toast.success("Welcome back! 👋");
      }
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 max-w-md px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary glow-primary">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="font-display text-3xl font-bold text-foreground">Cognix</h1>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Campus Intelligence</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Your universal campus intelligence platform. Bridging the gap between 
            <span className="text-primary font-medium"> students</span> and 
            <span className="text-accent font-medium"> faculty</span>.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "AI Chatbot", val: "24/7" },
              { label: "Staff Data", val: "100%" },
              { label: "Live Doubts", val: "Real-time" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-3 text-center">
                <p className="font-display text-lg font-bold text-primary">{s.val}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">Cognix</span>
          </div>

          <div className="glass-card p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isSignUp ? "Join your campus community" : "Sign in to continue"}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-primary" : "bg-secondary"}`} />
              <div className={`h-1 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      <GraduationCap className="inline h-3.5 w-3.5 mr-1" />
                      College / University Name
                    </label>
                    <input
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g., Indian Institute of Technology Delhi"
                      className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                    />
                  </div>

                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                      />
                    </motion.div>
                  )}

                  <button
                    onClick={handleNext}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity glow-primary"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    {collegeName}
                  </button>

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Roll Number / Student ID</label>
                    <input
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      placeholder="e.g., 2024CS101"
                      className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                    />
                  </div>

                  {isSignUp && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email (optional)</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@college.edu"
                        type="email"
                        className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                      />
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/25 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity glow-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        {isSignUp ? "Create Account" : "Sign In"}
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setIsSignUp(!isSignUp); setStep(1); }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
