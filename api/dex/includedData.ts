import withIncludedData from "./withIncludedData";

export * from "./withIncludedData";

export const { fetchIncludedData } = withIncludedData(fetch);
