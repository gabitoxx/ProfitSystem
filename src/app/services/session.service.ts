import { Injectable } from "@angular/core";

@Injectable()
export class SessionService {

    onSetItemJSON( key: string, value: any ){
        sessionStorage.setItem(key, JSON.stringify(value));
    }

    onGetItemJSON( key: string ) {
       return JSON.parse(sessionStorage.getItem(key));
    }

    onSetItem( key: string, value: any ){
        sessionStorage.setItem(key, value);
    }

    onGetItem( key: string ) {
       return sessionStorage.getItem(key);
    }

    onExistItem( key: string ) {
        if(sessionStorage.getItem(key)){
            return true;
        }else{
            return false;
        }
    }

    onRemoveItem( key: string ){
        sessionStorage.removeItem(key);
    }

    onRemoveSession(){
        sessionStorage.clear();
    }

}