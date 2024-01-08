/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

import spa_util_text from './text';

export class spa_util_crypto {
  static create_key(id?: string, pwd?: string, domain?: string): PromiseLike<string> {
    return spa_util_crypto.hash(`${domain || ''}${(id || '').trim()}${pwd}`);
  }

  static async hash(buf: string | ArrayBuffer, algo: string = 'SHA-512'): Promise<string> {
    return typeof buf === 'string' ?
      spa_util_text.to_base64(await window.crypto.subtle.digest(algo, spa_util_text.to_buf(buf))) :
      spa_util_text.to_base64(await window.crypto.subtle.digest(algo, buf));
  }
}