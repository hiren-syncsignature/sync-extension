/* eslint-disable @typescript-eslint/no-explicit-any */
export interface UserObject {
    id: string;
    email?: string;
    name?: string;
    [key: string]: any;
  }
  
  export interface Signature {
    html: string;
    [key: string]: any;
  }
  
  export interface SignaturesResponse {
    html: Signature[];
  }
  
  export interface SelectedSignature {
    index: number;
    content: string;
    timestamp: number;
  }