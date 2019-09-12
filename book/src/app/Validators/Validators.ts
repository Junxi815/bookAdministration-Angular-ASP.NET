import { ValidatorFn, FormArray } from '@angular/forms';

export function minSelectedCheckboxes(min=1):ValidatorFn{
    return (categories:FormArray)=>{
        let totalSelected = categories.controls
            .map(control=>control.value)
            .reduce((total,current)=>current?total+current:total,0);
        return totalSelected>=min?null:{minChecked:{requiredChecked:min,acturalChecked:totalSelected}};
    }
}