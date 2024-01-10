///<reference types="@lytical/lmvc"/>
/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

function failed(ex: Error) {
  console.error(ex);
}

function lspa_boot(version = '0.0.5') {
  require(['/api/spa/requirejs-cfg'], (cfg: any) => {
    requirejs.config(cfg);
    require(['@lytical/lspa/app'], (boot: Function) => {
      console.info(`(c) ${new Date(Date.now()).getFullYear()} lytical, inc. all rights are reserved.
lytical(r) is a registered trademark of lytical, inc.
powered by lytical enterprise solutions(tm). https://www.lytical.com
lytical spa version ${version}`);
      boot(version);
}, failed);
  }, failed);
}