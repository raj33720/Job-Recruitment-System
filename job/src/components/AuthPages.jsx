import React from "react";
import { Link } from "react-router-dom";

const FormInput = ({ label, id, type = "text", name, value, onChange, autoComplete }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-950 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
    />
  </label>
);

const SocialButton = ({ children, mark }) => (
  <button
    type="button"
    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
  >
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-xs font-black text-white">
      {mark}
    </span>
    {children}
  </button>
);

const GeometricPanel = ({ children }) => (
  <section className="relative flex min-h-[560px] items-center justify-center overflow-hidden bg-[#1E40AF] px-6 py-10 sm:px-10 lg:h-dvh lg:min-h-0 lg:px-8 lg:py-8">
    <div className="absolute left-8 top-10 h-20 w-20 rounded-full bg-yellow-300 shadow-xl shadow-blue-950/20 sm:h-28 sm:w-28" />
    <div className="absolute right-10 top-16 h-24 w-24 rotate-12 bg-white shadow-xl shadow-blue-950/20 sm:h-32 sm:w-32" />
    <div className="absolute bottom-14 left-12 h-0 w-0 border-b-[92px] border-l-[54px] border-r-[54px] border-b-red-500 border-l-transparent border-r-transparent sm:border-b-[124px] sm:border-l-[72px] sm:border-r-[72px]" />
    <div className="absolute bottom-28 right-8 h-24 w-24 rounded-full border-[18px] border-yellow-300 sm:h-32 sm:w-32" />
    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[22px] border-white/20" />
    <div className="absolute right-1/4 top-1/3 h-14 w-14 rotate-45 bg-red-500 sm:h-20 sm:w-20" />
    <div className="absolute bottom-8 right-1/3 h-10 w-10 bg-yellow-300 sm:h-14 sm:w-14" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px]" />

    <div className="relative z-10 w-full max-w-md">{children}</div>
  </section>
);

const AuthLayout = ({ children, eyebrow, heading, description }) => (
  <main className="min-h-screen w-full bg-white font-sans text-slate-950 lg:grid lg:h-dvh lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">
    <section className="flex min-h-[46vh] items-center bg-white px-6 py-10 sm:px-10 lg:h-dvh lg:min-h-0 lg:px-12 lg:py-8 xl:px-16">
      <div className="max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-2 text-sm font-black uppercase tracking-[0.22em] text-[#1E40AF] lg:mb-5">
          <span className="h-3 w-3 rounded-full bg-red-500" />
          {eyebrow}
        </div>
        <h1 className="max-w-xl text-5xl font-black uppercase leading-[0.92] tracking-normal text-slate-950 sm:text-6xl lg:text-[clamp(4rem,5.4vw,6rem)]">
          {heading}
        </h1>
        <p className="mt-5 max-w-lg text-base font-medium leading-7 text-slate-600 sm:text-lg lg:mt-4 lg:leading-8">
          {description}
        </p>
        <div className="mt-8 grid max-w-md grid-cols-3 gap-3 lg:mt-7">
          <div className="h-3 rounded bg-[#1E40AF]" />
          <div className="h-3 rounded bg-yellow-300" />
          <div className="h-3 rounded bg-red-500" />
        </div>
      </div>
    </section>

    <GeometricPanel>{children}</GeometricPanel>
  </main>
);

const AuthCard = ({ children, title, subtitle }) => (
  <div className="rounded-lg bg-white p-6 shadow-2xl shadow-blue-950/30 sm:p-7">
    <div className="mb-6 text-center">
      <p className="text-sm font-black uppercase tracking-[0.24em] text-red-500">Get Started</p>
      <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">{title}</h2>
      <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
    </div>
    {children}
  </div>
);

export function LoginPage({
  formData,
  onChange,
  onSubmit,
  onToggle,
  showRegister = true,
  forgotPath = "/forgot-password",
  portalLabel = "Talent Portal",
}) {
  return (
    <AuthLayout
      eyebrow={portalLabel}
      heading="Transform The Way Your Team Works"
      description="Step into a sharper hiring flow built for fast decisions, clear profiles, and confident next moves."
    >
      <AuthCard title="Welcome Back" subtitle="Log in and keep the hiring momentum moving.">
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            id="login-email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            autoComplete="email"
          />
          <FormInput
            id="login-password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            autoComplete="current-password"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 font-medium text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-red-500 focus:ring-red-400"
              />
              Remember me
            </label>
            <Link className="font-bold text-[#1E40AF] transition hover:text-red-500" to={forgotPath}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-lg bg-red-500 px-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-red-500/25 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-950 hover:shadow-slate-950/20"
          >
            Login
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex gap-3">
          <SocialButton mark="G">Google</SocialButton>
          <SocialButton mark="GH">GitHub</SocialButton>
        </div>

        {showRegister && (
          <p className="mt-6 text-center text-sm font-medium text-slate-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="font-black text-[#1E40AF] transition hover:text-red-500"
            >
              Sign Up
            </button>
          </p>
        )}
      </AuthCard>
    </AuthLayout>
  );
}

export function SignupPage({
  formData,
  onChange,
  onSubmit,
  onToggle,
  showRegister = true,
  portalLabel = "Talent Portal",
}) {
  return (
    <AuthLayout
      eyebrow={portalLabel}
      heading="Build The Team That Moves First"
      description="Create your workspace and bring every application, role, and hiring signal into one focused place."
    >
      <AuthCard title="Create Account" subtitle="Start with the essentials. You can refine details later.">
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            id="signup-name"
            label="Name"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            autoComplete="name"
          />
          <FormInput
            id="signup-email"
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            autoComplete="email"
          />
          <FormInput
            id="signup-password"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            autoComplete="new-password"
          />
          <FormInput
            id="signup-confirm-password"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            autoComplete="new-password"
          />

          <button
            type="submit"
            className="h-12 w-full rounded-lg bg-slate-950 px-5 text-sm font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-slate-950/20 transition duration-200 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-500/25"
          >
            Get Started
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          Or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <div className="flex gap-3">
          <SocialButton mark="G">Google</SocialButton>
          <SocialButton mark="GH">GitHub</SocialButton>
        </div>

        {showRegister && (
          <p className="mt-6 text-center text-sm font-medium text-slate-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onToggle}
              className="font-black text-[#1E40AF] transition hover:text-red-500"
            >
              Login
            </button>
          </p>
        )}
      </AuthCard>
    </AuthLayout>
  );
}
