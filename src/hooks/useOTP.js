import { useState, useRef, useCallback, useEffect } from 'react';
import { genOTP } from '../utils/helpers';

export function useOTP(email) {
  const [otp,          setOtp]        = useState(["", "", "", "", "", ""]);
  const [generatedOtp, setGenerated]  = useState("");
  const [timer,        setTimer]      = useState(60);
  const [canResend,    setCanResend]  = useState(false);
  const [otpError,     setOtpError]   = useState(false);
  const timerRef = useRef(null);
  const refs     = useRef([]);

  const startTimer = useCallback(() => {
    setTimer(60);
    setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0; }
        return t - 1;
      });
    }, 1000);
  }, []);

  const send = useCallback(() => {
    const code = genOTP();
    setGenerated(code);
    setOtp(["", "", "", "", "", ""]);
    setOtpError(false);
    startTimer();
    // In production this would call an email/SMS API
    console.log(`%c[StockIQ OTP] Code for ${email}: ${code}`, "color:#00e5a0;font-weight:bold;font-size:14px");
    return code;
  }, [email, startTimer]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setOtpError(false);
    if (val && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKey = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft"  && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const verify = (entered = otp.join("")) => {
    if (entered !== generatedOtp) { setOtpError(true); return false; }
    return true;
  };

  const isFilled = otp.every(d => d !== "");

  return { otp, otpError, timer, canResend, refs, isFilled, send, handleChange, handleKey, handlePaste, verify };
}
