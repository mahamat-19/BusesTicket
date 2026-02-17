import React from "react";

interface Props {
  title: string;
}

const PageTitle: React.FC<Props> = ({ title }) => {
  return <h1 className="text-xl font-bold mb-4">{title}</h1>;
};

export default PageTitle;
