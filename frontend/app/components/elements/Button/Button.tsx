import { ReactNode, forwardRef } from "react";
import styles from "./Button.module.scss";
import { colorChoices } from "../../../types/elements";

type Props = {
  children: ReactNode;
  color: colorChoices;
  href?: string;
};

export const Button = forwardRef(({ children, color, href }: Props, ref) => {
  let tagName = "button";
  if (href != null) {
    tagName = "a";
  }

  const Component = tagName as React.ElementType;

  const attributes = {
    className: `${styles.btn} ${color && styles[color]}`,
    href: href,
  };

  return (
    <>
      <Component {...attributes} ref={ref}>
        {children}
      </Component>
    </>
  );
});
