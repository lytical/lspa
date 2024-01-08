/* @preserve
(c) 2020 lytical, inc. all rights are reserved.
lytical(r) is a registered trademark of lytical, inc.
please refer to your license agreement on the use of this file.
*/

import { controller } from '@lytical/lmvc/controller';
import type { lmvc_controller_t, lmvc_scope_t } from '@lytical/lmvc/type';

class form_item_model {
  caption?: string;
  for_id?: string;
  invalid_msg?: string;
  is_touched: boolean = false;
  is_dirty: boolean = false;
  is_valid: boolean = true;
  get is_pristine() { return !this.is_dirty; }
  get is_invalid() { return !this.is_valid; }
  get is_untouched() { return !this.is_touched; }
}

export const reset_evt = new Event('reset');

@controller({ html: '@lytical/lspa/form/item.html' })
export class spa_form_item implements lmvc_controller_t<form_item_model> {
  $mount() {
    const el = this.$el;
    if(el) {
      if(el.id) {
        this.$model.for_id = el.id;
      }
      if(!this.on_blur) {
        const is_valid = () => typeof el.checkValidity === 'function' ? el.checkValidity() : true;
        this.on_blur = () => {
          this.$model.is_touched = true;
          this.$model.is_valid = is_valid();
        };
        this.on_input = () => {
          this.$model.is_dirty = true;
          this.$model.is_valid = is_valid();
        };
        this.on_invalid = () => {
          this.$model.is_valid = false;
        };
        this.on_reset = () => {
          this.$model.is_touched = false;
          this.$model.is_dirty = false;
          this.$model.is_valid = is_valid();
        };
      }
      el.addEventListener('blur', this.on_blur);
      el.addEventListener('input', this.on_input);
      el.addEventListener('invalid', this.on_invalid);
      el.addEventListener('reset', this.on_reset);
      el.dispatchEvent(reset_evt);
    }
  }

  $unmount?() {
    const el = this.$el;
    if(el) {
      el.removeEventListener('blur', this.on_blur);
      el.removeEventListener('input', this.on_input);
      el.removeEventListener('invalid', this.on_invalid);
      el.removeEventListener('reset', this.on_reset);
    }
  }

  on_blur!: () => void;
  on_input!: () => void;
  on_invalid!: () => void;
  on_reset!: () => void;

  get $el() {
    return <HTMLInputElement>(<Element>this.$scope!.node).querySelector(`#${this.$model.for_id},input,select,textarea`);
  }

  $model = new form_item_model();
  $scope?: lmvc_scope_t;
  $view = [];
}