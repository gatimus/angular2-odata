"use strict";
const http_1 = require('@angular/http');
const Rx_1 = require('rxjs/Rx');
const query_1 = require('./query');
const operation_1 = require('./operation');
class ODataService {
    constructor(_typeName, http, config) {
        this._typeName = _typeName;
        this.http = http;
        this.config = config;
    }
    get TypeName() {
        return this._typeName;
    }
    Get(key) {
        return new operation_1.GetOperation(this.TypeName, this.config, this.http, key);
    }
    // public Post(entity: T): Observable<T> {
    //     let body = JSON.stringify(entity);
    //     return this.handleResponse(this.http.post(this.config.baseUrl + '/' + this.TypeName, body, this.config.postRequestOptions));
    // }
    Post(entity, key) {
        if (!!key) {
            return new operation_1.RefOperation(this.TypeName, this.config, this.http, key, entity, http_1.RequestMethod.Post);
        }
        else {
            return new operation_1.PostOperation(this.TypeName, this.config, this.http, entity);
        }
    }
    CustomAction(key, actionName, postdata) {
        let body = JSON.stringify(postdata);
        return this.handleResponse(this.http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.requestOptions));
    }
    Patch(entity, key) {
        let requestOptions = this.config.postRequestOptions;
        if (!!entity['@odata.etag'])
            requestOptions.headers.append('If-Match', entity['@odata.etag']);
        let body = JSON.stringify(entity);
        return this.http.patch(this.getEntityUri(key), body, requestOptions);
    }
    Put(entity, key) {
        if (!!entity['@odata.id']) {
            return new operation_1.RefOperation(this.TypeName, this.config, this.http, key, entity, http_1.RequestMethod.Put);
        }
        else {
            return new operation_1.PutOperation(this.TypeName, this.config, this.http, key, entity);
        }
    }
    Delete(key) {
        return this.http.delete(this.getEntityUri(key), this.config.requestOptions);
    }
    Query() {
        return new query_1.ODataQuery(this.TypeName, this.config, this.http);
    }
    getEntityUri(entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    }
    handleResponse(entity) {
        return entity.map(this.extractData)
            .catch((err, caught) => {
            if (this.config.handleError)
                this.config.handleError(err, caught);
            return Rx_1.Observable.throw(err);
        });
    }
    extractData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entity = body;
        return entity || null;
    }
    escapeKey() {
    }
}
exports.ODataService = ODataService;
//# sourceMappingURL=odata.js.map