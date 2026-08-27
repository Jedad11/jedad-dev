import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { api, ApiError } from "../lib/api";

export function AdminLogin() {
  const { authenticated, checkAuth } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (authenticated) {
    return <Navigate to="/mgmt-x7k2/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/auth/login", { username, password });
      await checkAuth();
      navigate("/mgmt-x7k2/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 429)) {
        setError(err.message);
      } else {
        setError(t.admin.invalidCreds);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-sm items-center px-6">
      <form onSubmit={handleSubmit} className="w-full rounded-lg border border-slate bg-ink-2 p-6">
        <h1 className="mb-5 font-mono text-lg font-semibold">{t.admin.loginTitle}</h1>

        <label className="mb-3 block font-mono text-xs text-bone-dim">
          {t.admin.username}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
        </label>

        <label className="mb-4 block font-mono text-xs text-bone-dim">
          {t.admin.password}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded border border-slate bg-ink px-3 py-2 font-mono text-sm text-bone outline-none focus:border-jade"
          />
        </label>

        {error && <p className="mb-4 font-thai text-sm text-marigold">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-marigold py-2 font-mono text-sm font-semibold text-ink disabled:opacity-60"
        >
          {submitting ? t.admin.loggingIn : t.admin.login}
        </button>
      </form>
    </div>
  );
}
