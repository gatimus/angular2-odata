"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rx_1 = require('rxjs/Rx');
var operation_1 = require('./operation');
var PagedResult = (function () {
    function PagedResult() {
    }
    return PagedResult;
}());
exports.PagedResult = PagedResult;
var ODataQuery = (function (_super) {
    __extends(ODataQuery, _super);
    function ODataQuery(_typeName, config, http) {
        _super.call(this, _typeName, config, http);
    }
    ODataQuery.prototype.Filter = function (filter) {
        this._filter = filter;
        return this;
    };
    ;
    ODataQuery.prototype.Top = function (top) {
        this._top = top;
        return this;
    };
    ;
    ODataQuery.prototype.Skip = function (skip) {
        this._skip = skip;
        return this;
    };
    ODataQuery.prototype.OrderBy = function (orderBy) {
        this._orderBy = orderBy;
        return this;
    };
    ODataQuery.prototype.Exec = function () {
        var _this = this;
        var params = this.getQueryParams();
        var config = this.config;
        return this.http.get(this.buildResourceURL(), { search: params })
            .map(function (res) { return _this.extractArrayData(res, config); })
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return Rx_1.Observable.throw(err);
        });
    };
    ODataQuery.prototype.ExecWithCount = function () {
        var _this = this;
        var params = this.getQueryParams();
        params.set('$count', 'true'); // OData v4 only
        var config = this.config;
        return this.http.get(this.buildResourceURL(), { search: params })
            .map(function (res) { return _this.extractArrayDataWithCount(res, config); })
            .catch(function (err, caught) {
            if (_this.config.handleError)
                _this.config.handleError(err, caught);
            return Rx_1.Observable.throw(err);
        });
    };
    ODataQuery.prototype.buildResourceURL = function () {
        return this.config.baseUrl + '/' + this._typeName + '/';
    };
    ODataQuery.prototype.getQueryParams = function () {
        var params = _super.prototype.getParams.call(this);
        if (this._filter)
            params.set(this.config.keys.filter, this._filter);
        if (this._top)
            params.set(this.config.keys.top, this._top.toString());
        if (this._skip)
            params.set(this.config.keys.skip, this._skip.toString());
        if (this._orderBy)
            params.set(this.config.keys.orderBy, this._orderBy);
        return params;
    };
    ODataQuery.prototype.extractArrayData = function (res, config) {
        return config.extractQueryResultData(res);
    };
    ODataQuery.prototype.extractArrayDataWithCount = function (res, config) {
        return config.extractQueryResultDataWithCount(res);
    };
    return ODataQuery;
}(operation_1.ODataOperation));
exports.ODataQuery = ODataQuery;
//# sourceMappingURL=query.js.map