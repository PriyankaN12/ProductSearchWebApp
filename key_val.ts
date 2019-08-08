
import { FormControl } from '@angular/forms';

export function ValidateKey(key: FormControl)  {
  // console.log(key.value);
  if(!(key.value && key.value.trim())){
    return{ keyVal: true}
  }
  return null;
}
export function ValidateZip(zip: FormControl){
  if(!zip.disabled){
    var reg=RegExp('[0-9]{5}');
    if(!zip.value || !reg.test(zip.value) || zip.value.length!=5)
    return{zipVal:true}
  }
  return null;
}
