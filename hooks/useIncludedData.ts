import React from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  selectIncludedData,
  updateIncludedData,
  resetIncludedData,
} from "@/store/slices/includedData";
import { fetchIncludedData } from "@/api/dex/includedData";
import AppError from "@/classes/AppError";
import { dateToDateString } from "@/utils/dates";

export default function useIncludedData() {
  const { data, dateFetched } = useAppSelector(selectIncludedData);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<AppError | null>(null);
  const dispatch = useAppDispatch();

  const update = React.useCallback(() => {
    setLoading(true);
    setError(null);

    const dateFetched = dateToDateString(new Date());

    fetchIncludedData()
      .then((response) => {
        dispatch(
          updateIncludedData({
            data: response,
            dateFetched,
          }),
        );
      })
      .catch((unknownError) => {
        setError(
          AppError.getError(unknownError, "Error fetching included data"),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const reset = React.useCallback(() => {
    setLoading(false);
    setError(null);

    dispatch(resetIncludedData());
  }, [dispatch]);

  return {
    data,
    dateFetched,
    loading,
    error,
    update,
    reset,
  };
}
