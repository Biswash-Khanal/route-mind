/**
 * Reserved map panel.
 *
 * A real map engine is not wired up yet. Rather than drop an empty box into the
 * layout, this fills the space the map will occupy so the page has no visual
 * hole, and so nothing reflows when one is added.
 *
 * The dotted grid stands in for street geometry; the four markers echo the
 * accent colours used for transit and walking elsewhere in the UI.
 */
const MapView = () => (
  <div className="flex flex-col">
    <div className="relative flex h-96 flex-col justify-between overflow-hidden rounded-t-lg border border-b-0 border-dashed border-stone bg-surface p-5">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage:
            "radial-gradient(var(--stone) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative flex items-start justify-between">
        <span className="eyebrow">Map</span>
        <span className="rounded-full border border-dashed border-stone px-2 py-0.5 font-mono text-caption tracking-[0.1em] uppercase text-stone">
          Preview
        </span>
      </div>

      {/* Stand-in markers, positioned to suggest a spread of stops. */}
      <div aria-hidden="true" className="absolute inset-0">
        <span className="absolute top-[32%] left-[26%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transit-500 ring-4 ring-surface" />
        <span className="absolute top-[46%] left-[58%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-transit-500 ring-4 ring-surface" />
        <span className="absolute top-[68%] left-[38%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-walk-500 ring-4 ring-surface" />
        <span className="absolute top-[74%] left-[74%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-walk-500 ring-4 ring-surface" />
        <span
          aria-hidden="true"
          className="absolute top-[32%] left-[26%] size-3 translate-x-8 translate-y-8 rounded-full border-2 border-dashed border-transit-400 bg-transparent"
        />
      </div>

      <p className="relative max-w-56 text-caption text-slate">
        Interactive map rendering is not connected yet. Stop coordinates are
        already stored, so it drops straight in.
      </p>
    </div>
  </div>
);

export default MapView;