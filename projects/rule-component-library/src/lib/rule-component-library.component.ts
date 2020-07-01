import { Component, OnInit, NgModule, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'lib-rule-component-library',
  template: `
		<div class="form-group row col-sm-12">
			<label class="col-sm-3 col-form-label col-form-label-sm">Filter condition</label>
			<div class="col-sm-9">
				<span class="condition-sql" [innerHTML]="createSQLCommmand(true)"></span>
			</div>
		</div>

	  <group-component #groupComponent [collection]="conditions" [newData]="newData" [fields]="fields">
		</group-component>
  `,
  styleUrls: ['rule-styles.component.css'],
})
export class RuleComponent implements OnInit {
  
  @Input() newData;
  @Input() conditions;
  @Input() fields;

  constructor() {
    if (this.conditions == null || this.conditions.length === 0) {
      this.conditions = [];
      this.newData = {
        no: this.conditions.length,
        isCondition: false,
        operand: "AND"
      };
      this.conditions.push(this.newData);
    }
    else {
      if (this.conditions.length > 0) {
        this.newData = this.conditions[0];
      }
    }
  }

  ngOnInit(): void {
  }

  createSQLCommmand(withFormat = true) {
    let sql = this.getGroupStatement(this.conditions[0], this.conditions, withFormat);
    return sql;
  }

  getGroupStatement(parent, collection, withFormat) {
    let sql = '';
    let self = this;
    collection.forEach(function (entry) {
      if (entry.parentGroup === parent.no) {
        if (entry.isCondition === false)
          sql += (sql === '' ? '' : (withFormat ? ` <div class="grey-operand">${parent.operand}</div> ` : ` ${parent.operand} `)) + `(${self.getGroupStatement(entry, collection, withFormat)})`;
        else
          sql += (sql === '' ? '' : (withFormat ? ` <div class="grey-operand">${parent.operand}</div> ` : ` ${parent.operand} `)) + self.getConditionStatement(entry, withFormat);
      }
    });
    return sql;
  }

  getConditionStatement(condition, withFormat) {
    return (withFormat ? `<div class="field-sql-condition">${condition.Field}</div>` : condition.Field) + ` ${condition.FieldCondition} ${condition.FieldType === 'String' ? (condition.Blacklist === true ? (withFormat ? ` <div class="red-operand">${this.getBlacklistType(condition)}</div> ` : this.getBlacklistType(condition)) : (condition.FieldCondition != 'Not exists on creditor/client' ? `'` + condition.Values + `'` : '')) : (condition.Blacklist === true ? (withFormat ? ` <div class="red-operand">${this.getBlacklistType(condition)}</div> ` : this.getBlacklistType(condition)) : condition.Values)}`;
  }

  getBlacklistType(condition) {
    return 'Blacklist ' + condition.Field;
  }


}
