/* @preserve
  (c) 2023 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { controller } from '@lytical/lmvc/controller';
import { spa_ctrl_dropdown } from './dropdown';

@controller({ html: '@lytical/lspa/ctrl/dropdown-nav.html' })
export class spa_ctrl_dropdown_nav extends spa_ctrl_dropdown {
  $ready() {
    super.$ready();
    let el = (<HTMLElement>this.$scope.node).querySelector('.l-dropdown-trigger');
    if(el) {
      el.classList.add('dropdown-toggle');
      el.classList.add('nav-link');
    }
  }
}