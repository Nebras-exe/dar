export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  /** Renders a <textarea> instead of <input>. */
  textarea?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<any>) => void;
}
