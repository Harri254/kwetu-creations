import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useFirebase } from "../contexts/FirebaseContext";

type AuthMode = "login" | "register";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      <path
        d="M21.8 12.23c0-.72-.06-1.25-.2-1.8H12v3.4h5.64c-.11.84-.7 2.1-2.02 2.95l-.02.11 2.73 2.11.19.02c1.78-1.64 2.8-4.06 2.8-6.79Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.08-.9 6.77-2.44l-3.22-2.5c-.86.6-2.02 1.02-3.55 1.02-2.7 0-5-1.78-5.82-4.24l-.1.01-2.84 2.2-.03.1A10.24 10.24 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.18 13.84A6.14 6.14 0 0 1 5.86 12c0-.64.11-1.27.3-1.84l-.01-.12-2.88-2.23-.09.04A10 10 0 0 0 2 12c0 1.6.38 3.1 1.05 4.45l3.13-2.61Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.92c1.92 0 3.21.83 3.95 1.52l2.88-2.8C17.07 3.01 14.76 2 12 2a10 10 0 0 0-8.82 5.45l3.1 2.42c.84-2.46 3.13-3.95 5.72-3.95Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } =
    useFirebase();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const redirectTo = (location.state as { from?: string } | null)?.from || "/";

  useEffect(() => {
    if (user) {
      navigate(redirectTo, { replace: true });
    }
  }, [user, navigate, redirectTo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        await loginWithEmail({
          email: formData.email,
          password: formData.password,
        });
        toast.success("Welcome back!");
      } else {
        await registerWithEmail({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });
        toast.success("Your account is ready.");
      }

      navigate(redirectTo, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Authentication failed";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google");
      navigate(redirectTo, { replace: true });
    } catch {
      toast.error("Google sign-in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(196,103,27,0.18),transparent_28%),linear-gradient(180deg,#f8fbfd_0%,#f4f7f9_100%)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="px-5 py-10 sm:px-8 lg:px-10 ">
          <div className="mx-auto max-w-md bg-primary/20 px-6 py-4 rounded-2xl">
            <div className="mb-8">
              <div className="mb-4 inline-flex  rounded-full border  border-primary/5 bg-primary/5 p-1 text-sm">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`rounded-full px-4 py-2 transition-all ${mode === "login" ? "bg-secondary text-white shadow-sm" : "text-tertiary"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`rounded-full px-4 py-2 transition-all ${mode === "register" ? "bg-secondary text-white shadow-sm" : "text-tertiary"}`}
                >
                  Create Account
                </button>
              </div>

              <h2 className="text-3xl font-bold text-primary">
                {mode === "login"
                  ? "Welcome back"
                  : "Create your client account"}
              </h2>
              <p className="mt-2 text-sm text-primary/60">
                {mode === "login"
                  ? "Sign in with your email and password to continue."
                  : "Register a new client user with any email, then continue managing your work here."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === "register" && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                      First Name
                    </label>
                    <div className="flex items-center rounded-2xl border border-primary/10 bg-white px-4 shadow-sm">
                      {/* <UserRound className="h-4 w-4 text-primary/35" /> */}
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Jane"
                        className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-primary/35"
                        required={mode === "register"}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-primary">
                      Last Name
                    </label>
                    <div className="flex items-center rounded-2xl border border-primary/10 bg-white px-4 shadow-sm">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full bg-transparent px-3 py-4 outline-none placeholder:text-primary/35"
                        required={mode === "register"}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-primary/10 bg-white px-4 py-4 outline-none shadow-sm transition-all placeholder:text-primary/35 focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-primary/10 bg-white px-4 py-4 outline-none shadow-sm transition-all placeholder:text-primary/35 focus:border-secondary focus:ring-2 focus:ring-secondary/15"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary px-6 py-4 font-bold text-white shadow-[0_12px_24px_rgba(196,103,27,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#ad5817] disabled:translate-y-0 disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                <span>
                  {mode === "login" ? "Sign In" : "Create Client Account"}
                </span>
              </button>
            </form>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-primary/10" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary/35">
                Or
              </span>
              <div className="h-px flex-1 bg-primary/10" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-primary/10 bg-white px-6 py-4 font-semibold text-primary shadow-sm transition-all hover:border-secondary/30 hover:bg-primary/5 disabled:opacity-50"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            <p className="mt-8 text-center text-sm text-primary/55">
              Back to{" "}
              <Link
                to="/"
                className="font-semibold text-secondary hover:underline"
              >
                home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
