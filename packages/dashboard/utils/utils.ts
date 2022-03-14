let ua: string = ''
export let IS_X5TBS: boolean = false;
if (typeof window !== "undefined") {
  ua = window.navigator.userAgent;
  IS_X5TBS = (/TBS\/\d+/i).test(ua); // 仅X5内核
}

export default {
  ua,
  IS_X5TBS
}
