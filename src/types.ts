export interface location {
  address: string
  addressElements: Array<any>
  x: number
  y: number
}
declare global {
  interface Window {
    Kakao: any
    naver: any
  }
}
declare let naver: any
