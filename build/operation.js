"use strict";
const http_1 = require('@angular/http');
const rx_1 = require('rxjs/rx');
class ODataOperation {
    constructor(_typeName, config, http) {
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
    }
    Expand(expand) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    }
    Select(select) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    }
    getParams() {
        let params = new http_1.URLSearchParams();
        if (this._select && this._select.length > 0)
            params.set(this.config.keys.select, this._select);
        if (this._expand && this._expand.length > 0)
            params.set(this.config.keys.expand, this._expand);
        return params;
    }
    handleResponse(entity) {
        return entity.map(this.extractData)
            .catch((err, caught) => {
            if (this.config.handleError)
                this.config.handleError(err, caught);
            return rx_1.Observable.throw(err);
        });
    }
    getEntityUri(entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    }
    getRequestOptions() {
        let options = this.config.requestOptions;
        options.search = this.getParams();
        return options;
    }
    parseStringOrStringArray(input) {
        if (input instanceof Array) {
            return input.join(',');
        }
        return input;
    }
    extractData(res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        let entity = body;
        return entity || null;
    }
}
exports.ODataOperation = ODataOperation;
class OperationWithKey extends ODataOperation {
    constructor(_typeName, config, http, key) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
    }
}
exports.OperationWithKey = OperationWithKey;
class OperationWithEntity extends ODataOperation {
    constructor(_typeName, config, http, entity) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.entity = entity;
    }
}
exports.OperationWithEntity = OperationWithEntity;
class OperationWithKeyAndEntity extends ODataOperation {
    constructor(_typeName, config, http, key, entity) {
        super(_typeName, config, http);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.key = key;
        this.entity = entity;
    }
}
exports.OperationWithKeyAndEntity = OperationWithKeyAndEntity;
class GetOperation extends OperationWithKey {
    Links(typeName) {
        this._links = typeName;
        return this;
    }
    Exec() {
        let requestUrl;
        if (!!this._links) {
            requestUrl = this.getEntityUri(this.key) + '/' + this.config.keys.links + '/' + this._links;
        }
        else {
            requestUrl = this.getEntityUri(this.key);
        }
        return super.handleResponse(this.http.get(requestUrl, this.getRequestOptions()));
    }
}
exports.GetOperation = GetOperation;
class PostOperation extends OperationWithEntity {
    constructor(_typeName, config, http, entity, key) {
        super(_typeName, config, http, entity);
        this._typeName = _typeName;
        this.config = config;
        this.http = http;
        this.entity = entity;
        this.key = key;
    }
    Links(typeName) {
        this._links = typeName;
        return this;
    }
    Exec() {
        let body = JSON.stringify(this.entity);
        let requestUrl;
        if (!!this._links) {
            requestUrl = this.getEntityUri(this.key) + '/' + this.config.keys.links + '/' + this._links;
        }
        else {
            requestUrl = this.config.baseUrl + '/' + this._typeName;
        }
        return super.handleResponse(this.http.post(requestUrl, body, this.getRequestOptions()));
    }
}
exports.PostOperation = PostOperation;
// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }
// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
//# sourceMappingURL=operation.js.map