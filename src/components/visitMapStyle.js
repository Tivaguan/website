import { layersWithCustomTheme } from 'protomaps-themes-base'

// MATCHAI palette mapped onto the Protomaps basemap theme keys.
// Cream land, soft sage water, matcha greenery, warm-white roads with tan
// casings. Label keys are still defined for completeness, but every symbol
// (text) layer is filtered out below so we need no glyph fonts or sprites.
const CASING = '#e4d9c2'
const HALO = '#f6f1e7'

const matchaTheme = {
  background: '#efe7d7',
  earth: '#f4eee2',
  // Recent protomaps themes expect landcover to be a palette object rather
  // than a single colour. Passing a string makes MapLibre receive undefined
  // paint values and reject the entire style.
  landcover: {
    grassland: '#e0ead0',
    barren: '#efe7d7',
    urban_area: '#eee7da',
    farmland: '#e5ecd8',
    glacier: '#f4f1e8',
    scrub: '#dbe7c8',
    forest: '#cfe0b8',
  },
  park_a: '#d8e4c1',
  park_b: '#bcd79f',
  hospital: '#efe4de',
  industrial: '#e9e4d4',
  school: '#efe8d6',
  wood_a: '#d3e0bd',
  wood_b: '#aecb84',
  pedestrian: '#ece4d2',
  scrub_a: '#dbe7c8',
  scrub_b: '#c3d7a6',
  glacier: '#f4f1e8',
  sand: '#efe7d3',
  beach: '#f1e9d3',
  aerodrome: '#e8e3d4',
  runway: '#efe9db',
  water: '#bcd3b4',
  zoo: '#d8e4c1',
  military: '#e7e2d0',
  tunnel_other_casing: '#e7dfcb',
  tunnel_minor_casing: '#e7dfcb',
  tunnel_link_casing: '#e7dfcb',
  tunnel_major_casing: '#e7dfcb',
  tunnel_highway_casing: '#e7dfcb',
  tunnel_other: '#efe8d7',
  tunnel_minor: '#efe8d7',
  tunnel_link: '#efe8d7',
  tunnel_major: '#efe8d7',
  tunnel_highway: '#efe8d7',
  pier: '#e6ddc9',
  buildings: '#e8dfcb',
  minor_service_casing: CASING,
  minor_casing: CASING,
  link_casing: CASING,
  major_casing_late: CASING,
  highway_casing_late: CASING,
  other: '#f3edde',
  minor_service: '#f6f1e6',
  minor_a: '#fbf6ec',
  minor_b: '#ffffff',
  link: '#ffffff',
  major_casing_early: CASING,
  major: '#ffffff',
  highway_casing_early: CASING,
  highway: '#ffffff',
  railway: '#cdc4ad',
  boundaries: '#c9bfa8',
  waterway_label: '#8aa694',
  bridges_other_casing: CASING,
  bridges_minor_casing: CASING,
  bridges_link_casing: CASING,
  bridges_major_casing: CASING,
  bridges_highway_casing: CASING,
  bridges_other: '#f3edde',
  bridges_minor: '#ffffff',
  bridges_link: '#ffffff',
  bridges_major: '#ffffff',
  bridges_highway: '#ffffff',
  roads_label_minor: '#8f8a76',
  roads_label_minor_halo: HALO,
  roads_label_major: '#5c5a49',
  roads_label_major_halo: HALO,
  ocean_label: '#7fa08a',
  peak_label: '#7d7a66',
  subplace_label: '#8a8672',
  subplace_label_halo: HALO,
  city_label: '#39392b',
  city_label_halo: HALO,
  state_label: '#9a927b',
  state_label_halo: HALO,
  country_label: '#39392b',
  address_label: '#9a937f',
  address_label_halo: HALO,
}

export function buildVisitMapStyle() {
  const source = `pmtiles://${window.location.origin}/map/rabat.pmtiles`
  const visibleLabelLayers = new Set([
    'roads_labels_minor',
    'roads_labels_major',
    'places_subplace',
    'places_locality',
  ])
  const layers = layersWithCustomTheme('rabat', matchaTheme, 'fr')
    .filter(
      (layer) =>
        layer.type !== 'symbol' || visibleLabelLayers.has(layer.id),
    )
    .map((layer) => {
      if (layer.type !== 'symbol') return layer

      // Keep labels clean and single-language. The theme's default multiline
      // fallback combines scripts, which produced garbled text in this map.
      return {
        ...layer,
        layout: {
          ...layer.layout,
          'text-field': [
            'coalesce',
            ['get', 'name:fr'],
            ['get', 'name:en'],
          ],
        },
      }
    })

  return {
    version: 8,
    glyphs:
      'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
    sources: {
      rabat: {
        type: 'vector',
        url: source,
        attribution: '© OpenStreetMap contributors',
      },
    },
    // Keep real city and road labels from the local vector data. POI icon
    // layers stay out so the map needs glyphs only, not an external sprite.
    layers,
  }
}
