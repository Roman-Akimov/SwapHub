import type { AppRouterOutput } from '@swaphub/backend/src/lib/router/router';
import { createContext, useContext } from 'react';
import { trpc } from './trpc';

export type AppContext = {
  me: AppRouterOutput['getMe']['me'];
};

const AppReactContext = createContext<AppContext>({
  me: null,
});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isFetching, isLoading, isError } = trpc.getMe.useQuery();
  return (
    <AppReactContext.Provider
      value={{
        me: data?.me || null,
      }}
    >
      {isLoading || isFetching ? <p>Loading...</p> : isError ? <p>Error: {error?.message} </p> : children}
    </AppReactContext.Provider>
  );
};

export const UseAppContext = () => {
  return useContext(AppReactContext);
};

export const useMe = () => {
  const { me } = UseAppContext();
  return me;
};
