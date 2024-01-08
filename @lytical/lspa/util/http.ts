/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { operators, Observable } from 'rxjs';
import type { OperatorFunction } from 'rxjs';
import 'jquery';

export type spa_util_http_result_t<_t_> = [_t_, JQuery.jqXHR];

export class spa_util_http {
  delete<_t_ = unknown>(url: string, data?: unknown, dataType: data_type = 'json', headers?: JQuery.PlainObject) {
    return this.send<_t_>({
      method: 'DELETE',
      data: <any>data,
      headers,
      url,
      dataType
    });
  }

  get<_t_ = unknown>(url: string, data?: unknown, dataType: data_type = 'json', headers?: JQuery.PlainObject): Observable<_t_> {
    return this.send<_t_>({
      data: <any>data,
      headers,
      url,
      dataType
    });
  }

  static get_xsrf_token(): string | undefined {
    let rs = /XSRF\-TOKEN=([^;\s]+)/.exec(window.document.cookie);
    return rs && rs.length > 1 ? rs[1] : undefined;
  }

  static init(version: string, client_id: string) {
    $(document)
      .ajaxError((_evt, xhr, _opt) => {
        console.debug({http_error: xhr});
      })
      .ajaxSend((_evt, xhr, opt) => {
        xhr.setRequestHeader('x-lyt-version', version);
        xhr.setRequestHeader('x-lyt-href', `/${window.location.hash}`);
        if(opt.url!.startsWith('/')) {
          opt.url = require.toUrl(opt.url!.slice(1));
        }
        if(!opt.crossDomain) {
          xhr.setRequestHeader('x-lyt-client-id', client_id);
          if(opt.method !== 'GET' && opt.method !== 'HEAD') {
            let token = spa_util_http.get_xsrf_token();
            if(token) {
              xhr.setRequestHeader(xsrf_token_header, token);
            }
          }
        }
        else {
          opt.xhrFields = Object.assign(opt.xhrFields || {}, <JQuery.Ajax.XHRFields>{ withCredentials: true });
        }
      });
  }

  patch<_t_ = unknown>(url: string, data?: unknown, dataType: data_type = 'json', headers?: JQuery.PlainObject) {
    return this.send<_t_>({
      method: 'PATCH',
      contentType: data !== undefined ? 'application/json' : undefined,
      data: data !== undefined ? JSON.stringify(data) : undefined,
      headers,
      url,
      dataType,
      processData: false
    });
  }

  post<_t_ = unknown>(url: string, data?: unknown, dataType: data_type = 'json', headers?: JQuery.PlainObject) {
    return this.send<_t_>({
      method: 'POST',
      contentType: data !== undefined ? 'application/json' : undefined,
      data: data !== undefined ? JSON.stringify(data) : undefined,
      headers,
      url,
      dataType,
      processData: false
    });
  }

  put<_t_ = unknown>(url: string, data?: unknown, dataType: data_type = 'json', headers?: JQuery.PlainObject) {
    return this.send<_t_>({
      method: 'PUT',
      contentType: data !== undefined ? 'application/json' : undefined,
      data: data !== undefined ? JSON.stringify(data) : undefined,
      headers,
      url,
      dataType,
      processData: false
    });
  }

  send<_t_ = unknown>(settings: JQuery.AjaxSettings): Observable<_t_> {
    return (<Observable<spa_util_http_result_t<_t_>>>this.send_ex(settings)).pipe(operators.map(x => x[0]));
  }

  send_ex<_t_ = unknown>(settings: JQuery.AjaxSettings): Observable<spa_util_http_result_t<_t_>> {
    return new Observable<spa_util_http_result_t<_t_>>(obs => {
      let xhr: JQuery.jqXHR;
      settings.success = rs => obs.next([rs, xhr]);
      settings.error = ex => obs.error(ex);
      settings.complete = () => obs.complete();
      xhr = $.ajax(settings);
      return () => xhr.abort();
    });
  }
}

declare module 'rxjs' {
  namespace operators {
    function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): OperatorFunction<T, R>;
  }
}

const xsrf_token_header: string = 'X-XSRF-TOKEN';
type data_type = 'json' | 'xml' | 'html' | 'script' | 'jsonp' | 'text' | string;