///<reference types="@lytical/lmvc"/>
/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

const version = '0.0.0';

function failed(ex: Error) {
  console.error(ex);
}

require(['/api/spa/requirejs-cfg'], (cfg: any) => {
  requirejs.config(cfg);
  require(['@lytical/lspa/app'], () => console.info(`(c) ${new Date(Date.now()).getFullYear()} lytical, inc. all rights are reserved.
lytical(r) is a registered trademark of lytical, inc.
powered by lytical enterprise solutions(tm). https://www.lytical.com
lytical client version ${version}`), failed);
}, failed);