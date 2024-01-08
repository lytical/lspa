/* @preserve
  (c) 2019 lytical, inc. all rights are reserved.
  lytical(r) is a registered trademark of lytical, inc.
  please refer to your license agreement on the use of this file.
*/

export class spa_util_text {
  from_base64(buf: ArrayBuffer | string): string {
    return atob(this.from_buf(typeof buf === 'string' ? this.to_buf(buf) : buf));
  }

  from_buf(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, <any>new Uint8Array(buf));
  }

  to_base64(buf: ArrayBuffer | string): string {
    return this.from_buf(this.to_buf(btoa(typeof buf === 'string' ? buf : this.from_buf(buf))));
  }

  to_buf(str: string): ArrayBuffer {
    let rt = new Uint8Array(str.length);
    for(var i = 0; i < str.length; ++i)
      rt[i] = str.charCodeAt(i);
    return rt.buffer;
  }
}

export default new spa_util_text();