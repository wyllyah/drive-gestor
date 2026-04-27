import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Eye, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/registerSchema.js";
import { cadastrarUsuario } from "../services/authService.js";

const getErrorMessage = (error) =>
  error?.message || "Não foi possível criar sua conta. Tente novamente.";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await cadastrarUsuario(values);

      if (data.session) {
        navigate("/", { replace: true });
        return;
      }

      setSuccess("Cadastro criado. Verifique seu e-mail para confirmar a conta antes de entrar.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
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
            <p className="mt-4 text-base text-slate-500">Crie sua conta para gerenciar a frota</p>
          </div>

          {error && (
            <div className="mt-8 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {success}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <label className="block">
              <span className="text-base font-medium text-slate-950">E-mail</span>
              <div className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <Mail className="shrink-0 text-slate-500" size={20} aria-hidden="true" />
                <input
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                  type="email"
                  placeholder="voce@email.com"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="field-error">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="text-base font-medium text-slate-950">Senha</span>
              <div className="mt-3 flex h-14 items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                <Lock className="shrink-0 text-slate-500" size={20} aria-hidden="true" />
                <input
                  className="h-full min-w-0 flex-1 border-0 bg-transparent text-base text-slate-950 outline-none placeholder:text-slate-400"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
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
              disabled={loading}
              className="h-14 w-full rounded-lg bg-blue-700 text-base font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-base text-slate-700">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-bold text-blue-700 transition hover:text-blue-800">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
