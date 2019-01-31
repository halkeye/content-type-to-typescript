import { ContentType } from './types/contentful';
import { JSONSchema } from './types/json-schema';
export declare const toInterfaceName: (s: string, prefix: string) => string;
export declare function convertToJSONSchema(contentTypeInfo: ContentType, prefix: string): JSONSchema;
