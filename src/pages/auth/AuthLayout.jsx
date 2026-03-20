import React, { useState } from 'react';
import LoginPage   from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPage   from './ForgotPage';

const AUTH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
.auth-root{font-family:'DM Sans',sans-serif;background:#080c14;min-height:100vh;display:flex;color:#f0f4ff;overflow:hidden;position:relative;}
.auth-bg{position:fixed;inset:0;overflow:hidden;z-index:0;}
.auth-bg::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,229,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.04) 1px,transparent 1px);background-size:48px 48px;mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%);}
.auth-bg::after{content:'';position:absolute;top:-20%;left:-10%;width:60%;height:60%;background:radial-gradient(ellipse,rgba(0,229,160,0.06) 0%,transparent 70%);animation:pulse-glow 6s ease-in-out infinite alternate;}
@keyframes pulse-glow{from{transform:scale(1) translate(0,0);opacity:.6;}to{transform:scale(1.15) translate(5%,5%);opacity:1;}}
.orb{position:fixed;border-radius:50%;filter:blur(60px);pointer-events:none;z-index:0;}
.orb-1{width:400px;height:400px;background:rgba(0,229,160,0.06);top:-100px;right:-100px;animation:float1 12s ease-in-out infinite alternate;}
.orb-2{width:300px;height:300px;background:rgba(59,122,245,0.08);bottom:-80px;left:-80px;animation:float2 10s ease-in-out infinite alternate;}
@keyframes float1{from{transform:translate(0,0);}to{transform:translate(-40px,40px);}}
@keyframes float2{from{transform:translate(0,0);}to{transform:translate(40px,-40px);}}
.auth-left{width:44%;min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:60px;position:relative;z-index:1;}
.auth-right{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 60px;position:relative;z-index:1;overflow-y:auto;}
.brand-logo{display:flex;align-items:center;gap:12px;margin-bottom:56px;}
.brand-icon{width:44px;height:44px;background:#00e5a0;border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-weight:800;font-size:18px;color:#080c14;box-shadow:0 0 24px rgba(0,229,160,0.3);}
.brand-name{font-family:'Syne',sans-serif;font-size:22px;font-weight:700;letter-spacing:-.5px;}
.brand-name span{color:#00e5a0;}
.brand-headline{font-family:'Syne',sans-serif;font-size:clamp(30px,3.5vw,50px);font-weight:800;line-height:1.1;letter-spacing:-2px;margin-bottom:18px;}
.brand-headline .hl{color:#00e5a0;display:block;}
.brand-sub{font-size:14px;color:#8b9ab8;line-height:1.7;max-width:360px;margin-bottom:44px;}
.brand-stats{display:flex;gap:28px;}
.brand-stat-val{font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#00e5a0;letter-spacing:-1px;}
.brand-stat-label{font-size:11px;color:#4a5a78;margin-top:2px;font-weight:500;letter-spacing:.5px;}
.brand-divider{width:1px;background:linear-gradient(to bottom,transparent,#00e5a0,transparent);height:36px;align-self:center;opacity:.3;}
.mini-ticker{margin-top:48px;display:flex;gap:12px;flex-wrap:wrap;}
.mini-tick{display:flex;align-items:center;gap:8px;background:#121a28;border:1px solid rgba(255,255,255,.07);border-radius:8px;padding:6px 12px;font-size:12px;}
.mini-tick-sym{font-family:'Syne',sans-serif;font-weight:700;color:#f0f4ff;}
.mini-tick-val{color:#8b9ab8;font-size:11px;}
.mini-tick-chg{font-weight:700;font-size:11px;}
.auth-card{width:100%;max-width:440px;background:#0e1520;border:1px solid rgba(255,255,255,.07);border-radius:18px;padding:38px;box-shadow:0 24px 80px rgba(0,0,0,.8);animation:card-in .5s cubic-bezier(.16,1,.3,1) both;}
@keyframes card-in{from{opacity:0;transform:translateY(24px) scale(.97);}to{opacity:1;transform:translateY(0) scale(1);}}
.auth-card-title{font-family:'Syne',sans-serif;font-size:26px;font-weight:800;letter-spacing:-.8px;margin-bottom:6px;color:#f0f4ff;}
.auth-card-sub{font-size:14px;color:#8b9ab8;margin-bottom:28px;line-height:1.5;}
.auth-card-sub a{color:#00e5a0;cursor:pointer;font-weight:500;}
.auth-card-sub a:hover{text-decoration:underline;}
.form-group{margin-bottom:16px;}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-label{display:block;font-size:11px;font-weight:600;color:#8b9ab8;margin-bottom:7px;letter-spacing:.5px;text-transform:uppercase;}
.field-wrap{position:relative;}
.field-input{width:100%;background:#0a1018;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:11px 40px 11px 13px;font-size:14px;font-family:'DM Sans',sans-serif;color:#f0f4ff;outline:none;transition:border .18s,box-shadow .18s,background .18s;}
.field-input:focus{border-color:rgba(0,229,160,.4);background:rgba(0,229,160,.02);box-shadow:0 0 0 3px rgba(0,229,160,.08);}
.field-input::placeholder{color:#4a5a78;}
.field-input.error{border-color:rgba(255,77,109,.5);}
.field-input.success{border-color:rgba(0,229,160,.4);}
.field-icon{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:#4a5a78;cursor:pointer;transition:color .15s;display:flex;align-items:center;}
.field-icon:hover{color:#8b9ab8;}
.field-error{font-size:11.5px;color:#ff4d6d;margin-top:5px;display:flex;align-items:center;gap:4px;}
.pwd-strength{margin-top:10px;}
.pwd-bar-track{height:3px;background:#1a2435;border-radius:2px;display:flex;gap:3px;}
.pwd-bar-seg{flex:1;height:100%;border-radius:2px;background:#1a2435;transition:background .3s;}
.pwd-bar-seg.filled{background:var(--seg-color,#00e5a0);}
.pwd-strength-label{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:11px;}
.pwd-checks{display:flex;flex-wrap:wrap;gap:5px;margin-top:8px;}
.pwd-check{display:flex;align-items:center;gap:4px;font-size:11px;padding:3px 8px;border-radius:5px;transition:all .2s;}
.pwd-check.ok{background:rgba(0,229,160,.1);color:#00e5a0;}
.pwd-check.no{background:#1a2435;color:#4a5a78;}
.btn-submit{width:100%;padding:13px;background:#00e5a0;color:#080c14;border:none;border-radius:10px;font-family:'Syne',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:opacity .18s,transform .18s,box-shadow .18s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;box-shadow:0 4px 24px rgba(0,229,160,.25);}
.btn-submit:hover:not(:disabled){opacity:.9;transform:translateY(-1px);box-shadow:0 8px 32px rgba(0,229,160,.35);}
.btn-submit:disabled{opacity:.5;cursor:not-allowed;}
.btn-ghost{background:transparent;border:1px solid rgba(255,255,255,.07);color:#8b9ab8;border-radius:10px;padding:10px 16px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .18s;display:flex;align-items:center;gap:6px;}
.btn-ghost:hover{background:#1a2435;color:#f0f4ff;border-color:rgba(255,255,255,.14);}
.auth-divider{display:flex;align-items:center;gap:12px;margin:18px 0;color:#4a5a78;font-size:12px;}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07);}
.social-btns{display:flex;gap:10px;}
.btn-social{flex:1;padding:10px;background:#121a28;border:1px solid rgba(255,255,255,.07);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;color:#8b9ab8;transition:all .18s;}
.btn-social:hover{background:#1a2435;color:#f0f4ff;border-color:rgba(255,255,255,.14);}
.check-label{display:flex;align-items:flex-start;gap:10px;cursor:pointer;font-size:13px;color:#8b9ab8;line-height:1.5;}
.check-label input[type="checkbox"]{width:15px;height:15px;accent-color:#00e5a0;margin-top:2px;flex-shrink:0;cursor:pointer;}
.check-label a{color:#00e5a0;font-weight:500;cursor:pointer;}
.otp-grid{display:flex;gap:10px;justify-content:center;margin:22px 0;}
.otp-input{width:50px;height:58px;text-align:center;font-size:24px;font-family:'Syne',sans-serif;font-weight:700;background:#0a1018;border:1px solid rgba(255,255,255,.07);border-radius:10px;color:#f0f4ff;outline:none;transition:all .18s;caret-color:#00e5a0;}
.otp-input:focus{border-color:rgba(0,229,160,.4);background:rgba(0,229,160,.02);box-shadow:0 0 0 3px rgba(0,229,160,.1);transform:scale(1.06);}
.otp-input.filled{border-color:rgba(0,229,160,.35);}
.otp-input.error-otp{border-color:#ff4d6d;animation:shake .3s ease;}
@keyframes shake{0%,100%{transform:translateX(0);}20%,60%{transform:translateX(-4px);}40%,80%{transform:translateX(4px);}}
.auth-alert{padding:10px 13px;border-radius:9px;font-size:13px;display:flex;align-items:flex-start;gap:8px;margin-bottom:16px;animation:alert-in .25s ease;}
@keyframes alert-in{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}
.auth-alert.danger{background:rgba(255,77,109,.12);color:#ff4d6d;border:1px solid rgba(255,77,109,.2);}
.auth-alert.success{background:rgba(0,229,160,.1);color:#00e5a0;border:1px solid rgba(0,229,160,.2);}
.auth-alert.info{background:rgba(59,122,245,.12);color:#7eb3ff;border:1px solid rgba(59,122,245,.2);}
.auth-steps{display:flex;align-items:center;gap:0;margin-bottom:28px;}
.auth-step{display:flex;flex-direction:column;align-items:center;gap:5px;flex:1;position:relative;}
.auth-step::before{content:'';position:absolute;top:13px;left:calc(-50% + 14px);right:calc(50% + 14px);height:1px;background:rgba(255,255,255,.07);z-index:0;}
.auth-step:first-child::before{display:none;}
.auth-step-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:'Syne',sans-serif;border:2px solid rgba(255,255,255,.1);background:#0a1018;color:#4a5a78;z-index:1;transition:all .3s;}
.auth-step.done .auth-step-dot{background:#00e5a0;border-color:#00e5a0;color:#080c14;box-shadow:0 0 12px rgba(0,229,160,.3);}
.auth-step.active .auth-step-dot{border-color:#00e5a0;color:#00e5a0;box-shadow:0 0 12px rgba(0,229,160,.25);}
.auth-step-label{font-size:10px;color:#4a5a78;font-weight:500;letter-spacing:.5px;white-space:nowrap;}
.auth-step.active .auth-step-label,.auth-step.done .auth-step-label{color:#00e5a0;}
.otp-timer{text-align:center;font-size:13px;color:#8b9ab8;margin-top:6px;}
.otp-timer span{color:#00e5a0;font-weight:700;font-family:'Syne',sans-serif;}
.otp-timer button{background:none;border:none;color:#00e5a0;cursor:pointer;font-weight:600;font-size:13px;text-decoration:underline;font-family:'DM Sans',sans-serif;display:inline-flex;align-items:center;gap:4px;}
.forgot-link{font-size:12px;color:#00e5a0;cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;font-weight:500;padding:0;}
.forgot-link:hover{text-decoration:underline;}
.spinner{width:16px;height:16px;border:2px solid rgba(0,0,0,.2);border-top-color:#080c14;border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes card-in{from{opacity:0;transform:translateY(24px) scale(.97);}to{opacity:1;transform:translateY(0) scale(1);}}
.select{background:#0a1018;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:11px 13px;font-size:14px;font-family:'DM Sans',sans-serif;color:#f0f4ff;outline:none;width:100%;cursor:pointer;}
@media(max-width:900px){.auth-left{display:none;}.auth-right{padding:24px 20px;}.auth-card{padding:24px 20px;}}
`;

const TICKERS = [
  { sym: "NIFTY", val: "22,419", chg: "+0.64%", pos: true },
  { sym: "AAPL",  val: "$189.45", chg: "+1.24%", pos: true },
  { sym: "NVDA",  val: "$875.39", chg: "+2.63%", pos: true },
  { sym: "TSLA",  val: "$182.63", chg: "-4.30%", pos: false },
];

function BrandPanel() {
  return (
    <div className="auth-left">
      <div className="brand-logo">
        <div className="brand-icon">S</div>
        <div className="brand-name">Stock<span>IQ</span></div>
      </div>
      <div className="brand-headline">
        Trade Smarter.
        <span className="hl">Grow Faster.</span>
      </div>
      <div className="brand-sub">
        Real-time market data, AI-powered insights, and portfolio analytics — all in one professional trading platform built for serious investors.
      </div>
      <div className="brand-stats">
        <div><div className="brand-stat-val">2.4M+</div><div className="brand-stat-label">Active Traders</div></div>
        <div className="brand-divider" />
        <div><div className="brand-stat-val">₹18,000Cr</div><div className="brand-stat-label">Assets Tracked</div></div>
        <div className="brand-divider" />
        <div><div className="brand-stat-val">99.9%</div><div className="brand-stat-label">Uptime SLA</div></div>
      </div>
      <div className="mini-ticker">
        {TICKERS.map(t => (
          <div key={t.sym} className="mini-tick">
            <span className="mini-tick-sym">{t.sym}</span>
            <span className="mini-tick-val">{t.val}</span>
            <span className="mini-tick-chg" style={{ color: t.pos ? "#00e5a0" : "#ff4d4d" }}>{t.chg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AuthLayout() {
  const [page, setPage] = React.useState("login");
  return (
    <>
      <style>{AUTH_CSS}</style>
      <div className="auth-root">
        <div className="auth-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <BrandPanel />
        <div className="auth-right">
          {page === "login"    && <LoginPage    switchTo={setPage} />}
          {page === "register" && <RegisterPage switchTo={setPage} />}
          {page === "forgot"   && <ForgotPage   switchTo={setPage} />}
        </div>
      </div>
    </>
  );
}
