import { ReactNode } from "react";
import styles from "./Button.module.scss";

enum colorChoices {
  Primary = "primary",
  Secondary = "secondary",
}

type Props = {
  children: ReactNode;
  color: colorChoices;
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
