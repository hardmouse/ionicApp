import { NgModule } from '@angular/core';
import { HighlighSearchPipe } from './highligh-search.pipe';
import { TranslatePipe } from './translation.pipe';

@NgModule({
    declarations: [HighlighSearchPipe, TranslatePipe],
    imports: [],
    exports: [HighlighSearchPipe, TranslatePipe],
})

export class PipesModule { }