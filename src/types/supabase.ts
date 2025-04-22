
/**
 * A helper type for Supabase RPC calls to ensure type safety
 * T = return type, P = params type
 */
export type RPCFunction<T, P = {}> = (params?: P) => {
  returns: <R = T>() => {
    data: R;
    error: Error | null;
  }
};

// Extend the Supabase client type (used for documentation only)
declare module '@supabase/supabase-js' {
  interface SupabaseClient {
    rpc<T, P = {}>(fn: string, params?: P): ReturnType<RPCFunction<T, P>>;
  }
}
