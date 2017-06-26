import Base from './base';

export default class Service extends Base {
  request(options) {
    const {http, Headers} = this.connection;

    if(!http || !Headers) {
      throw new Error(`Please pass an object with angular's 'http' (instance) and 'Headers' (class) to feathers-rest`);
    }

    const config = {
      method: options.method,
      body: options.body,
      headers: new Headers(
        Object.assign(
          {Accept: 'application/json'},
          this.options.headers,
          options.headers
        )
      )
    };

    /* (from Angular docs - https://angular.io/api/http/RequestOptionsArgs)
      interface RequestOptionsArgs {
         url: string|null
         method: string|RequestMethod|null
         search: string|URLSearchParams|{[key: string]: any | any[]}|null
         params: string|URLSearchParams|{[key: string]: any | any[]}|null
         headers: Headers|null
         body: any
         withCredentials: boolean|null
         responseType: ResponseContentType|null
       }
     */

    return new Promise((resolve, reject) => {
      http.request(options.url, config)
        .subscribe(resolve, reject);
    })
      .then(res => res.json())
      .catch(error => {
        const response = error.response || error;

        throw response instanceof Error ? response : (response.data || response);
      });
  }
}
