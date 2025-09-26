
  import process from "node:process"

  globalThis.process = process
  globalThis.DenoEvent = globalThis.Event // storing this for fixup-event.mjs
  