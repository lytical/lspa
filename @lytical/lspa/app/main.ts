/* @preserve
  (c) 2020 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import { spa_util_http } from '../util/http';
import lmvc_app from '@lytical/lmvc/app';

export default (version: string) => {
  spa_util_http.init(version);
  lmvc_app
    .bootstrap()
    .catch(ex => {
      console.error(ex);
      alert('failed to bootstrap the application. please check the console log for details.');
    })
}