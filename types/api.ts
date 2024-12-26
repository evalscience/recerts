export type ApiError = {
  message: string;
  type:
    | "PAYLOAD"
    | "SERVER"
    | "CLIENT"
    | "INVALID"
    | "UNKNOWN"
    | "NETWORK"
    | "ABORT";
};
