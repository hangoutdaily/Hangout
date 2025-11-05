'use client';

import { useId } from 'react';

export default function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  icon: Icon,
  options,
  ...rest
}: any) {
  const id = useId();
  const hasError = Boolean(error);

  const baseClass =
    'w-full border rounded-lg px-4 py-3 bg-input text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-ring transition-all';

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseClass} h-28 resize-y ${
            hasError ? 'border-destructive' : 'border-border focus:border-accent'
          }`}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          className={`${baseClass} ${
            hasError ? 'border-destructive' : 'border-border focus:border-accent'
          }`}
        >
          <option value="">Select category</option>
          {options?.map((opt: string) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />}
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            {...rest}
            className={`${baseClass} ${
              Icon ? 'pl-10 pr-4' : 'pl-4 pr-4'
            } ${hasError ? 'border-destructive' : 'border-border focus:border-accent'}`}
          />
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
