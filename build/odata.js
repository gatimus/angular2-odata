"use strict";
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
var query_1 = require('./query');
var operation_1 = require('./operation');
var ODataService = (function () {
    function ODataService(_typeName, http, config) {
        this._typeName = _typeName;
        this.http = http;
        this.config = config;
    }
    Object.defineProperty(ODataService.prototype, "TypeName", {
        get: function () {
            return this._typeName;
        },
        enumerable: true,
        configurable: true
    });
    ODataService.prototype.Get = function (key) {
        return new operation_1.GetOperation(this.TypeName, this.config, this.http, key);
    };
    // public Post(entity: T): Observable<T> {
    //     let body = JSON.stringify(entity);
    //     return this.handleResponse(this.http.post(this.config.baseUrl + '/' + this.TypeName, body, this.config.postRequestOptions));
    // }
    ODataService.prototype.Post = function (entity, key) {
        if (!!key) {
            return new operation_1.RefOperation(this.TypeName, this.config, this.http, key, entity, http_1.RequestMethod.Post);
        }
        else {
            return new operation_1.PostOperation(this.TypeName, this.config, this.http, entity);
        }
    };
    ODataService.prototype.CustomAction = function (key, actionName, postdata) {
        var body = JSON.stringify(postdata);
        return this.handleResponse(this.http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.requestOptions));
    };
    ODataService.prototype.Patch = function (entity, key) {
        var requestOptions = this.config.postRequestOptions;
        if (!!entity['@odata.etag'])
            requestOptions.headers.append('If-Match', entity['@odata.etag']);
        var body = JSON.stringify(entity);
        return this.http.patch(this.getEntityUri(key), body, requestOptions);
    };
    ODataService.prototype.Put = function (entity, key) {
        if (!!entity['@odata.id']) {
            return new operation_1.RefOperation(this.TypeName, this.config, this.http, key, entity, http_1.RequestMethod.Put);
        }
        else {
            var config = this.config;
            if (!!entity['@odata.etag'])
                config.requestOptions.headers.append('If-Match', entity['@odata.etag']);
            return new operation_1.PutOperation(this.TypeName, config, this.http, key, entity);
        }
    };
    ODataService.prototype.Delete = function (key, etag) {
        var requestOptions = this.config.requestOptions;
        if (!!etag)
            requestOptions.headers.append('If-Match', etag);
        return this.http.delete(this.getEntityUri(key), requestOptions);
    };
    ODataService.prototype.Query = function () {
        return new query_1.ODataQuery(this.TypeName, this.config, this.http);
    };
    ODataService.prototype.getEntityUri = function (entityKey) {
        return this.config.getEntityUri(entityKey, this._typeName);
    };
    ODataService.prototype.handleResponse = function (entity) {
        var _this = this;
        return entity.map(this.extractData)
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return Rx_1.Observable.throw(err);
        });
    };
    ODataService.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        var entity = body;
        return entity || null;
    };
    ODataService.prototype.escapeKey = function () {
    };
    return ODataService;
}());
exports.ODataService = ODataService;
//# sourceMappingURL=odata.js.map