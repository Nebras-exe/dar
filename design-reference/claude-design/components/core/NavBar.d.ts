export interface NavBarProps {
  logo?: string;
  links?: string[];
  activeLink?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}
