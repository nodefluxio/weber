import type { GetStaticProps } from "next";
import type { Service } from "../app/types/elements";
import { HomePage } from "../app/components/templates/HomePage/HomePage";

type Props = {
  analytics: Service[];
  solutions: Service[];
};

const Home = ({ analytics, solutions }: Props) => {
  return <HomePage analytics={analytics} solutions={solutions} />;
};

export const getStaticProps: GetStaticProps = async () => {
  const resAnalytics = await fetch(`http://localhost:8080/services?type=analytic`);
  const analytics = await resAnalytics.json();

  const resSolutions = await fetch(`http://localhost:8080/services?type=solution`);
  const solutions = await resSolutions.json();

  if (!analytics || !solutions) {
    return {
      notFound: true,
    };
  }

  return {
    props: { analytics: analytics.data, solutions: solutions.data },
  };
};

export default Home;
