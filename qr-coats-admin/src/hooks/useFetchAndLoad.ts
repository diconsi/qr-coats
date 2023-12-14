import { AxiosCall } from "@/models";
import { useEffect, useState } from "react";
import { AxiosResponse, AxiosError } from "axios";

interface FetchAndLoadResult<T> {
  loading: boolean;
  callEndpoint: (axiosCall: AxiosCall<T>) => Promise<AxiosResponse<T>>;
  cancelEndpoint: () => void;
}

const useFetchAndLoad = <T>(): FetchAndLoadResult<T> => {
  const [loading, setLoading] = useState(false);
  let controller: AbortController;

  const callEndpoint = async (
    axiosCall: AxiosCall<T>
  ): Promise<AxiosResponse<T>> => {
    if (axiosCall.controller) controller = axiosCall.controller;
    setLoading(true);
    let result = {} as AxiosResponse<T>;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      result = await axiosCall.call;
    } catch (error) {
      setLoading(false);
      throw error as AxiosError; 
    }
    setLoading(false);
    return result;
  };


  const cancelEndpoint = () => {
    setLoading(false);
    controller && controller.abort;
  };

  useEffect(() => {
    return () => {
      cancelEndpoint();
    };
  }, []);

  return { loading, callEndpoint, cancelEndpoint };
};

export default useFetchAndLoad;
