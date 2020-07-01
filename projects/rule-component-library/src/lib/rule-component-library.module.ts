import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RuleComponent } from './rule-component-library.component';
import { FilterConditionComponent } from './logic-filter/condition.component';
import { GroupConditionComponent } from './logic-filter/group.component'
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    FilterConditionComponent,
    GroupConditionComponent,
    RuleComponent  
  ],
  entryComponents: [
    FilterConditionComponent,
    GroupConditionComponent    
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbDropdownModule,
    NgbModule
  ],
  exports: [RuleComponent]
})
export class RuleComponentLibraryModule { }
