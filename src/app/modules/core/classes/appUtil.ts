export class AppUtil {

    static isNullOrUndefined(value: any): boolean {
        return value == null || typeof (value) === 'undefined';
      }
    
    static isNullOrUndefinedOrWhitespace(value?: string | null): boolean {
      return value == null || typeof (value) === 'undefined' || value.toString().trim() === '';
    }

    static extractQueryStringFromFullUrl = (url: string) : string =>
    {
      let result : string = '';
      if( !AppUtil.isNullOrUndefinedOrWhitespace(url) )
      {
        result = url.substring(url.indexOf('?'), url.length); 
      }
  
      return result;
    }

    static jsonAsQueryString = (parms: any): string =>
    {
        let queryString: string = "?";
        for (let key in parms)
        {
            if (queryString.length > 1)
            {
                queryString += "&";
            }
            queryString += key;
            queryString += "=";
            queryString += encodeURIComponent(parms[key]);
        }

        return queryString;
    } 
}