import { URLSearchParams, Http, Response, RequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/rx';
import { ODataConfiguration } from './config';
export declare abstract class ODataOperation<T> {
    protected _typeName: string;
    protected config: ODataConfiguration;
    protected http: Http;
    private _expand;
    private _select;
    constructor(_typeName: string, config: ODataConfiguration, http: Http);
    Expand(expand: string | string[]): this;
    Select(select: string | string[]): this;
    protected getParams(): URLSearchParams;
    protected handleResponse(entity: Observable<Response>): Observable<T>;
    protected getEntityUri(entityKey: string): string;
    protected getRequestOptions(): RequestOptions;
    abstract Exec(...args: any[]): Observable<any>;
    protected parseStringOrStringArray(input: string | string[]): string;
    private extractData(res);
}
export declare abstract class OperationWithKey<T> extends ODataOperation<T> {
    protected _typeName: string;
    protected config: ODataConfiguration;
    protected http: Http;
    protected key: string;
    constructor(_typeName: string, config: ODataConfiguration, http: Http, key: string);
    abstract Exec(...args: any[]): Observable<any>;
}
export declare abstract class OperationWithEntity<T> extends ODataOperation<T> {
    protected _typeName: string;
    protected config: ODataConfiguration;
    protected http: Http;
    protected entity: T;
    constructor(_typeName: string, config: ODataConfiguration, http: Http, entity: T);
    abstract Exec(...args: any[]): Observable<any>;
}
export declare abstract class OperationWithKeyAndEntity<T> extends ODataOperation<T> {
    protected _typeName: string;
    protected config: ODataConfiguration;
    protected http: Http;
    protected key: string;
    protected entity: T;
    constructor(_typeName: string, config: ODataConfiguration, http: Http, key: string, entity: T);
    abstract Exec(...args: any[]): Observable<any>;
}
export declare class GetOperation<T> extends OperationWithKey<T> {
    Exec(): Observable<T>;
}
export declare class PostOperation<T> extends OperationWithEntity<T> {
    Exec(): Observable<T>;
}
export declare namespace PostOperation {
}
export declare class PutOperation<T> extends OperationWithKeyAndEntity<T> {
    Exec(): Observable<T>;
}
export declare namespace PutOperation {
}
export declare class RefOperation extends OperationWithKeyAndEntity<{
    ['@odata.id']: string;
}> {
    protected _typeName: string;
    protected config: ODataConfiguration;
    protected http: Http;
    protected key: string;
    protected entity: {
        ['@odata.id']: string;
    };
    private _verb;
    private _ref;
    constructor(_typeName: string, config: ODataConfiguration, http: Http, key: string, entity: {
        ['@odata.id']: string;
    }, _verb: RequestMethod);
    Ref(typeName: string): RefOperation;
    Exec(): Observable<Response>;
}
