/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { view } from '@lytical/lmvc/view';
import type { Observable, SubscriptionLike } from 'rxjs';
import type { lmvc_scope_t, lmvc_view_t } from '@lytical/lmvc/type';

@view()
export class spa_popover implements lmvc_view_t {
  $dispose() {
    if(this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  $ready() {
    this.$scope!.node.parentNode?.removeChild(this.$scope!.node);
    if(this.$value) {
      const evt = <Observable<spa_popover_event> | undefined>this.$scope!.controller.$model[this.$value];
      if(evt && typeof evt.subscribe === 'function') {
        this.subscription = (<Observable<spa_popover_event>>evt).subscribe(
          msg => {
            if(!spa_popover.target) {
              this.show(msg || {}, this.$scope!.node);
            }
            else {
              $(spa_popover.target).popover('dispose');
              this.show(msg || {}, this.$scope!.node);
            }
          });
      }
      else {
        console.warn('spa:popover missing subject name or the name does not identify a observable. use spa:popover="<subject-name>"');
      }
    }
  }

  private show(msg: spa_popover_event, _content: Node) {
    spa_popover.target = msg.target;
    //this.content = content;
    if(spa_popover.target) {
      const target = $(spa_popover.target);
      // target.popover(Object.assign(msg.options || {}, <PopoverOption>{
      //   content: this.content,
      //   html: true
      // }));
      target.popover('show');
      setTimeout(() => target.popover('update'));
    }
  }

  //private content?: Node;
  subscription?: SubscriptionLike;
  private static target?: EventTarget;
  $scope?: lmvc_scope_t;
  $value?: string;
}

export interface spa_popover_event {
  target?: EventTarget;
  //options?: PopoverOption;
}