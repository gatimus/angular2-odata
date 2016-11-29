import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ODataConfiguration } from './config';
import { ODataQuery } from './query';
import { GetOperation, PostOperation, PutOperation, RefOperation } from './operation';
export declare class ODataService<T> {
    private _typeName;
    private http;
    private config;
    constructor(_typeName: string, http: Http, config: ODataConfiguration);
    readonly TypeName: string;
    Get(key: string): GetOperation<T>;
    Post(entity: T | {
        ['@odata.id']: string;
    }, key?: string): PostOperation<T> | RefOperation;
    CustomAction(key: string, actionName: string, postdata: any): Observable<T>;
    Patch(entity: any, key: string): Observable<Response>;
    Put(entity: T | {
        ['@odata.id']: string;
    }, key: string): PutOperation<T> | RefOperation;
    Delete(key: string, etag?: string): Observable<Response>;
    Query(): ODataQuery<T>;
    protected getEntityUri(entityKey: string): string;
    protected handleResponse(entity: Observable<Response>): Observable<T>;
    private extractData(res);
    private escapeKey();
}
