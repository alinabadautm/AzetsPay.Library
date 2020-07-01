import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewContainerRef, ChangeDetectorRef, ComponentFactoryResolver} from '@angular/core';
import { FilterConditionComponent } from './condition.component';
import { group } from '@angular/animations';

@Component({
    selector: 'group-component',
    templateUrl: 'group.component.html',
})
export class GroupConditionComponent implements OnInit {
    @Input() newdata;
    @Input() collection;
    @Input() currencies;
    @Input() countries;
    @Output("deleteGroup") deleteGroup: EventEmitter<any> = new EventEmitter();


    @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

    constructor(private r: ComponentFactoryResolver,
        private ref: ChangeDetectorRef) {
          
        this.initializeComponents();
    } 

    initializeComponents() {
        if (this.collection != null) {
            const children = this.collection.filter(data => data.parentGroup === this.newdata.no);
            if (children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].isCondition === false)
                        this.addGroup(null, children[i]);
                    else
                        this.addCondition(null, children[i]);
                }
            }
        }
    }


    ngOnInit() {
    }

    addCondition(e, newChild = null) {
        const factory = this.r.resolveComponentFactory(FilterConditionComponent);
        let  max = Math.max.apply(Math, this.collection.map(function (o: { no: any; }) { return o.no; }));
        const newData = newChild == null? {
            no: this.collection.length > 0 ? max + 1 : 0,
            isCondition: true,
            parentGroup: this.newdata.no,
            Field: "",
            FieldType: "",
            FieldCondition: "",
            Values: "",
            Blacklist : false
        } : newChild;

        if (newChild == null) {

            let indexParent = (this.collection.filter((item) => {
                return item.no === newData.parentGroup;
            }))[0];
            this.collection.splice(this.collection.indexOf(indexParent) + 1, 0, newData);
        }
        const ref: any = this.vc.createComponent(factory, 0);
        let self = this;
        ref.instance.collection = this.collection;
        ref.instance.newdata = newData;
        ref.instance.countries = this.countries;
        ref.instance.currencies = this.currencies;
        ref.instance.deleteFunction.subscribe(val => {
            const index = ref.instance.collection.indexOf(ref.instance.newdata);
            if (index > -1) {
                ref.instance.collection.splice(index, 1);
            }
            ref.destroy();
        });
    }

    addGroup(e, newChild = null) {
        const factory = this.r.resolveComponentFactory(GroupConditionComponent);
        let max = Math.max.apply(Math, this.collection.map(function (o: { no: any; }) { return o.no; }));
        const newData = newChild == null ? {
            no: this.collection.length > 0 ? max + 1 : 0,
            isCondition: false,
            parentGroup: this.newdata.no,
            operand: "AND"
        } : newChild;
        if (newChild == null)
            this.collection.push(newData);
        const ref: any = this.vc.createComponent(factory);
        let self = this;
        ref.instance.collection = this.collection;
        ref.instance.newdata = newData;
        ref.instance.countries = this.countries;
        ref.instance.currencies = this.currencies;
        ref.instance.deleteGroup.subscribe(val => {
            let groupstodelete = [ref.instance.newdata.no];
            let i = 0;
            let limit = ref.instance.collection.length;
            while (i < ref.instance.collection.length) {
               
                let entry = ref.instance.collection[i];

                if (entry.no === ref.instance.newdata.no) {
                    ref.instance.collection.splice(i, 1);
                    limit = limit - 1;
                }
                else
                    if (groupstodelete.includes(entry.parentGroup)) {
                        if (entry.isCondition === false)
                            groupstodelete.push(entry.no);
                        ref.instance.collection.splice(i, 1);
                        limit = limit - 1;
                    }
                    else
                        i = i + 1;
            }
            ref.destroy();
        });
    }


    clickOp(e) {
        let btns = e.target.parentElement.querySelectorAll('.op-button');

        if (btns[0].classList.contains('btn-secondary')) {
            btns[0].classList.add('btn-light');
            btns[0].classList.remove('btn-secondary');

            btns[1].classList.remove('btn-light');
            btns[1].classList.add('btn-secondary');
            this.newdata.operand = "OR";
        }
        else {
            btns[1].classList.add('btn-light');
            btns[1].classList.remove('btn-secondary');

            btns[0].classList.remove('btn-light');
            btns[0].classList.add('btn-secondary');
            this.newdata.operand = "AND";
        }
    }

    delete(e) {
        this.deleteGroup.emit(e);
    }
  
}
