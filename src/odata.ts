import { URLSearchParams, Http, Response, Headers, RequestOptions, RequestMethod } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import { ODataConfiguration } from './config';
import { ODataQuery } from './query';
import { ODataOperation, GetOperation, PostOperation, PutOperation, RefOperation } from './operation';

export class ODataService<T> {

    constructor(private _typeName: string, private http: Http, private config: ODataConfiguration) { }

    public get TypeName(){
        return this._typeName;
    }

    public Get(key: string): GetOperation<T> {
        return new GetOperation<T>(this.TypeName, this.config, this.http, key);
    }

    // public Post(entity: T): Observable<T> {
    //     let body = JSON.stringify(entity);
    //     return this.handleResponse(this.http.post(this.config.baseUrl + '/' + this.TypeName, body, this.config.postRequestOptions));
    // }

    public Post(entity: T | { ['@odata.id']: string; }, key?: string): PostOperation<T> | RefOperation {
        if (!!key) {
            return new RefOperation(this.TypeName, this.config, this.http, key, (<{ ['@odata.id']: string; }>entity), RequestMethod.Post);
        } else {
            return new PostOperation<T>(this.TypeName, this.config, this.http, (<T>entity));
        }
    }

    public CustomAction(key: string, actionName: string, postdata: any) {
        let body = JSON.stringify(postdata);
        return this.handleResponse(this.http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.requestOptions));
    }

    public Patch(entity: any, key: string): Observable<Response> {
        let body = JSON.stringify(entity);
        return this.http.patch(this.getEntityUri(key), body, this.config.postRequestOptions);
    }

    public Put(entity: T | { ['@odata.id']: string; },  key: string): PutOperation<T> | RefOperation  {
        if (!!(<any>entity)['@odata.id']) {
            return new RefOperation(this.TypeName, this.config, this.http, key, (<{ ['@odata.id']: string; }>entity), RequestMethod.Put);
        } else {
            return new PutOperation<T>(this.TypeName, this.config, this.http, key, (<T>entity));
        }
    }

    public Delete(key: string): Observable<Response> {
        return this.http.delete(this.getEntityUri(key), this.config.requestOptions);
    }

    public Query(): ODataQuery<T> {
        return new ODataQuery<T>(this.TypeName, this.config, this.http);
    }

    protected getEntityUri(entityKey: string): string {
        return this.config.getEntityUri(entityKey, this._typeName);
    }

    protected handleResponse(entity: Observable<Response>): Observable<T> {
        return entity.map(this.extractData)
           .catch((err: any, caught: Observable<T>) => {
               if (this.config.handleError) this.config.handleError(err, caught);
               return Observable.throw(err);
           });
    }

    private extractData(res: Response): T {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body: any = res.json();
        let entity: T = body;
        return entity || null;
    }

    private escapeKey() {

    }
}
