import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { useOTP } from '../../hooks/useOTP';
import { checkPasswordStrength, fmtTime } from '../../utils/helpers';

function Steps({ current }) {
  const steps = ["Account Info", "Verify Email", "Done"];
  return (
    <div className="auth-steps">
      {steps.map((s, i) => (
        <div key={s} className={`auth-step${i < current ? " done" : i === current ? " active" : ""}`}>
          <div className="auth-step-dot">{i < current ? <Icon name="check" size={13} /> : i + 1}</div>
          <div className="auth-step-label">{s}</div>
        </div>
      ))}
    </div>
  );
}

export default function RegisterPage({ switchTo }) {
  const { login, register, emailExists } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", password: "", confirm: "", role: "user", agree: false });
  const [showPwd,    setShowPwd]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [errors,     setErrors]     = useState({});
  const [globalErr,  setGlobalErr]  = useState("");
  const [savedUser,  setSavedUser]  = useState(null);

  const otpHook = useOTP(form.email);
  const strength = checkPasswordStrength(form.password);
  const F = k => v => setForm(f => ({...f, [k]: v}));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim())  e.firstName = "Required";
    if (!form.lastName.trim())   e.lastName  = "Required";
    if (!form.email.trim())      e.email     = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    else if (emailExists(form.email)) e.email = "This email is already registered";
    if (form.phone && !/^\+?[\d\s\-]{8,15}$/.test(form.phone)) e.phone = "Invalid phone number";
    if (!form.password)          e.password  = "Password required";
    else if (strength.score < 3) e.password  = "Password too weak (use 8+ chars with uppercase, number, symbol)";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    if (!form.agree)             e.agree     = "You must agree to continue";
    return e;
  };

  const handleContinue = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setGlobalErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    otpHook.send();
    setLoading(false);
    setStep(1);
  };

  const handleVerify = async () => {
    if (!otpHook.isFilled) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    if (!otpHook.verify()) { setLoading(false); return; }
    try {
      const user = register(form);
      setSavedUser(user);
      setStep(2);
      setTimeout(() => login(user), 1200);
    } catch (err) {
      setGlobalErr(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pwdChecks = [
    { key: "length",    label: "8+ chars"    },
    { key: "uppercase", label: "Uppercase"   },
    { key: "number",    label: "Number"      },
    { key: "special",   label: "Symbol"      },
  ];

  return (
    <div className="auth-card">
      <Steps current={step} />

      {step === 0 && (
        <>
          <div className="auth-card-title">Create account</div>
          <div className="auth-card-sub">Already have one? <a onClick={() => switchTo("login")}>Sign in →</a></div>
          {globalErr && <div className="auth-alert danger"><Icon name="alert" size={15} />{globalErr}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input className={`field-input${errors.firstName ? " error" : ""}`} placeholder="Arjun" value={form.firstName} onChange={e => { F("firstName")(e.target.value); setErrors(x=>({...x,firstName:""})); }} />
              {errors.firstName && <div className="field-error"><Icon name="alert" size={12}/>{errors.firstName}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input className={`field-input${errors.lastName ? " error" : ""}`} placeholder="Sharma" value={form.lastName} onChange={e => { F("lastName")(e.target.value); setErrors(x=>({...x,lastName:""})); }} />
              {errors.lastName && <div className="field-error"><Icon name="alert" size={12}/>{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="field-wrap">
              <input className={`field-input${errors.email ? " error" : ""}`} type="email" placeholder="you@example.com" value={form.email} onChange={e => { F("email")(e.target.value); setErrors(x=>({...x,email:""})); }} autoComplete="email" />
              <span className="field-icon"><Icon name="mail" size={15} /></span>
            </div>
            {errors.email && <div className="field-error"><Icon name="alert" size={12}/>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <div className="field-wrap">
              <input className={`field-input${errors.phone ? " error" : ""}`} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => { F("phone")(e.target.value); setErrors(x=>({...x,phone:""})); }} />
              <span className="field-icon"><Icon name="phone" size={15} /></span>
            </div>
            {errors.phone && <div className="field-error"><Icon name="alert" size={12}/>{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <select className="field-input" value={form.role} onChange={e => F("role")(e.target.value)}>
              <option value="user">Retail Investor — Free</option>
              <option value="premium">Premium Trader — Advanced features</option>
              <option value="admin">Administrator — Full access</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="field-wrap">
              <input className={`field-input${errors.password ? " error" : ""}`} type={showPwd ? "text" : "password"} placeholder="Create a strong password" value={form.password} onChange={e => { F("password")(e.target.value); setErrors(x=>({...x,password:""})); }} autoComplete="new-password" />
              <span className="field-icon" onClick={() => setShowPwd(v => !v)}>{showPwd ? <Icon name="eyeOff" size={15}/> : <Icon name="eye" size={15}/>}</span>
            </div>
            {errors.password && <div className="field-error"><Icon name="alert" size={12}/>{errors.password}</div>}
            {form.password && (
              <div className="pwd-strength">
                <div className="pwd-bar-track">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`pwd-bar-seg${strength.score >= i ? " filled" : ""}`} style={{"--seg-color": strength.color}} />
                  ))}
                </div>
                <div className="pwd-strength-label">
                  <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  <span style={{ color: "var(--text-3)", fontSize: 11 }}>{strength.score}/5</span>
                </div>
                <div className="pwd-checks">
                  {pwdChecks.map(c => (
                    <div key={c.key} className={`pwd-check ${strength.checks[c.key] ? "ok" : "no"}`}>
                      {strength.checks[c.key] ? <Icon name="check" size={11}/> : <Icon name="x" size={11}/>} {c.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="field-wrap">
              <input className={`field-input${errors.confirm ? " error" : form.confirm && form.confirm === form.password ? " success" : ""}`} type={showConf ? "text" : "password"} placeholder="Re-enter password" value={form.confirm} onChange={e => { F("confirm")(e.target.value); setErrors(x=>({...x,confirm:""})); }} autoComplete="new-password" />
              <span className="field-icon" onClick={() => setShowConf(v => !v)}>{showConf ? <Icon name="eyeOff" size={15}/> : <Icon name="eye" size={15}/>}</span>
            </div>
            {errors.confirm && <div className="field-error"><Icon name="alert" size={12}/>{errors.confirm}</div>}
          </div>

          <div className="form-group">
            <label className="check-label">
              <input type="checkbox" checked={form.agree} onChange={e => { F("agree")(e.target.checked); setErrors(x=>({...x,agree:""})); }} />
              <span>I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a></span>
            </label>
            {errors.agree && <div className="field-error" style={{ marginTop: 6 }}><Icon name="alert" size={12}/>{errors.agree}</div>}
          </div>

          <button className="btn-submit" onClick={handleContinue} disabled={loading}>
            {loading ? <><div className="spinner"/> Creating…</> : <>Continue <Icon name="arrowRight" size={16}/></>}
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <div className="auth-card-title">Verify email</div>
          <div className="auth-card-sub">6-digit code sent to <strong style={{ color: "var(--text-1)" }}>{form.email}</strong></div>
          <div className="auth-alert info"><Icon name="info" size={14}/> Demo: Check browser console (F12) for the OTP code.</div>
          {otpHook.otpError && <div className="auth-alert danger"><Icon name="alert" size={14}/> Invalid OTP. Please try again.</div>}

          <div className="otp-grid">
            {otpHook.otp.map((digit, idx) => (
              <input key={idx} ref={el => otpHook.refs.current[idx] = el}
                className={`otp-input${digit ? " filled" : ""}${otpHook.otpError ? " error-otp" : ""}`}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => otpHook.handleChange(idx, e.target.value)}
                onKeyDown={e => otpHook.handleKey(idx, e)}
                onPaste={otpHook.handlePaste}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <div className="otp-timer">
            {otpHook.canResend
              ? <span>Didn't receive it? <button onClick={() => otpHook.send()}><Icon name="refresh" size={13}/> Resend</button></span>
              : <span>Resend in <span>{fmtTime(otpHook.timer)}</span></span>}
          </div>

          <button className="btn-submit" onClick={handleVerify} disabled={loading || !otpHook.isFilled} style={{ marginTop: 24 }}>
            {loading ? <><div className="spinner"/> Verifying…</> : <><Icon name="check" size={16}/> Verify & Create Account</>}
          </button>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <button className="btn-ghost" onClick={() => setStep(0)} style={{ margin: "0 auto" }}>← Back</button>
          </div>
        </>
      )}

      {step === 2 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 68, height: 68, background: "rgba(0,229,160,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "2px solid var(--accent)", boxShadow: "0 0 32px rgba(0,229,160,0.25)", animation: "card-in 0.4s ease" }}>
            <Icon name="check" size={32} style={{ color: "var(--accent)" }} />
          </div>
          <div className="auth-card-title">Account created!</div>
          <div className="auth-card-sub" style={{ textAlign: "center", marginBottom: 0 }}>
            Welcome to StockIQ, <strong>{form.firstName}</strong>. Redirecting to dashboard…
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(0,229,160,0.3)", borderTop: "2px solid var(--accent)", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
          </div>
        </div>
      )}
    </div>
  );
}
