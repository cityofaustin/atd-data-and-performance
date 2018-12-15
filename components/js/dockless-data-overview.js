//  all config objects must pass through q or data will be assigned to wrong objects

var t_options = {
  ease: d3.easeQuad,
  duration: 500
};

var today = new Date();
var month = today.getMonth();
var year = today.getFullYear();
var fiscal_year = year;

if (month > 8) {
  // if month is later than september
  fiscal_year = year + 1;
}

var formats = {
  round: function(val) {
    return Math.round(val);
  },
  formatDateTime: d3.timeFormat("%e %b %-I:%M%p"),
  formatDate: d3.timeFormat("%x"),
  formatTime: d3.timeFormat("%I:%M %p"),
  thousands: d3.format(",d"),
  decimal: function(val) {
    return parseFloat(Math.round(val * 100) / 100).toFixed(3);
  }
};

var pub_log_id = "i9se-t8hz";

var q = d3.queue();

var $month = $("#js-month-select").val();

var config = [
  // TOTAL DOCKLESS COUNTS
  {
    id: "dockless-trips-total-count",
    row_container_id: "panel-row-dockless",
    display_name: "  Total Trips (scooter & bicycle)",
    icon: "mobile",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "# of total Dockless Mobility trips taken.",
    query: (function() {
      return "select count(trip_id) as total_trips where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400";
    })(),
    data_transform: function(x) {
      return [x[0]["total_trips"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-trips-total-distance",
    row_container_id: "panel-row-dockless",
    display_name: "Total Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Total miles from Dockless Mobility trips.",
    query: (function() {
      return "select sum(trip_distance) * 0.000621371 as total_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400";
    })(),
    data_transform: function(x) {
      return [x[0]["total_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-trips-avg-distance",
    row_container_id: "panel-row-dockless",
    display_name: " Average Trip Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average distance of all Dockless Mobility trips (miles)",
    query: (function() {
      return "select avg(trip_distance) * 0.000621371 as avg_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-trips-avg-duration",
    row_container_id: "panel-row-dockless",
    display_name: "Average Trip Duration (minutes)",
    icon: "hourglass",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average duration of all Dockless Mobility trips",
    query: (function() {
      return "select avg(trip_duration)/60 as avg_duration_minutes  where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_duration_minutes"]];
    },
    update_event: "dockless_trips"
  },
  // SCOOTER DOCKLESS COUNTS
  {
    id: "scooter-trips-total-count",
    row_container_id: "panel-row-scooter",
    display_name: " Scooter Trips",
    icon: "bolt",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "# of total Dockless Scooter trips taken.",
    query: (function() {
      return "select count(trip_id) as total_trips where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='scooter'";
    })(),
    data_transform: function(x) {
      return [x[0]["total_trips"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "scooter-trips-total-distance",
    row_container_id: "panel-row-scooter",
    display_name: "Scooter Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Scooter miles from Dockless Mobility trips.",
    query: (function() {
      return "select sum(trip_distance) * 0.000621371 as total_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='scooter'";
    })(),
    data_transform: function(x) {
      return [x[0]["total_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "scooter-trips-avg-distance",
    row_container_id: "panel-row-scooter",
    display_name: " Average Scooter Trip Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average distance of Dockless Scooter trips (miles)",
    query: (function() {
      return "select avg(trip_distance) * 0.000621371 as avg_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='scooter'";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "scooter-trips-avg-duration",
    row_container_id: "panel-row-scooter",
    display_name: "Average Scooter Trip Duration (minutes)",
    icon: "hourglass",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average duration of Dockless Scooter trips",
    query: (function() {
      return "select avg(trip_duration)/60 as avg_duration_minutes  where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='scooter'";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_duration_minutes"]];
    },
    update_event: "dockless_trips"
  },
  // DOCKLESS BIKE COUNTS
  {
    id: "dockless-bike-trips-total-count",
    row_container_id: "panel-row-dockless-bike",
    display_name: " Bicycle Trips",
    icon: "bicycle",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "# of total Dockless Bicycle trips taken.",
    query: (function() {
      return "select count(trip_id) as total_trips where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='bicycle'";
    })(),
    data_transform: function(x) {
      return [x[0]["total_trips"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-bike-trips-total-distance",
    row_container_id: "panel-row-dockless-bike",
    display_name: "Bicycle Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "thousands",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Total miles from Dockless Bicycle trips.",
    query: (function() {
      return "select sum(trip_distance) * 0.000621371 as total_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='bicycle'";
    })(),
    data_transform: function(x) {
      return [x[0]["total_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-bike-trips-avg-distance",
    row_container_id: "panel-row-dockless-bike",
    display_name: "Average Bicycle Trip Distance (Miles)",
    icon: "tachometer",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average distance of Dockless Bicycle trips (miles)",
    query: (function() {
      return "select avg(trip_distance) * 0.000621371 as avg_miles where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='bicycle'";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_miles"]];
    },
    update_event: "dockless_trips"
  },
  {
    id: "dockless-bike-trips-avg-duration",
    row_container_id: "panel-row-dockless-bike",
    display_name: "Average Bicycle Trip Duration (minutes)",
    icon: "hourglass",
    init_val: 0,
    format: "decimal",
    infoStat: true,
    resource_id: "7d8e-dm7r",
    caption: "Average duration of Dockless Bicycle trips",
    query: (function() {
      return "select avg(trip_duration)/60 as avg_duration_minutes  where trip_distance * 0.000621371 >= 0.1 and trip_distance * 0.000621371 < 500 and trip_duration < 86400 and vehicle_type='bicycle'";
    })(),
    data_transform: function(x) {
      return [x[0]["avg_duration_minutes"]];
    },
    update_event: "dockless_trips"
  }
];

$(document).ready(function() {
  for (var i = 0; i < config.length; ++i) {
    if ("resource_id" in config[i]) {
      var url = buildSocrataUrl(config[i]);

      var id = config[i].id;

      q.defer(d3.json, url);
    }
  }

  q.awaitAll(function(error) {
    if (error) throw error;

    for (var i = 0; i < arguments[1].length; i++) {
      if ("data_transform" in config[i]) {
        config[i].data = config[i].data_transform(arguments[1][i]);
      } else {
        config[i].data = arguments[1][i];
      }
    }

    main(config);
  });

  $("#js-month-select").on("change", function(e) {
    debugger;
    removePanels();
    // buildCards();
  });
});

function buildSocrataUrl(data) {
  var resource_id = data.resource_id;

  var url = "https://data.austintexas.gov/resource/" + resource_id + ".json";

  if (data.query) {
    url = url + "?$query=" + data.query;
  }

  return url;
}

function buildCards() {}

function main(data) {
  for (var i = 0; i < config.length; ++i) {
    config[i].panel = createPanel(
      config[i].row_container_id,
      config[i].id,
      config[i].icon,
      config[i].display_name,
      config[i]
    );
  }

  var panels = appendInfoText(data);

  var panels = transitionInfoStat(panels, t_options, "TURNED_ON");

  for (var i = 0; i < config.length; i++) {
    var divId = config[i].id;

    var selection = d3.select("#" + divId);

    var event = config[i].update_event;

    postUpdateDate(selection, config[i].resource_id, event);
  }
}

function appendInfoText(data) {
  d3.selectAll(".loading").remove();

  var panel_content = d3
    .selectAll(".dash-panel")
    .append("div")
    .attr("class", "row")
    .append("div")
    .attr("class", "col");

  panel_content
    .append("text")
    .attr("class", "info-metric-small")
    .text(function(d) {
      return d.init_val;
    });

  d3.selectAll(".dash-panel")
    .attr("data-container", "body")
    .attr("data-trigger", "hover")
    .attr("data-toggle", "popover")
    .attr("data-placement", "top")
    .attr("data-content", function(d) {
      return d.caption;
    });

  $('[data-toggle="popover"]').popover();

  return d3.selectAll(".dash-panel");
}

function transitionInfoStat(selection, options) {
  var t = d3
    .transition()
    .ease(options.ease)
    .duration(options.duration);

  selection
    .selectAll(".info-metric-small")
    .transition(t) //  do this for each selection in sequence
    .tween("text", function() {
      var that = d3.select(this);

      var new_data = that.data()[0].data;

      var format = that.data()[0].format;

      var i = d3.interpolate(0, new_data[0]);

      return function(t) {
        that.text(formats[format](i(t))); // how to access the format type from the 'this' data?
      };
    });

  return selection;
}

function postUpdateDate(selection, resource_id, event) {
  var url = "https://transportation-data.austintexas.io/jobs";
  var download_url = "https://data.austintexas.gov/resource/" + resource_id;
  if (event) {
    url =
      url +
      "?name=eq." +
      event +
      "&status=eq.success&order=start_date.desc&limit=1";

    d3.json(url, function(error, data) {
      if (data.length > 0) {
        var update_date_time = new Date(data[0].start_date);

        var update_date = readableDate(update_date_time);

        var update_time = formats.formatTime(update_date_time);

        var html =
          "Updated " +
          update_date +
          " at " +
          update_time +
          " | <a href=" +
          download_url +
          " target='_blank'> Data <i  class='fa fa-download'></i> </a>";
      } else {
        var html =
          "<a href=" +
          download_url +
          " target='_blank'> Data <i  class='fa fa-download'></i> </a>";
      }

      selection
        .append("div")
        .attr("class", "row")
        .append("div")
        .attr("class", "col")
        .append("h6")
        .attr("class", "dash-panel-footer-text text-left")
        .html(html);
    });
  }

  return;
}

function readableDate(date) {
  var update_date = formats.formatDate(date);

  var today = formats.formatDate(new Date());

  if (update_date == today) {
    return "today";
  } else {
    return update_date;
  }
}

function removePanels() {
  for (var i = 0; i < config.length; ++i) {
    $("#" + config[i].row_container_id).remove();
  }
}

function createPanel(row_container_id, panel_id, panel_icon, panel_name, data) {
  //  create container and panel divs
  var panel = d3
    .select("#" + row_container_id)
    .append("div")
    .data([data])
    .attr("class", "col-sm-6 col-md-4 col-lg-3 dash-panel-container p-2")
    .append("div")
    .attr("class", "col dash-panel h-100 p-2")
    .attr("id", panel_id);

  //  create header
  var header = panel.append("div").attr("class", "row dash-panel-header");

  header
    .append("div")
    .attr("class", "col-1 dash-panel-icon")
    .html("<h4><i class='fa fa-" + panel_icon + "' ></i></h4>");

  header
    .append("div")
    .attr("class", "col dash-panel-title")
    .html("<h4>" + panel_name + "</h4>");

  panel
    .append("p")
    .attr("class", "loading")
    .text("Loading...");

  return panel;
}

//  https://data.austintexas.gov/resource/cwi3-ckqi.json?$query=select count(*), month||year as monthyear where monthyear in ("52017") group by monthyear
