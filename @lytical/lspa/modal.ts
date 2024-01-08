/* @preserve
  (c) 2021 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { Subject } from 'rxjs';
import { Modal } from 'bootstrap';
import type { lmvc_controller_t, lmvc_scope_t } from '@lytical/lmvc/type';

export type spa_modal_event<_t_ extends lmvc_controller_t> = Subject<['hidden' | 'hide' | 'show' | 'shown', _t_]>;

export class spa_modal {
  pop() {
    if(this.modal.length) {
      this.modal[this.modal.length - 1][1].hide();
    }
  }

  async push<_t_ extends lmvc_controller_t>(modal_id: string, parent: lmvc_controller_t<any>, option?: Partial<Modal.Options>): Promise<[_t_, spa_modal_event<_t_> | undefined]> {
    let node = window.document.createElement('div');
    node.setAttribute(modal_id, '');
    const scope = await parent.$scope!.app.load_scope(node, parent);
    return [<any>scope.view[0], this.push_scope(scope, option)];
  }

  private push_scope<_t_ extends lmvc_controller_t>(scope: lmvc_scope_t, option?: Partial<Modal.Options>) {
    if(this.modal.length) {
      this.modal[this.modal.length - 1][1].hide();
    }
    const el = <Element>scope.node;
    let modal = new Modal(el, option);
    this.modal.push([scope, modal]);
    let rt: spa_modal_event<_t_> = new Subject<['hidden' | 'hide' | 'show' | 'shown', _t_]>();
    const ctlr: _t_ = <any>scope.view[0];
    const hide = () => rt.next(['hide', ctlr]);
    const show = () => rt.next(['show', ctlr]);
    const shown = () => {
      el.querySelector<HTMLInputElement>('[autofocus]')?.focus();
      rt.next(['shown', ctlr]);
    }
    const hidden = () => {
      if(this.modal[this.modal.length - 1][1] === modal) {
        el.removeEventListener('hidden.bs.modal', hidden);
        el.removeEventListener('hide.bs.modal', hide);
        el.removeEventListener('show.bs.modal', show);
        el.removeEventListener('shown.bs.modal', shown);
        this.modal.pop();
        scope.app.destroy_scope(scope).catch(ex => console.error(ex));
      }
      rt.next(['hidden', ctlr]);
    };
    el.addEventListener('hidden.bs.modal', hidden);
    el.addEventListener('hide.bs.modal', hide);
    el.addEventListener('show.bs.modal', show);
    el.addEventListener('shown.bs.modal', shown);
    modal.show();
    return rt;
  }

  get new_id() {
    return ++this.id;
  }

  private modal: [lmvc_scope_t, Modal][] = [];
  private id = 0;
}

export default new spa_modal();