document.addEventListener("DOMContentLoaded", function() {

  var width = 960,
      height = 960;

  var projection = d3.geo.orthographic()
      .translate([width / 2, height / 2])
      .scale(width / 2 - 20)
      .clipAngle(90)
      .precision(0.6);
      
  var canvas = d3.select("body").append("canvas")
      .attr("width", width)
      .attr("height", height);

  //var canvas = d3.select("globe_canvas");
  console.log(d3)
  console.log(canvas);

  var c = canvas.node().getContext("2d");

  var path = d3.geo.path()
      .projection(projection)
      .context(c);

  var title = d3.select("h1");

  queue()
      .defer(d3.json, "../globe-data/world-110m.json")
      .defer(d3.tsv, "../globe-data/world-country-names.tsv")
      .await(ready);

  function ready(error, world, names) {
    if (error) throw error;

    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,
        n = countries.length;

    countries = countries.filter(function(d) {
      return names.some(function(n) {
        if (d.id == n.id) return d.name = n.name;
      });
    }).sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    (function transition() {
      d3.transition()
          .duration(1250)
          .each("start", function() {
            title.text(countries[i = (i + 1) % n].name);
          })
          .tween("rotate", function() {
            var p = d3.geo.centroid(countries[i]),
                r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);
            return function(t) {
              projection.rotate(r(t));
              c.clearRect(0, 0, width, height);
              c.fillStyle = "#2E373C", c.beginPath(), path(land), c.fill();
              c.fillStyle = "#0B8EC8", c.beginPath(), path(countries[i]), c.fill();
              c.strokeStyle = "#fff", c.lineWidth = .5, c.beginPath(), path(borders), c.stroke();
              c.strokeStyle = "#000", c.lineWidth = 2, c.beginPath(), path(globe), c.stroke();
            };
          })
        .transition()
          .each("end", transition);
    })();
  }

  d3.select(self.frameElement).style("height", height + "px");

})
