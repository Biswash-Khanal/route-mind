// types/api.ts
export type ApiEnvelope<TData = unknown, TDetails = unknown> =
  | {
      success: true;
      code: string;
      message: string;
      timestamp: string;
      data?: TData;
    }
  | {
      success: false;
      code: string;
      message: string;
      timestamp: string;
      details?: TDetails;
    };
