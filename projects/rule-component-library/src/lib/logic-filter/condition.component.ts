import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'condition-component',
	  templateUrl: 'condition.component.html',    
})
export class FilterConditionComponent implements OnInit {
	@Input() newdata;
	@Input() collection;
	@Input() currencies;
	@Input() countries;
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
		if (this.newdata != null) {
			if (this.newdata.Field === "Creditor bank country") {
				this.countrySelection = this.newdata.Values.split(",");
			}

			if (this.newdata.Field === "Currency") {
				this.currencySelection = this.newdata.Values.split(",");
			}
		}
	}

    isNumericField(field) {
        return ["Amount to pay", "Total amount"].includes(field);
    }

    isTextField(field) {
        return ["Creditor organization number", "Creditor bank country", "Creditor bank account", "Currency"].includes(field);
	}

	isBlacklistField(field) {
		return ["Creditor organization number", "Creditor bank country", "Creditor bank account"].includes(field);
	}

	changeField(e) {
		this.newdata.Field = e.target.innerHTML;
		this.newdata.Blacklist = false;
		this.newdata.FieldType = this.isTextField(e.target.innerHTML) ? 'String' : this.isNumericField(e.target.innerHTML) ? 'Numeric' : 'Boolean';
		this.fieldDrop.toggle();
		e.preventDefault();
	}

	changeCurrency(e) {
		this.newdata.Values = e.map(a => a.CurrencyCode).join(",");
	}

	changeCountry(e) {
		this.newdata.Values = e.map(a => a.CountryCode).join(",");
	}
	
	changeBlacklist(e) {
		this.newdata.Blacklist = e.target.checked;
		if (e.target.checked === true && ["Creditor bank country", "Currency"].includes(this.newdata.Field) === false)
			this.newdata.Values = "";
		if (e.target.checked === true)
			this.newdata.FieldCondition = '=';
	}

	changeCondition(e) {
		this.newdata.FieldCondition = e.target.textContent;
		if (['Not exists on creditor/client', 'Greater than maximum amount on creditor'].includes(this.newdata.FieldCondition) === true)
			this.newdata.Values = "";
		this.conditionDrop.toggle();
		e.preventDefault();
	}

	delete(e) {
		this.deleteFunction.emit(e);
	}

}
