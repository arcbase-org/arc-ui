// Bottoni connessi con il "corner game" di login.ticly.it: angoli esterni grandi,
// interni piccoli, il bottone attivo diventa una pillola e i vicini si modellano attorno.
import { createContext, useContext, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { cx } from "../lib/cx";

type Orientation = "vertical" | "horizontal";

interface ButtonGroupContextValue {
  orientation: Orientation;
  value?: string;
  select?: (value: string) => void;
}

const ButtonGroupContext = createContext<ButtonGroupContextValue>({ orientation: "vertical" });

export interface ButtonGroupProps {
  /**
   * "vertical": come la navigazione della sidebar di login (`.premium-nav-group`).
   * "horizontal": stesse regole ruotate in orizzontale (`.arc-corner-row`).
   */
  orientation?: Orientation;
  /** Bottone selezionato (per usare il gruppo come selettore) */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

/** Gruppo di bottoni connessi */
export function ButtonGroup({ orientation = "vertical", value, defaultValue, onValueChange, children, className, style, "aria-label": ariaLabel }: ButtonGroupProps) {
  const [innerValue, setInnerValue] = useState(defaultValue);
  const current = value ?? innerValue;

  const select = (next: string) => {
    if (value === undefined) setInnerValue(next);
    onValueChange?.(next);
  };

  return (
    <ButtonGroupContext.Provider value={{ orientation, value: current, select }}>
      <div role="group" aria-label={ariaLabel} className={cx(orientation === "horizontal" ? "arc-corner-row" : "premium-nav-group", className)} style={style}>
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

export interface ButtonGroupItemProps extends ComponentProps<"button"> {
  /** Valore per la selezione del gruppo; senza, il bottone è una semplice azione */
  value?: string;
  icon?: ReactNode;
  /** Forza lo stato attivo, senza passare dal valore del gruppo */
  active?: boolean;
}

/** Bottone di un ButtonGroup */
export function ButtonGroupItem({ value, icon, active, onClick, className, children, type = "button", ...props }: ButtonGroupItemProps) {
  const group = useContext(ButtonGroupContext);
  const isActive = active ?? (value !== undefined && group.value === value);

  return (
    <button
      type={type}
      aria-pressed={value !== undefined ? isActive : undefined}
      className={cx(group.orientation === "horizontal" ? "arc-corner-row__item" : "premium-nav-item", isActive && "active", className)}
      onClick={(e) => {
        onClick?.(e);
        if (value !== undefined) group.select?.(value);
      }}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
