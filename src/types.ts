export interface location {
  address: string
  addressElements: Array<any>
  x: number
  y: number
}
declare global {
  interface Window {
    naver: any
  }
}
declare let naver: any
