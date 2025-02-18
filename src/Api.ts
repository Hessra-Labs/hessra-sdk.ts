/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title Hessra Authorization Node API
 * @version 0.1.0
 *
 * OpenAPI specification for communicating with the Hessra Systems Authorization Node.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  requestToken = {
    /**
     * @description Used by clients to request a JWT for a resource they are authorized for. Requires client to prove identity via an X.509 certificate, which the server will use to check if the client is authorized for the requested resource.
     *
     * @tags auth
     * @name RequestToken
     * @summary Request a JWT for access to a resource.
     * @request POST:/request_token
     * @secure
     */
    requestToken: (
      data: {
        /**
         * The name of the resource the requested token is for
         * @example "resource1"
         */
        resource?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Token issued" */
          response_msg?: string;
          /** @example "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6InNpZ25pbmdfa2V5In0.eyJzdWIiOiJ1cmk6dXJuOnRlc3Q6YXJnby1jbGkwIiwiZXhwIjoxNzM4MTc5NDg1LCJyZXMiOiJyZXNvdXJjZTEifQ.RwZf7NSjJFo5ndqsM8Thd1KqoY7J2NtswJ2ys1_JiaDVYL9G8mZNjMWiGQ-CBXVE63HIpPJlZyCiqafj6Vj87Q" */
          token?: string | null;
        },
        | {
            /** @example "Unauthorized or unknown resource: bad_resource" */
            response_msg?: string;
            /** @example null */
            token?: string | null;
          }
        | string
      >({
        path: `/request_token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  verifyToken = {
    /**
     * @description When a client requests access to a resource from another machine, it will pass a JWT issued by the authorization service to the owner of the resource. The owner will then call this API to validate the token and prove that the requestor is authorized to access the requested resource. Requires a valid X.509 certificate to establish a connection.
     *
     * @tags auth
     * @name VerifyToken
     * @summary Validates a JWT for a requestor.
     * @request POST:/verify_token
     * @secure
     */
    verifyToken: (
      data: {
        /**
         * The token to be validated
         * @example "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6InNpZ25pbmdfa2V5In0.eyJzdWIiOiJ1cmk6dXJuOnRlc3Q6YXJnby1jbGkwIiwiZXhwIjoxNzM4MTc5NDg1LCJyZXMiOiJyZXNvdXJjZTEifQ.RwZf7NSjJFo5ndqsM8Thd1KqoY7J2NtswJ2ys1_JiaDVYL9G8mZNjMWiGQ-CBXVE63HIpPJlZyCiqafj6Vj87Q"
         */
        token: string;
        /**
         * The resource the token is being validated for
         * @example "resource1"
         */
        resource: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** @example "Token validated" */
          response_msg?: string;
        },
        | {
            /** @example "Invalid token format" */
            response_msg?: string;
          }
        | {
            /** @example "Invalid token" */
            response_msg?: string;
          }
        | {
            /** @example "Client not authorized for this resource" */
            response_msg?: string;
          }
        | string
      >({
        path: `/verify_token`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
