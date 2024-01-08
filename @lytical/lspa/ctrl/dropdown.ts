/* @preserve
  (c) 2023 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { controller } from '@lytical/lmvc/controller';
import type { lmvc_controller_t, lmvc_model_t, lmvc_scope_t } from '@lytical/lmvc/type';

@controller({ html: '@lytical/lspa/ctrl/dropdown.html' })
export class spa_ctrl_dropdown implements lmvc_controller_t {
  $dispose(): void | Promise<any> {
    this.observer?.disconnect();
  }
  
  $ready() {
    let for_id: string | undefined;
    let el = (<HTMLElement>this.$scope.node).querySelector('.l-dropdown-trigger');
    if(el) {
      el.classList.add('dropdown-toggle');
      el.setAttribute('data-bs-toggle', 'dropdown');
      for_id = el.id;
    }
    el = (<HTMLElement>this.$scope.node).querySelector('.l-dropdown-list');
    if(el) {
      el.classList.add('dropdown-menu');
      if(for_id) {
        el.setAttribute('aria-labelledby', for_id);
      }
      this.update_items(el);
      this.observer = new MutationObserver(() => this.update_items(el!));
      this.observer.observe(el, { childList: true, subtree: true });
    }
  }

  private update_items(el: Element) {
    for(let i = 0, max = el.children.length; i < max; ++i) {
      (<HTMLElement>el.children.item(i)).querySelector('a,button')?.classList.add('dropdown-item', 'clickable');
    }
  }
  
  $model = {};
  private observer?: MutationObserver;
  $scope!: lmvc_scope_t<lmvc_model_t>;
  $view = [];
}