/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import type { Subscribable } from 'rxjs';
import { spa_util_http } from '../util/http';

export interface settings {
  user: string;
}

export interface status {
  primary_repos?: boolean;
  syskey?: string;
}

export class app_svc {
  constructor(protected http: spa_util_http = new spa_util_http()) {
  }

  get settings(): Subscribable<settings> {
    return this.http.get<settings>('/api/spa/settings');
  }
}

export default new app_svc();