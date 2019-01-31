import { JSONSchema } from './types/json-schema';
export declare const Location: JSONSchema;
export declare const AssetLink: JSONSchema;
export declare const EntryLink: JSONSchema;
export declare const buildRef: (schema: JSONSchema) => string;
export declare const getByRef: (ref: string) => JSONSchema;
