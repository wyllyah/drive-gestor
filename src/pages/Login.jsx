import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Eye, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginComEmail, loginComGoogle } from "../services/authService.js";
import { loginSchema } from "../schemas/loginSchema.js";

function GoogleLogo() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}

const getErrorMessage = (error) =>
  error?.message || "Não foi possível entrar. Confira seus dados e tente novamente.";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectTo = location.state?.from?.pathname || "/";

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");

    try {
      await loginComEmail(values);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      await loginComGoogle();
    } catch (err) {
      setError(getErrorMessage(err));
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef3ff] px-4 py-10 text-slate-950">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(91, 112, 155, 0.14) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <div className="absolute h-[58rem] w-[58rem] rounded-full border border-blue-200/60" aria-hidden="true" />
      <div className="absolute h-[42rem] w-[42rem] rounded-full border border-blue-200/50" aria-hidden="true" />

      <section className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-xl border border-slate-200 bg-white/95 px-8 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:px-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <Car className="text-blue-700" size={34} fill="currentColor" aria-hidden="true" />
              <h1 className="text-4xl font-bold tracking-normal text-slate-950">DriveGestor</h1>
            </div>
            <p className="mt-4 text-base text-slate-500">Gestão de frotas para freelancers</p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            className="mt-10 flex h-14 w-full items-center justify-center gap-4 rounded-lg border border-slate-300 bg-white text-base font-medium text-slate-950 transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <GoogleLogo />
            {googleLoading ? "Redirecionando..." : "Entrar com Google"}
          </button>

          <div className="my-9 flex items-center gap-7">
            <div className="h-px flex-1 bg-slate-300" />
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              ou entre com seu e-mail
            </span>
            <div className="h-px flex-1 bg-slate-300" />
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-base font-medium text-slate-950">E-mail</span>
              <div className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <Mail className="shrink-0 text-slate-500" size={20} aria-hidden="true" />
                <input
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                  type="email"
                  placeholder="exemplo@email.com"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="flex items-center justify-between gap-4 text-base font-medium text-slate-950">
                Senha
                <button
                  type="button"
                  className="text-sm font-semibold text-blue-700 transition hover:text-blue-800"
                >
                  Esqueci minha senha
                </button>
              </span>
              <div className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <Lock className="shrink-0 text-slate-500" size={20} aria-hidden="true" />
                <input
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-slate-500 transition hover:text-slate-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  <Eye size={21} aria-hidden="true" />
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password.message}</p>}
            </label>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="h-14 w-full rounded-lg bg-blue-700 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-base text-slate-700">
          Não tem uma conta?{" "}
          <Link to="/cadastro" className="font-bold text-blue-700 transition hover:text-blue-800">
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}
