import React from 'react';

const Switch = React.forwardRef(({ 
  id, 
  checked, 
  onChange, 
  label, 
  description, 
  disabled = false,
  className = "",
  ...props 
}, ref) => {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="space-y-0.5 flex-1">
        <label 
          htmlFor={id}
          className={`text-sm font-medium leading-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
          }`}
        >
          {label}
        </label>
        {description && (
          <p className={`text-xs text-muted-foreground ${disabled ? 'opacity-50' : ''}`}>
            {description}
          </p>
        )}
      </div>
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        data-state={checked ? "checked" : "unchecked"}
        id={id}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-primary' : 'bg-input'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        <span 
          data-state={checked ? "checked" : "unchecked"}
          className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
});

Switch.displayName = "Switch";

export { Switch };
