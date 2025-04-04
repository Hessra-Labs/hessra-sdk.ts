/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/request_token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Request a token for access to a resource.
         * @description Used by clients to request a token for a resource they are authorized for. Requires client to prove identity via an X.509 certificate, which the server will use to check if the client is authorized for the requested resource. Based on the resource configuration, this endpoint will automatically issue either a standard token or a service chain token. Service chain tokens can be used for authorization across multiple service components in a chain.
         */
        post: operations["requestToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/verify_token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Validates a JWT for a requestor.
         * @description When a client requests access to a resource from another machine, it will pass a JWT issued by the authorization service to the owner of the resource. The owner will then call this API to validate the token and prove that the requestor is authorized to access the requested resource. Requires a valid X.509 certificate to establish a connection.
         */
        post: operations["verifyToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/verify_service_chain_token": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Validates a service chain token for a requestor.
         * @description When a client requests access to a service chain resource, it will pass a service chain token issued by the authorization service. This endpoint validates the token and checks if the requestor is authorized to access the specified service chain resource or components in the chain up to but NOT including the specified component. If no component is specified, it validates against all components in the chain. Requires a valid X.509 certificate to establish a connection.
         */
        post: operations["verifyServiceChainToken"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/public_key": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Retrieve the server's public key.
         * @description Provides the public key used by the server for token verification. This endpoint is publicly accessible without requiring mutual TLS authentication, allowing clients to obtain the public key for verifying tokens issued by the server.
         */
        get: operations["getPublicKey"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    requestToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The name of the resource the requested token is for. If this resource is configured as a service chain in the server, a service chain token will be issued.
                     * @example resource1
                     */
                    resource?: string;
                };
            };
        };
        responses: {
            /** @description Request is authorized, and a token is returned to the client. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Token issued */
                        response_msg?: string;
                        /** @example eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6InNpZ25pbmdfa2V5In0.eyJzdWIiOiJ1cmk6dXJuOnRlc3Q6YXJnby1jbGkwIiwiZXhwIjoxNzM4MTc5NDg1LCJyZXMiOiJyZXNvdXJjZTEifQ.RwZf7NSjJFo5ndqsM8Thd1KqoY7J2NtswJ2ys1_JiaDVYL9G8mZNjMWiGQ-CBXVE63HIpPJlZyCiqafj6Vj87Q */
                        token?: string | null;
                    };
                };
            };
            /** @description Request is unauthorized, and no token is returned. Requested resource is echoed back to requestor. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Unauthorized or unknown resource: bad_resource */
                        response_msg?: string;
                        /** @example null */
                        token?: string | null;
                    };
                };
            };
            /** @description Request was unable to be deserialized, likely due to a missing resource specifier in the JSON. */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    verifyToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The token to be validated
                     * @example eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6InNpZ25pbmdfa2V5In0.eyJzdWIiOiJ1cmk6dXJuOnRlc3Q6YXJnby1jbGkwIiwiZXhwIjoxNzM4MTc5NDg1LCJyZXMiOiJyZXNvdXJjZTEifQ.RwZf7NSjJFo5ndqsM8Thd1KqoY7J2NtswJ2ys1_JiaDVYL9G8mZNjMWiGQ-CBXVE63HIpPJlZyCiqafj6Vj87Q
                     */
                    token: string;
                    /**
                     * @description The subject identifier for the token validation
                     * @example uri:urn:test:argo-cli0
                     */
                    subject: string;
                    /**
                     * @description The resource the token is being validated for
                     * @example resource1
                     */
                    resource: string;
                };
            };
        };
        responses: {
            /** @description The token was successfully validated, and the requestor is authorized for the resource. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Token validated */
                        response_msg?: string;
                    };
                };
            };
            /** @description There was an issue with the token format */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid token format */
                        response_msg?: string;
                    };
                };
            };
            /** @description The token is invalid or could not be validated */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid token */
                        response_msg?: string;
                    };
                };
            };
            /** @description The token is valid but the client is not authorized for the requested resource */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Client not authorized for this resource */
                        response_msg?: string;
                    };
                };
            };
            /** @description Request was unable to be deserialized, likely due to missing required fields in the JSON. */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/plain": string;
                };
            };
        };
    };
    verifyServiceChainToken: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description The service chain token to be validated
                     * @example CiIKCmV5SlVhV...truncated...
                     */
                    token: string;
                    /**
                     * @description The subject identifier for the token validation
                     * @example uri:urn:test:argo-cli0
                     */
                    subject: string;
                    /**
                     * @description The service chain resource the token is being validated for
                     * @example resource4
                     */
                    resource: string;
                    /**
                     * @description Optional component name to validate in the service chain. The verification will check nodes up to but NOT including this component.
                     * @example edge_function
                     */
                    component?: string;
                };
            };
        };
        responses: {
            /** @description The service chain token was successfully validated, and the requestor is authorized for the resource or component. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Service chain token validated */
                        response_msg?: string;
                    };
                };
            };
            /** @description There was an issue with the token format or resource type */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Resource is not a service chain: resource1 */
                        response_msg?: string;
                    };
                };
            };
            /** @description The token is invalid or could not be validated */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Invalid service chain token: Component 'nonexistent_component' not found in service chain */
                        response_msg?: string;
                    };
                };
            };
            /** @description The token is valid but the client is not authorized for the requested resource */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Client not authorized for this resource */
                        response_msg?: string;
                    };
                };
            };
            /** @description Resource not found in configuration */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Resource not found: nonexistent_resource */
                        response_msg?: string;
                    };
                };
            };
            /** @description Server error validating token or resource configuration error */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Resource has no service nodes defined: resource4 */
                        response_msg?: string;
                    };
                };
            };
        };
    };
    getPublicKey: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Public key successfully retrieved. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        /** @example Public key provided */
                        response_msg?: string;
                        /**
                         * @description The public key in a serialized format
                         * @example RSAPublicKey { n: Integer([232, 21, 89, ...]), e: Integer([1, 0, 1]) }
                         */
                        public_key?: string;
                    };
                };
            };
        };
    };
}
