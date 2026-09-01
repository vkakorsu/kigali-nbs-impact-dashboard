/**
 * Coordinate handling for Rwanda's national grid.
 *
 * Rwanda's national CRS is ITRF2005 / TM Rwanda: a custom transverse
 * Mercator with central meridian 30 degrees east, scale factor 0.9999,
 * false easting 500,000 m, false northing 5,000,000 m, on the GRS80
 * ellipsoid. It has no EPSG code. Approved RFA and FMES spatial data
 * typically arrive in this grid.
 *
 * The ITRF2005 datum and WGS84 agree at the centimetre level, far below
 * the accuracy any communication dashboard needs, so consuming national
 * spatial data is a projection inversion, implemented here with the
 * standard Krueger series. The dashboard serves WGS84 (EPSG:4326)
 * GeoJSON, the web standard, and this module documents and performs the
 * transformation on ingest.
 *
 * Equivalent proj4 definition, for GIS teams:
 * +proj=tmerc +lat_0=0 +lon_0=30 +k=0.9999 +x_0=500000 +y_0=5000000
 * +ellps=GRS80 +units=m +no_defs
 */

// GRS80 ellipsoid
const a = 6378137.0;
const f = 1 / 298.257222101;

// TM Rwanda projection parameters
const LON0 = 30.0; // central meridian, degrees
const K0 = 0.9999; // scale factor
const FE = 500000.0; // false easting, metres
const FN = 5000000.0; // false northing, metres

const n = f / (2 - f);
const A1 = (a / (1 + n)) * (1 + (n * n) / 4 + (n * n * n * n) / 64);

const alpha = [
  n / 2 - (2 / 3) * n * n + (5 / 16) * n * n * n,
  (13 / 48) * n * n - (3 / 5) * n * n * n,
  (61 / 240) * n * n * n,
];
const beta = [
  n / 2 - (2 / 3) * n * n + (37 / 96) * n * n * n,
  (1 / 48) * n * n + (1 / 15) * n * n * n,
  (17 / 480) * n * n * n,
];
const delta = [
  2 * n - (2 / 3) * n * n - 2 * n * n * n,
  (7 / 3) * n * n - (8 / 5) * n * n * n,
  (56 / 15) * n * n * n,
];

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const e = Math.sqrt(f * (2 - f));

/** Forward: WGS84 latitude and longitude (degrees) to TM Rwanda easting and northing (metres). */
export function wgs84ToTmRwanda(lat, lon) {
  const phi = lat * D2R;
  const lambda = (lon - LON0) * D2R;

  const t = Math.sinh(
    Math.atanh(Math.sin(phi)) - e * Math.atanh(e * Math.sin(phi))
  );
  const xiPrime = Math.atan2(t, Math.cos(lambda));
  const etaPrime = Math.atanh(Math.sin(lambda) / Math.sqrt(1 + t * t));

  let xi = xiPrime;
  let eta = etaPrime;
  for (let j = 0; j < 3; j++) {
    xi += alpha[j] * Math.sin(2 * (j + 1) * xiPrime) * Math.cosh(2 * (j + 1) * etaPrime);
    eta += alpha[j] * Math.cos(2 * (j + 1) * xiPrime) * Math.sinh(2 * (j + 1) * etaPrime);
  }

  return {
    easting: FE + K0 * A1 * eta,
    northing: FN + K0 * A1 * xi,
  };
}

/** Inverse: TM Rwanda easting and northing (metres) to WGS84 latitude and longitude (degrees). */
export function tmRwandaToWgs84(easting, northing) {
  const xi = (northing - FN) / (K0 * A1);
  const eta = (easting - FE) / (K0 * A1);

  let xiPrime = xi;
  let etaPrime = eta;
  for (let j = 0; j < 3; j++) {
    xiPrime -= beta[j] * Math.sin(2 * (j + 1) * xi) * Math.cosh(2 * (j + 1) * eta);
    etaPrime -= beta[j] * Math.cos(2 * (j + 1) * xi) * Math.sinh(2 * (j + 1) * eta);
  }

  const chi = Math.asin(Math.sin(xiPrime) / Math.cosh(etaPrime));
  let phi = chi;
  for (let j = 0; j < 3; j++) {
    phi += delta[j] * Math.sin(2 * (j + 1) * chi);
  }

  const lambda = Math.atan2(Math.sinh(etaPrime), Math.cos(xiPrime));
  return {
    lat: phi * R2D,
    lon: LON0 + lambda * R2D,
  };
}
