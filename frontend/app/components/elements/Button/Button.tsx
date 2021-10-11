import { ReactNode } from "react";
import styles from "./Button.module.scss";

type Props = {
  children: ReactNode;
  color: "primary"|"secondary";
  href?: string;
};

export const Button = ({ children, color, href }: Props) => {
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
      <Component {...attributes}>{children}</Component>
    </>
  );
};
