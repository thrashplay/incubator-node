/* tslint:disable */
/* eslint-disable */
/**
 * Source Control Service
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * A Git source code repository.
 * @export
 * @interface GitRepository
 */
export interface GitRepository {
    /**
     * 
     * @type {string}
     * @memberof GitRepository
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof GitRepository
     */
    repositoryType: GitRepositoryRepositoryTypeEnum;
    /**
     * URL for this repository.
     * @type {string}
     * @memberof GitRepository
     */
    url: string;
}

export function GitRepositoryFromJSON(json: any): GitRepository {
    return GitRepositoryFromJSONTyped(json, false);
}

export function GitRepositoryFromJSONTyped(json: any, ignoreDiscriminator: boolean): GitRepository {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'repositoryType': json['repositoryType'],
        'url': json['url'],
    };
}

export function GitRepositoryToJSON(value?: GitRepository | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'repositoryType': value.repositoryType,
        'url': value.url,
    };
}

/**
* @export
* @enum {string}
*/
export enum GitRepositoryRepositoryTypeEnum {
    Git = 'git'
}


