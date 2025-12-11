import { Context } from "telegraf";

declare module "telegraf" {
  interface Context {
    session?: {
      // LOGIN
      loginState: "ASK_USERNAME" | "ASK_PASSWORD" | null;
      username: string | null;
      id?: number;
      token?: string;

      // REPORT
      reportState?:
        | "ASK_TITLE"
        | "ASK_DESCRIPTION"
        | "ASK_CATEGORY"
        | "ASK_ANONYMOUS"
        | "ASK_PHOTOS"
        | "ASK_LOCATION"
        | null;

      report?: {
        title?: string;
        description?: string;
        category?: string;
        anonymous?: boolean;
        latitude?: number;
        longitude?: number;
        address?: string;
        photos: string[];
      };
    };
  }
}
