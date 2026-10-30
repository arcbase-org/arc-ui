// Selettore a pillola cir-tabs di login.ticly.it (da Uiverse.io, uiverse-astronaut)
import { Fragment, useId, useState, type CSSProperties, type ReactNode } from "react";
import { cx } from "../lib/cx";

/** @deprecated Sconsigliato insieme a CirTabs: usa ButtonGroup e ButtonGroupItem. */
export interface CirTabsItem {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

/** @deprecated Sconsigliato insieme a CirTabs: usa ButtonGroup. */
export interface CirTabsProps {
  items: CirTabsItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Nome del gruppo di radio (generato se manca) */
  name?: string;
  /** Colonna invece di riga (`.cir-tabs-vertical`) */
  vertical?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Pillole selezionabili: radio nascosti + etichette (`.cir-tabs`)
 *
 * @deprecated Sconsigliato. Continua a funzionare, ma per i nuovi progetti usa
 * `ButtonGroup` (`orientation="horizontal"` o `"vertical"`), i bottoni connessi
 * con il "corner game" della sidebar.
 */
export function CirTabs({ items, value, defaultValue, onValueChange, name, vertical, className, style, "aria-label": ariaLabel }: CirTabsProps) {
  const autoId = useId();
  const group = name ?? `cir-tabs-${autoId}`;
  const [innerValue, setInnerValue] = useState(defaultValue ?? items[0]?.value);
  const current = value ?? innerValue;

  return (
    <div className={cx(vertical ? "cir-tabs-vertical" : "cir-tabs", className)} style={style} role="radiogroup" aria-label={ariaLabel}>
      {items.map((item) => {
        const id = `${group}-${item.value}`;
        return (
          <Fragment key={item.value}>
            <input
              type="radio"
              className="cir-tabs__r"
              id={id}
              name={group}
              value={item.value}
              checked={current === item.value}
              onChange={() => {
                if (value === undefined) setInnerValue(item.value);
                onValueChange?.(item.value);
              }}
            />
            <label htmlFor={id} className="cir-tabs__t">
              {item.icon}
              {item.label}
            </label>
          </Fragment>
        );
      })}
    </div>
  );
}
