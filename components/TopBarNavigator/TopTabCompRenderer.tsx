import React from "react";
import { TopTabCompRendererProp } from "@/types";
import Spinner from "../Spinner";
import Error from "../Error";

const TopTabCompRenderer = ({
  Children,
  isLoading,
  isError,
  error,
  data,
}: TopTabCompRendererProp) => {
  return isLoading ? (
    <Spinner />
  ) : isError ? (
    <Error error={error} />
  ) : Children ? (
    <Children className="bg-white" data={data} />
  ) : null;
};

export default TopTabCompRenderer;
