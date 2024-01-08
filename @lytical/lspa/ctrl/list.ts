/* @preserve
  (c) 2023 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import type { Observer } from 'rxjs';
import type { lmvc_controller_t, lmvc_scope_t } from '@lytical/lmvc/type';

export interface spa_ctrl_list_model<_t_> {
    event?: Observer<[_t_, number?, string?]>;
    list?: _t_[];
    selected?: _t_;
}

export class spa_ctrl_list<_t_> implements lmvc_controller_t<spa_ctrl_list_model<_t_>> {
    select(item: _t_, index?: number, event?: string) {
        this.$model.selected = item;
        if(this.$model.event) {
            this.$model.event.next([item, index, event]);
        }
    }

    $model: spa_ctrl_list_model<_t_> = {};
    $scope?: lmvc_scope_t;
    $view = [];
}