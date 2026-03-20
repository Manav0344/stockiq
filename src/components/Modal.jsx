import React, { useEffect } from 'react';
import Icon from './Icon';

export default function Modal({ open, onClose, title, children, footer, maxWidth = 480 }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
          <button className="icon-btn" onClick={onClose}><Icon name="x" size={17} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
