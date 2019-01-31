import { ContentType } from 'contentful/index';
import { Options } from 'json-schema-to-typescript';
export declare function compileFromContentTypes(contentTypes: ContentType[], options?: Partial<Options>, prefix?: string): Promise<string>;
