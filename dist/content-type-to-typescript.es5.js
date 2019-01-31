'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsonSchemaToTypescript = require('json-schema-to-typescript');
var lodash = require('lodash');

var Location = {
    title: 'Location',
    properties: {
        lon: {
            type: 'number',
            description: '',
            additionalProperties: false,
            required: [],
        },
        lat: {
            type: 'number',
            description: '',
            additionalProperties: false,
            required: [],
        },
    },
    required: ['lat', 'lon'],
    additionalProperties: false,
};
var AssetLink = {
    title: 'AssetLink',
    properties: {
        type: {
            type: 'string',
            description: '',
            additionalProperties: false,
            required: [],
        },
        linkType: {
            type: 'string',
            description: '',
            additionalProperties: false,
            required: [],
        },
        id: {
            type: 'string',
            additionalProperties: false,
            required: [],
        },
    },
    required: ['type', 'linkType', 'id'],
    additionalProperties: false,
};
var EntryLink = {
    title: 'EntryLink',
    properties: {
        type: {
            type: 'string',
            description: '',
            additionalProperties: false,
            required: [],
        },
        linkType: {
            type: 'string',
            description: '',
            additionalProperties: false,
            required: [],
        },
        id: {
            type: 'string',
            additionalProperties: false,
            required: [],
        },
    },
    required: ['type', 'linkType', 'id'],
    additionalProperties: false,
};
var buildRef = function (schema) {
    return "#/definitions/" + schema.title;
};
var getByRef = function (ref) {
    var lookup = lodash.fromPairs(lodash.map([Location, EntryLink, AssetLink], function (def) { return [buildRef(def), def]; }));
    return lookup[ref];
};

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var toInterfaceName = function (s, prefix) {
    return prefix + lodash.upperFirst(
    // remove accents, umlauts, ... by their basic latin letters
    lodash.deburr(s)
        .replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, ' ')
        .replace(/^_[a-z]/g, function (match) { return match.toUpperCase(); })
        .replace(/_[a-z]/g, function (match) { return match.substr(1, match.length).toUpperCase(); })
        .replace(/([\d$]+[a-zA-Z])/g, function (match) { return match.toUpperCase(); })
        .replace(/\s+([a-zA-Z])/g, function (match) {
        return lodash.trim(match.toUpperCase());
    })
        .replace(/\s/g, ''));
};
function fieldToJsonSchema(fieldInfo, prefix) {
    var result;
    switch (fieldInfo.type) {
        case 'Symbol':
        case 'Text':
        case 'Date':
            result = {
                type: 'string',
            };
            break;
        case 'Number':
        case 'Integer':
            result = {
                type: 'number',
            };
            break;
        case 'Boolean':
            result = {
                type: 'boolean',
            };
            break;
        case 'Location':
            result = {
                $ref: buildRef(Location),
            };
            break;
        case 'Object':
            result = {
                type: 'object',
            };
            break;
        case 'Array':
            if (!fieldInfo.items) {
                throw new Error('Unexpected Content Type structure.');
            }
            result = {
                items: fieldToJsonSchema(fieldInfo.items, prefix),
                type: 'array',
            };
            break;
        case 'Link':
            if (fieldInfo.linkType === 'Asset') {
                result = {
                    tsType: "Asset",
                };
            }
            else if (fieldInfo.linkType === 'Entry') {
                var linkType = 'any';
                if (fieldInfo.validations &&
                    fieldInfo.validations.length > 0) {
                    var validation = fieldInfo.validations.find(function (v) {
                        return v.hasOwnProperty('linkContentType');
                    });
                    if (validation && validation.linkContentType && validation.linkContentType.length > 0) {
                        linkType = validation.linkContentType.map(function (s) {
                            return toInterfaceName(s, prefix);
                        }).join(' | ');
                    }
                }
                result = {
                    tsType: "Entry<" + linkType + ">",
                };
            }
            else {
                throw new Error('Unexpected Content Type structure.');
            }
            break;
        default:
            throw new Error("Type " + fieldInfo.type + " is not yet supported");
    }
    return result;
}
function transformFields(contentTypeInfo, prefix) {
    var properties = lodash.chain(contentTypeInfo.fields)
        .filter(function (fieldInfo) { return !fieldInfo.omitted; })
        .map(function (fieldInfo) { return [fieldInfo.id, fieldToJsonSchema(fieldInfo, prefix)]; })
        .fromPairs()
        .value();
    var required = lodash.chain(contentTypeInfo.fields)
        .filter(function (fieldInfo) { return fieldInfo.required; })
        .map(function (fieldInfo) { return fieldInfo.id; })
        .value();
    return {
        properties: properties,
        required: required,
        additionalProperties: false,
    };
}
function convertToJSONSchema(contentTypeInfo, prefix) {
    var resultSchema = __assign({ title: toInterfaceName(contentTypeInfo.sys.id, prefix), description: contentTypeInfo.description }, transformFields(contentTypeInfo, prefix));
    return resultSchema;
}

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BANNER_COMMENT = "/**\n* This file was automatically generated.\n* DO NOT MODIFY IT BY HAND.\n*/";
function compileFromContentTypes(contentTypes, options, prefix) {
    if (options === void 0) { options = {}; }
    if (prefix === void 0) { prefix = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var settings, allDefinitions, resultSchema, res, contentFulTypeImport;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    settings = lodash.defaults({
                        bannerComment: BANNER_COMMENT,
                    }, options);
                    allDefinitions = includeRequiredDefinitions(contentTypes.map(function (ct) { return convertToJSONSchema(ct, prefix); }));
                    resultSchema = {
                        title: 'EphemeralContentfulSchemaRoot1',
                        type: 'object',
                        properties: lodash.chain(allDefinitions)
                            .map(function (def) { return [def.title, { $ref: buildRef(def) }]; })
                            .fromPairs()
                            .value(),
                        definitions: lodash.chain(allDefinitions)
                            .map(function (def) { return [def.title, def]; })
                            .fromPairs()
                            .value(),
                    };
                    return [4 /*yield*/, jsonSchemaToTypescript.compile(resultSchema, EPHEMERAL_ROOT, settings)];
                case 1:
                    res = _a.sent();
                    contentFulTypeImport = 'import { Asset, Entry } from \'contentful\';';
                    return [2 /*return*/, cleanupEphemeralRoot(contentFulTypeImport + res)];
            }
        });
    });
}
var EPHEMERAL_ROOT = 'EphemeralContentfulSchemaRoot1';
function cleanupEphemeralRoot(input) {
    return input.replace(new RegExp(".+" + EPHEMERAL_ROOT + ".+[^{}]+(?=}).+\n+", 'gm'), '');
}
function getRefs(definition) {
    return lodash.chain(definition.properties)
        .map(function (propSchema) { return lodash.get(propSchema, '$ref'); })
        .compact()
        .map(function (s) { return getByRef(s); })
        .compact()
        .value();
}
function includeRequiredDefinitions(definitions) {
    var requiredBuiltInDefinitions = lodash.chain(definitions)
        .map(function (def) { return getRefs(def); })
        .flatten()
        .value();
    var alphabetizedDefinitions = lodash.orderBy(definitions, ['title'], ['asc']);
    return alphabetizedDefinitions.concat(requiredBuiltInDefinitions);
}

exports.compileFromContentTypes = compileFromContentTypes;
//# sourceMappingURL=content-type-to-typescript.es5.js.map