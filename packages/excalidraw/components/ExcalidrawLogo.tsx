import "./ExcalidrawLogo.scss";

const LogoIcon = () => (
  <svg
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ExcalidrawLogo-icon"
    aria-hidden="true"
  >
    <rect width="40" height="40" rx="12" fill="currentColor" />
    <path d="M11 29V11h4l10 13V11h4v18h-4L15 16v13h-4Z" fill="white" />
    <circle cx="31" cy="9" r="3" fill="#2dd4bf" />
  </svg>
);

const LogoText = () => <span className="ExcalidrawLogo-text">NeoDraw</span>;

type LogoSize = "xs" | "small" | "normal" | "large" | "custom" | "mobile";

interface LogoProps {
  size?: LogoSize;
  withText?: boolean;
  style?: React.CSSProperties;
  /**
   * If true, the logo will not be wrapped in a Link component.
   * The link prop will be ignored as well.
   * It will merely be a plain div.
   */
  isNotLink?: boolean;
}

export const ExcalidrawLogo = ({
  style,
  size = "small",
  withText,
}: LogoProps) => {
  return (
    <div
      className={`ExcalidrawLogo is-${size}`}
      style={style}
      aria-label="NeoDraw"
    >
      <LogoIcon />
      {withText && <LogoText />}
    </div>
  );
};
