import { DataProxy } from "apollo-cache";
import { ApolloError, OperationVariables } from "apollo-client";
import { FetchResult } from "apollo-link";
import { GraphQLError } from "graphql";

import React from "react";

import { MutationOptions, MUTATIONS } from "../mutations";
import { Omit } from "../tsHelpers";
import { useSaleorClient } from "./context";

// types
export type MutationUpdaterFn<TData = Record<string, any>> = (
  proxy: DataProxy,
  mutationResult: FetchResult<TData>
) => void;

export interface BaseMutationHookOptions<TData, TVariables>
  extends Omit<MutationOptions<TData, TVariables>, "update"> {
  update?: MutationUpdaterFn<TData>;
}

export type MutationFn<TData, TVariables> = (
  options?: BaseMutationHookOptions<TData, TVariables>
) => Promise<FetchResult<TData>>;
// ---

// keep track of called mutation
const useMutationTracking = (() => {
  let _mutationId = 0;

  const generateNewMutationId = (): number => {
    _mutationId += 1;
    return _mutationId;
  };

  const isMostRecentMutation = (mutationId: number) => {
    return _mutationId === mutationId;
  };

  return () => ({
    generateNewMutationId,
    isMostRecentMutation,
  });
})();

export interface MutationResult<TData> {
  called: boolean;
  data: TData | null;
  error: ApolloError | null;
  loading: boolean;
}

export interface ExecutionResult<T = Record<string, any>> {
  data?: T;
  extensions?: Record<string, any>;
  errors?: GraphQLError[];
}

const initialState: MutationResult<any> = {
  called: false,
  data: null,
  error: null,
  loading: false,
};

export function useMutation<TData, TVariables = OperationVariables>(
  mutation: any,
  baseOptions: BaseMutationHookOptions<TData, TVariables> = {}
): [MutationFn<TData, TVariables>, MutationResult<TData>] {
  const client = useSaleorClient();
  const { generateNewMutationId, isMostRecentMutation } = useMutationTracking();
  const [result, setResult] = React.useState<MutationResult<TData>>(
    initialState
  );

  const handleMutationStart = () => {
    if (!result.loading) {
      setResult({
        called: true,
        data: null,
        error: null,
        loading: true,
      });
    }
  };

  const handleMutationError = (error: ApolloError, mutationId: number) => {
    if (isMostRecentMutation(mutationId)) {
      setResult(prevState => ({
        ...prevState,
        error,
        loading: false,
      }));
    }
  };

  const handleMutationComplete = (
    response: ExecutionResult<TData>,
    mutationId: number
  ) => {
    const { data, errors } = response;
    if (errors && errors.length > 0) {
      handleMutationError(
        new ApolloError({ graphQLErrors: errors }),
        mutationId
      );
      return;
    }

    if (isMostRecentMutation(mutationId)) {
      setResult(prevState => ({
        ...prevState,
        data,
        loading: false,
      }));
    }
  };

  const runMutation = React.useCallback(
    (options: MutationOptions<TData, TVariables> = {}) => {
      return new Promise(resolve => {
        handleMutationStart();

        const mutationId = generateNewMutationId();
        const variables = baseOptions.variables
          ? { ...options.variables, ...baseOptions.variables }
          : options.variables;

        mutation(client, {
          ...baseOptions,
          ...options,
          variables,
        })
          .then(response => {
            handleMutationComplete(response, mutationId);
            resolve(response as ExecutionResult<TData>);
          })
          .catch(err => {
            handleMutationError(err, mutationId);
            resolve({});
          });
      });
    },
    [mutation, baseOptions]
  );

  return [runMutation, result];
}

export const mutationFactory = mutation => (
  options: MutationOptions<any, any>
) => useMutation(mutation, options);
