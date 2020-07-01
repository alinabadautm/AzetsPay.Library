import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'condition-component',
	  templateUrl: 'condition.component.html',    
})
export class FilterConditionComponent implements OnInit {
  @Input() newData;
	@Input() collection;
	@Input() fields;
	@Output("deleteFunction") deleteFunction: EventEmitter<any> = new EventEmitter();

	@ViewChild("fieldDrop")
	private fieldDrop: NgbDropdown;

	@ViewChild("conditionDrop")
	private conditionDrop: NgbDropdown;

	public currencySelection;
	public countrySelection;

  constructor(public changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  isNumericField(field) {
    let fieldInArray = this.fields.filter(a => a.name === field);
    return fieldInArray.length > 0 ? fieldInArray[0].type === "Numeric" : false;
  }

  isTextField(field) {
    let fieldInArray = this.fields.filter(a => a.name === field);
    return fieldInArray.length > 0 ? fieldInArray[0].type === "Text" : true;
  }

  isBlacklistField(field) {
    let fieldInArray = this.fields.filter(a => a.name === field);
    return fieldInArray.length > 0 ? fieldInArray[0].blacklist === true : false;
	}

	changeField(e) {
    this.newData.Field = e.target.innerHTML;
    this.newData.Blacklist = false;
    this.newData.FieldType = this.isTextField(e.target.innerHTML) ? 'String' : 'Numeric';
		this.fieldDrop.toggle();
		e.preventDefault();
	}

  changeBlacklist(e) {
    this.newData.Blacklist = e.target.checked;
    if (e.target.checked === true) {
      this.newData.Values = "";
      this.newData.FieldCondition = '=';
    }
  }

	changeCondition(e) {
    this.newData.FieldCondition = e.target.textContent;
		this.conditionDrop.toggle();
		e.preventDefault();
	}

	delete(e) {
		this.deleteFunction.emit(e);
	}

}
