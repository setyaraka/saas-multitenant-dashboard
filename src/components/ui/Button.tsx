import * as React from "react";
import { Button, type ButtonProps } from "@heroui/button";

const cx = (...c: Array<string | false | null | undefined>) =>
  c.filter(Boolean).join(" ");

export type AccentButtonProps = Omit<ButtonProps, "color"> & {
  className?: string;
};

const AccentButton = React.forwardRef<HTMLButtonElement, AccentButtonProps>(
  ({ className, variant = "solid", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cx(
          "bg-accent text-white hover:opacity-90",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "focus-visible:ring-[rgb(var(--accent-rgb))]",
          className,
        )}
        variant={variant}
        {...props}
      />
    );
  },
);

AccentButton.displayName = "Access Button";
export default AccentButton;
