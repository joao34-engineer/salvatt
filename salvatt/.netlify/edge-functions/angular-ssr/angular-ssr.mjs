
  import "./polyfill.mjs";
  
    import { netlifyAppEngineHandler } from "../../../dist/salvatt/server/server.mjs";
    import "./fixup-event.mjs";

    export default netlifyAppEngineHandler;
    
  export const config = {
    path: "/*",
    excludedPath: ["/.netlify/*","/chunk-3WDNQXU7.js","/chunk-5RCDSBKA.js","/chunk-6MFRPE66.js","/chunk-B5R66523.js","/chunk-G2VAZVC3.js","/chunk-JBGLM4FU.js","/chunk-P73QDRGV.js","/chunk-UDUM7RRO.js","/chunk-YD5VQDMT.js","/env.js","/favicon.ico","/index.csr.html","/index.html","/main-M7HG3TPN.js","/polyfills-5CFQRCPP.js","/styles-5INURTSO.css","/"],
    generator: "@netlify/angular-runtime@3.0.0",
    name: "Angular SSR",
    cache: "manual",
  };
  