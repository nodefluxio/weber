import Link from "next/link";
import styles from "./CardFull.module.scss";

type Props = {
  img: string;
  title: string;
  desc: string;
  href: string;
};

export const CardFull = ({ img, title, desc, href }: Props) => {
  return (
    <div
      className={styles.card}
      style={{
        background: `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ), url('${img}') center`,
      }}
    >
      <div className={styles.body}>
        <h3>{title}</h3>
        <p>{desc}</p>
      </div>
      <Link href={"/" + href}>
        <a>Try it now</a>
      </Link>
    </div>
  );
};
