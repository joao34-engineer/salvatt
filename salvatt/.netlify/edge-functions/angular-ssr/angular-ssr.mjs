
  import "./polyfill.mjs";
  
    import { netlifyAppEngineHandler } from "../../../dist/salvatt/server/server.mjs";
    import "./fixup-event.mjs";

    export default netlifyAppEngineHandler;
    
  export const config = {
    path: "/*",
    excludedPath: ["/.netlify/*","/favicon.ico","/index.csr.html","/index.html","/main-HTEYOHUU.js","/polyfills-5CFQRCPP.js","/styles-5INURTSO.css","/"],
    generator: "@netlify/angular-runtime@3.0.0",
    name: "Angular SSR",
    cache: "manual",
  };
  