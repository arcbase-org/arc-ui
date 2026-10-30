// Campi dei moduli di login.ticly.it: etichetta, input con icona,
// password con occhio, codice 2FA.
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react";
import { useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { cx } from "../lib/cx";

const LABEL_STYLE: CSSProperties = {
  fontSize: "0.75rem",
  color: "rgba(255, 255, 255, 0.6)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 600,
};

const LEADING_ICON_STYLE: CSSProperties = {
  position: "absolute",
  left: "0.9rem",
  top: "50%",
  transform: "translateY(-50%)",
  color: "rgba(255, 255, 255, 0.4)",
  pointerEvents: "none",
};

export interface FieldProps {
  label: ReactNode;
  htmlFor?: string;
  /** Elemento a destra dell'etichetta (es. il link "Dimenticata?") */
  trailing?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** Etichetta maiuscola sopra un campo */
export function Field({ label, htmlFor, trailing, children, className, style }: FieldProps) {
  return (
    <div className={className} style={style}>
      {trailing ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
          <label htmlFor={htmlFor} style={LABEL_STYLE}>
            {label}
          </label>
          {trailing}
        </div>
      ) : (
        <label htmlFor={htmlFor} style={{ display: "block", ...LABEL_STYLE, marginBottom: "6px" }}>
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

export type InputProps = ComponentProps<"input"> & {
  /** Icona Lucide a sinistra (es. Mail) */
  icon?: LucideIcon;
};

/** Campo di testo (`.modular-input`) */
export function Input({ icon: Icon, className, style, ...props }: InputProps) {
  const input = <input className={cx("modular-input", className)} style={Icon ? { paddingLeft: "2.5rem", ...style } : style} {...props} />;
  if (!Icon) return input;
  return (
    <div style={{ position: "relative" }}>
      {input}
      <Icon size={16} style={LEADING_ICON_STYLE} />
    </div>
  );
}

export type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
  /** Icona a sinistra (default Lock); null per nessuna icona */
  icon?: LucideIcon | null;
};

/** Password con il pulsante per mostrarla o nasconderla */
export function PasswordInput({ icon: Icon = Lock, className, style, ...props }: PasswordInputProps) {
  const [showPass, setShowPass] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        type={showPass ? "text" : "password"}
        className={cx("modular-input", className)}
        style={{ ...(Icon ? { paddingLeft: "2.5rem" } : null), paddingRight: "2.75rem", ...style }}
        {...props}
      />
      {Icon && <Icon size={16} style={LEADING_ICON_STYLE} />}
      <button
        type="button"
        onClick={() => setShowPass((p) => !p)}
        aria-label={showPass ? "Nascondi password" : "Mostra password"}
        style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255, 255, 255, 0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", transition: "color 0.15s ease" }}
        onMouseOver={(e) => (e.currentTarget.style.color = "#fff")}
        onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)")}
      >
        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export type CodeInputProps = Omit<ComponentProps<"input">, "onChange"> & {
  /** Codice di backup (XXXX-XXXX) invece del codice a 6 cifre */
  backup?: boolean;
  /** Valore già ripulito: solo cifre, o maiuscolo per i codici di backup */
  onValueChange?: (value: string) => void;
  onChange?: ComponentProps<"input">["onChange"];
};

/** Codice 2FA grande e centrato, come nella verifica del login */
export function CodeInput({ backup, onValueChange, onChange, className, style, ...props }: CodeInputProps) {
  return (
    <input
      type="text"
      maxLength={backup ? 12 : 6}
      placeholder={backup ? "XXXX-XXXX" : "000000"}
      className={cx("modular-input", className)}
      style={{
        textAlign: "center",
        fontSize: backup ? "1.3rem" : "1.85rem",
        letterSpacing: backup ? "0.15em" : "0.25em",
        padding: "1rem",
        fontFamily: "monospace",
        ...style,
      }}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(backup ? e.target.value.toUpperCase() : e.target.value.replace(/[^0-9]/g, ""));
      }}
      {...props}
    />
  );
}
