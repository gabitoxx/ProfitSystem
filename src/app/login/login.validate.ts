import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ValidatorUtils } from '../shared/_utils/validator-utils';

export class LoginValidacion extends ValidatorUtils {

  /** Formularios */
  public rsForm: FormGroup;

  /** The FormBuilder */
  public formBuilder: FormBuilder;

  constructor(){
      super();
      this.formBuilder = new FormBuilder();
  }

    public getGroupValidator() {
      this.rsForm = this.formBuilder.group({
        email: this.getValidationRequired(),
      });
    }
}