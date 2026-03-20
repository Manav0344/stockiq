import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { useOTP } from '../../hooks/useOTP';
import { checkPasswordStrength, fmtTime } from '../../utils/helpers';

function Steps({ current }) {
  const steps = ["Email", "Verify OTP", "New Password", "Done"];
  return (
    <div className="auth-steps">
      {steps.map((s, i) => (
        <div key={s} className={`auth-step${i < current ? " done" : i === current ? " active" : ""}`}>
          <div className="auth-step-dot">{i < current ? <Icon name="check" size={12}/> : i + 1}</div>
          <div className="auth-step-label" style={{ fontSize: 9 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

export default function ForgotPage({ switchTo }) {
  const { emailExists, resetPassword } = useAuth();
  const [step,      setStep]      = useState(0);
  const [email,     setEmail]     = useState("");
  const [newPwd,    setNewPwd]    = useState("");
  const [confPwd,   setConfPwd]   = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const otpHook = useOTP(email);
  const strength = checkPasswordStrength(newPwd);

  const handleSendCode = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    if (!emailExists(email)) { setError("No account found with this email."); setLoading(false); return; }
    otpHook.send();
    setLoading(false);
    setStep(1);
  };

  const handleVerify = async () => {
    if (!otpHook.verify()) return;
    setStep(2);
  };

  const handleReset = async () => {
    if (strength.score < 3) { setError("Password is too weak"); return; }
    if (newPwd !== confPwd)  { setError("Passwords don't match"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    resetPassword(email, newPwd);
    setLoading(false);
    setStep(3);
  };

  return (
    <div className="auth-card">
      <Steps current={step} />

      {step === 0 && (
        <>
          <div className="auth-card-title">Forgot password?</div>
          <div className="auth-card-sub">Remember it? <a onClick={() => switchTo("login")}>Sign in</a></div>
          {error && <div className="auth-alert danger"><Icon name="alert" size={14}/>{error}</div>}
          <div className="form-group">
            <label className="form-label">Registered Email</label>
            <div className="field-wrap">
              <input className="field-input" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(""); }} autoFocus />
              <span className="field-icon"><Icon name="mail" size={15}/></span>
            </div>
          </div>
          <button className="btn-submit" onClick={handleSendCode} disabled={loading}>
            {loading ? <><div className="spinner"/> Sending…</> : <>Send Reset Code <Icon name="arrowRight" size={16}/></>}
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <div className="auth-card-title">Enter OTP</div>
          <div className="auth-card-sub">6-digit code sent to <strong style={{ color: "var(--text-1)" }}>{email}</strong></div>
          <div className="auth-alert info"><Icon name="info" size={14}/> Demo: Check browser console (F12) for code.</div>
          {otpHook.otpError && <div className="auth-alert danger"><Icon name="alert" size={14}/> Wrong OTP. Try again.</div>}
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
              ? <span><button onClick={otpHook.send}><Icon name="refresh" size={13}/> Resend code</button></span>
              : <span>Resend in <span>{fmtTime(otpHook.timer)}</span></span>}
          </div>
          <button className="btn-submit" onClick={handleVerify} disabled={!otpHook.isFilled} style={{ marginTop: 24 }}>
            Verify OTP <Icon name="arrowRight" size={16}/>
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="auth-card-title">Set new password</div>
          <div className="auth-card-sub">Choose something strong and unique.</div>
          {error && <div className="auth-alert danger"><Icon name="alert" size={14}/>{error}</div>}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div className="field-wrap">
              <input className="field-input" type={showPwd ? "text" : "password"} placeholder="New password" value={newPwd} onChange={e => { setNewPwd(e.target.value); setError(""); }} autoComplete="new-password" autoFocus />
              <span className="field-icon" onClick={() => setShowPwd(v => !v)}>{showPwd ? <Icon name="eyeOff" size={15}/> : <Icon name="eye" size={15}/>}</span>
            </div>
            {newPwd && (
              <div className="pwd-strength">
                <div className="pwd-bar-track">
                  {[1,2,3,4,5].map(i => <div key={i} className={`pwd-bar-seg${strength.score >= i ? " filled" : ""}`} style={{"--seg-color": strength.color}} />)}
                </div>
                <div className="pwd-strength-label"><span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span></div>
              </div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className={`field-input${confPwd && confPwd !== newPwd ? " error" : confPwd && confPwd === newPwd ? " success" : ""}`} type="password" placeholder="Repeat new password" value={confPwd} onChange={e => setConfPwd(e.target.value)} autoComplete="new-password" />
          </div>
          <button className="btn-submit" onClick={handleReset} disabled={loading || !newPwd || !confPwd}>
            {loading ? <><div className="spinner"/> Resetting…</> : <><Icon name="check" size={16}/> Reset Password</>}
          </button>
        </>
      )}

      {step === 3 && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 68, height: 68, background: "rgba(0,229,160,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", border: "2px solid var(--accent)", boxShadow: "0 0 32px rgba(0,229,160,0.25)" }}>
            <Icon name="check" size={32} style={{ color: "var(--accent)" }} />
          </div>
          <div className="auth-card-title">Password reset!</div>
          <div className="auth-card-sub" style={{ textAlign: "center", marginBottom: 28 }}>
            Your password has been updated. Sign in with your new credentials.
          </div>
          <button className="btn-submit" onClick={() => switchTo("login")}>Back to Sign In <Icon name="arrowRight" size={16}/></button>
        </div>
      )}
    </div>
  );
}
