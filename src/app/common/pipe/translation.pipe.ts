import { Pipe, PipeTransform } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from '../service/language.service';

@Pipe({
    name: 'apptranslate',
    //pure: false
})
export class TranslatePipe implements PipeTransform {

    constructor(private languageService: LanguageService) {

    }

    subject = new BehaviorSubject<string>('');
    transform(value: any, attribute: string = '') {
        if (attribute === '') return value;
        console.log('PIPE Attribute: ' + attribute + ', Pipe Value: ' + value)

        this.languageService.translate(attribute, value).then(t => {
            if (t) this.subject.next(t)
            else this.subject.next(value)
        });

        return this.subject;
    }

}