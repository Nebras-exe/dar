export interface CardProps {
  variant?: 'service' | 'project';
  /** Service variant: glyph/emoji shown inside the icon badge. */
  icon?: React.ReactNode;
  /** Project variant: photo url. */
  image?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Project variant: small caption under the title (e.g. location). */
  meta?: string;
  href?: string;
}
