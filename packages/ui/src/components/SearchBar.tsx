import clsx from 'clsx';
import { ChangeEvent } from 'react';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * A simple search input component with optional placeholder and custom CSS
 * classes.  This component does not implement its own debouncing; callers
 * should manage debouncing/throttling as appropriate.
 */
export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value);
  }
  return (
    <input
      type="text"
      value={value}
      onChange={handleInput}
      placeholder={placeholder}
      className={clsx(
        'border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500',
        className,
      )}
    />
  );
}
