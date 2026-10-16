/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as feedback from "../feedback.js";
import type * as guide from "../guide.js";
import type * as journey from "../journey.js";
import type * as lib_aiQuota from "../lib/aiQuota.js";
import type * as lib_llm from "../lib/llm.js";
import type * as lib_owner from "../lib/owner.js";
import type * as lib_profileSummary from "../lib/profileSummary.js";
import type * as missions from "../missions.js";
import type * as profiles from "../profiles.js";
import type * as reflections from "../reflections.js";
import type * as skills from "../skills.js";
import type * as values from "../values.js";
import type * as valuesCatalog from "../valuesCatalog.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  feedback: typeof feedback;
  guide: typeof guide;
  journey: typeof journey;
  "lib/aiQuota": typeof lib_aiQuota;
  "lib/llm": typeof lib_llm;
  "lib/owner": typeof lib_owner;
  "lib/profileSummary": typeof lib_profileSummary;
  missions: typeof missions;
  profiles: typeof profiles;
  reflections: typeof reflections;
  skills: typeof skills;
  values: typeof values;
  valuesCatalog: typeof valuesCatalog;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
