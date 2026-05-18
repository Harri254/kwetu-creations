import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const { user, loginWithEmail, registerWithEmail } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
                <div className="flex items-center rounded-2xl border border-primary/10 bg-white pr-3 shadow-sm transition-all focus-within:border-secondary focus-within:ring-2 focus-within:ring-secondary/15">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl bg-transparent px-4 py-4 outline-none placeholder:text-primary/35"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="rounded-full p-2 text-primary/45 transition-colors hover:bg-primary/5 hover:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
