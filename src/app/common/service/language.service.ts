import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UrlConfig } from '../../modules/core/classes/config';

const domainId = 'REALCONDITION_MOBILE';
@Injectable({
    providedIn: 'root'
})

export class LanguageService {

    constructor(private http: HttpClient) {
    }

    private get(locale: string) {
        // let url = UrlConfig.baseUrlRealHelpWebApi_Original + `translate/gettranslationsbydomain/REALCONDITION_MOBILE/${locale}/-1`; //+ '?sessionid={AB2E286B-30DB-4627-B99D-09F8BA5100A6}';
        let url = "./assets/mockData/REALCONDITION_MOBILE.json";
        // console.log("urlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurlurl",url);
        return this.http.get(url);
    }

    async translate(attribute: string, translationkey: string, clientId: number = -1): Promise<string> {
        let locale = JSON.parse(localStorage.getItem('RCMOPTIONS'));
        if (locale === null) {
            await this.getRCMOptions();
            locale = JSON.parse(localStorage.getItem('RCMOPTIONS'));
        }
        let lang = locale.Language;
        return new Promise<string>((resolve, reject) => {
            this.get(lang).subscribe((translations: any[]) => {
                if (translations) {
                    const key = `${lang}.${attribute}.${translationkey}.${clientId}`;
                    const translation = translations.find(t => t.TranslationKey === key);

                    if (translation) {
                        console.log('LangugaeService: ' + key + ' , Value: ' + translation.TranslationValue)
                        resolve(translation.TranslationValue);
                    }
                    else resolve(translationkey);
                }
                else reject();
            })
        });
    }

    private async getRCMOptions() {
        const url = UrlConfig.baseUrlRealCondition_Original + 'api/offline/rcmoptions';
        // const url = UrlConfig.baseUrlRealCondition_Original;
        // console.log("+++++",url);
        return new Promise((resolve, reject) => {
            // console.log("+++++++++++++++++++++++++++++++",resolve, "RJ:",reject);
            this.http.get(url)
                .subscribe((data: any) => {
                    console.log("+++++++++++++++++++++++++++++++",data);
                    localStorage.setItem('RCMOPTIONS', JSON.stringify(data));
                    resolve(true)
                }, (error) => { console.log("Error getting rcm options"); reject(error) });
        })
    }
}
