const fs = require("fs");

const COLORSCALES = require("./colorscales");

const SURFACE_LEVEL_PARAMS = [
  {
    variable: "2t",
    name: "temperature",
    desc: "2 metre Temperature",
    colorscale: "temperature",
  },
  { variable: "tp", name: "total_precipitation", desc: "Total Precipitation" },
  {
    variable: "msl",
    name: "mean_sea_level_pressure",
    desc: "Mean Sea Level Pressure",
    colorscale: "mslp",
  },
  { variable: "10u", name: "u_wind", desc: "10 metre U wind component" },
  { variable: "10v", name: "v_wind", desc: "10 metre V wind component" },
  { variable: "wind_speed", name: "wind_speed", desc: "Wind Speed" },
];

const PRESSURE_LEVELS = [1000, 925, 850, 700, 500, 300, 250, 200, 50];

const PRESSURE_LEVELS_PARAMS = [
  { variable: "d", name: "divergence", desc: "Divergence" },
  { variable: "gh", name: "geopotential_height", desc: "Geopotential Height" },
  { variable: "q", name: "specific_humidity", desc: "Specific humidity" },
  { variable: "r", name: "relative_humidity", desc: "Relative humidity" },
  {
    variable: "t",
    name: "temperature",
    desc: "Temperature",
    colorscale: "temperature",
  },
  { variable: "u", name: "u_wind", desc: "U Component of Wind" },
  { variable: "v", name: "v_wind", desc: "V Component of Wind" },
  { variable: "wind_speed", name: "wind_speed", desc: "Wind Speed" },
  { variable: "vo", name: "vorticity", desc: "Vorticity (relative)" },
];

const CONFIG = {
  service_config: {
    ows_hostname: "",
    ows_protocol: "",
    mas_address: "",
    worker_nodes: [],
  },
  layers: [],
  processes: [],
};

SURFACE_LEVEL_PARAMS.forEach((param) => {
  const prefix = "oper_fc";
  const suffix = "sfc";

  const namespace = `${prefix}_${param.name}_${suffix}`;
  const dataSource = `/gskydata/ecmwf-forecast/${namespace}`;

  const layer = {
    name: namespace,
    title: `${param.desc} at Surface Level`,
    data_source: dataSource,
    time_generator: "mas",
    rgb_products: [namespace],
  };

  if (param.colorscale && COLORSCALES[param.colorscale]) {
    Object.assign(layer, COLORSCALES[param.colorscale]);
  }

  const process = {
    data_sources: [
      {
        data_source: dataSource,
        rgb_products: [namespace],
        metadata_url: "/templates/WPS/date_value.tpl",
      },
    ],
    identifier: namespace,
    title: `${namespace} Geometry Drill`,
    abstract: "",
    max_area: 10000,
    pixel_stat: "mean",
    complex_data: [
      {
        identifier: "geometry",
        title: "Geometry",
        abstract: "",
        mime_type: "application/vnd.geo+json",
        schema: "http://geojson.org/geojson-spec.html",
        min_occurs: 1,
      },
    ],
    literal_data: [
      {
        identifier: "geometry_id",
        title: "Geometry ID",
      },
    ],
  };

  CONFIG.layers.push(layer);
  CONFIG.processes.push(process);
});

PRESSURE_LEVELS_PARAMS.forEach((param) => {
  const prefix = "oper_fc";
  PRESSURE_LEVELS.forEach((pLevel) => {
    const suffix = `pl_${pLevel}`;

    const namespace = `${prefix}_${param.name}_${suffix}`;
    const dataSource = `/gskydata/ecmwf-forecast/${namespace}`;

    const layer = {
      name: namespace,
      title: `${param.desc} at ${pLevel} hPa`,
      data_source: dataSource,
      time_generator: "mas",
      rgb_products: [namespace],
    };

    if (param.colorscale && COLORSCALES[param.colorscale]) {
      Object.assign(layer, COLORSCALES[param.colorscale]);
    }

    const process = {
      data_sources: [
        {
          data_source: dataSource,
          rgb_products: [namespace],
          metadata_url: "/templates/WPS/date_value.tpl",
        },
      ],
      identifier: namespace,
      title: `${namespace} Geometry Drill`,
      abstract: "",
      max_area: 10000,
      pixel_stat: "mean",
      complex_data: [
        {
          identifier: "geometry",
          title: "Geometry",
          abstract: "",
          mime_type: "application/vnd.geo+json",
          schema: "http://geojson.org/geojson-spec.html",
          min_occurs: 1,
        },
      ],
      literal_data: [
        {
          identifier: "geometry_id",
          title: "Geometry ID",
        },
      ],
    };

    CONFIG.layers.push(layer);
    CONFIG.processes.push(process);
  });
});

const configJson = JSON.stringify(CONFIG, null, 4);

fs.writeFile("config.json", configJson, function (err) {
  if (err) throw err;
  console.log("COMPLETE");
});
