// vanta ships no types, and its UMD bundle's shape after bundler interop is
// not knowable statically — the component resolves the callable at runtime.
declare module "vanta/dist/vanta.fog.min" {
  const mod: unknown
  export default mod
}
