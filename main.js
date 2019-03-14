(d3 => {
  const MARGIN = { top: 10, left: 10, right: 10, bottom: 10 };
  const SIZE = { width: 280, height: 500 };
  const BEER_COLORS = ["#FED29A", "#E98253", "#CA5D40", "#B64C3F", "#973432"];
  const BOTTLE_SIZE = { width: 10, height: 10 };
  const COUNTRIES = [
    { code: "mx", name: "Mexico" },
    { code: "de", name: "Germany" },
    { code: "us", name: "US" }
  ];

  let colorScale;
  let yScale;
  let $svg;
  let selectedCountry = "mx";

  const beersData = {
    mx: [
      { name: "Pacífico", popularity: 8 },
      { name: "Dos Equis", popularity: 6 },
      { name: "Modelo Especial", popularity: 11 },
      { name: "Negra Modelo", popularity: 17 },
      { name: "Victoria", popularity: 25 }
    ],
    de: [
      { name: "Becks", popularity: 50 },
      { name: "Veltins", popularity: 20 },
      { name: "Warsteiner", popularity: 27 },
      { name: "Bitburger", popularity: 39 },
      { name: "Erdinger", popularity: 11 }
    ],
    us: [
      { name: "Bud Light", popularity: 15.4 },
      { name: "Coors Light", popularity: 7.7 },
      { name: "Budweiser", popularity: 6.2 },
      { name: "Miller Lite", popularity: 6.1 },
      { name: "Corona Extra", popularity: 4.1 }
    ]
  };

  const getSVGWidth = () => SIZE.width + MARGIN.left + MARGIN.right;
  const getSVGHeight = () => SIZE.height + MARGIN.top + MARGIN.bottom;

  const stackGenerator = data =>
    data.map((d, index, arr) => [
      d3.sum(arr.slice(0, index)),
      d3.sum(arr.slice(0, index)) + d
    ]);

  const appendBottlePath = $selection =>
    $selection
      .append("path")
      .attr(
        "d",
        "M41.4331378,2.57130786 C41.4189269,2.57132569 41.4047692,2.57133459 41.390663,2.57133459 C41.417888,2.57133459 41.4432552,2.57124891 41.4669207,2.57107439 Z M41.7639644,2.56937605 C41.6204221,2.64923474 41.4360377,2.76168765 41.2266781,2.89853138 C40.6350098,3.28526349 39.9377807,3.80336142 39.2939927,4.34215494 C38.5772149,4.94203453 37.9694668,5.53083711 37.5557263,6.03265721 C37.3611537,6.26865168 37.2214649,6.47128286 37.1431343,6.62178201 C37.1259885,6.65472492 37.1254443,6.65030813 37.126309,6.59473452 C37.1432024,7.2022699 37.4922318,8.02806398 38.1285499,8.96834123 C38.3708432,9.32637408 38.5476835,9.5599715 38.9862733,10.1180081 C39.4654703,10.7277111 39.5610057,11.2775765 39.6665932,12.6089951 C39.7177397,13.253933 39.7475283,13.8872028 39.7988063,15.2399971 C39.8008573,15.2941238 39.8008573,15.2941238 39.8029046,15.3481745 C39.844961,16.4583865 39.8665447,16.9505322 39.8996603,17.4641791 L39.9286512,17.913849 L39.7620067,18.3325053 C39.6291824,18.666196 38.9715979,20.3053592 38.7805874,20.7847269 C38.3508041,21.8633289 37.9889603,22.7878405 37.6432254,23.696804 C37.3286413,24.5238696 37.0396235,25.3067093 36.7735271,26.0555842 C35.5079859,29.617195 34.8177128,32.4002274 34.8052068,33.5758594 C34.8053843,33.5759052 34.8055618,33.5759511 34.8057394,33.575997 C35.4254824,33.7360766 36.3871955,33.8797885 37.6645922,33.9955789 L39.6115277,34.1720599 L39.4794731,36.1225125 C38.9125981,44.4952799 38.4306915,49.9693459 38.0242828,52.6088356 C36.6698441,61.4054638 31.4534976,90.5739378 30.7533201,96.7915235 C29.1604498,110.936233 27.7661818,124.686231 26.2099941,142.748265 C25.6676322,149.043238 24.8497596,159.554137 23.7567824,174.276465 L23.7197026,174.775927 L23.4516119,175.198968 C22.8588246,176.134373 15.8464318,186.974239 13.4130868,190.817906 C13.0114425,191.452336 12.620198,192.072781 12.2385055,192.680701 C5.88773853,202.795547 2,209.854124 2,211.353882 C2,243.355104 2.0556797,269.394586 2.18305977,306.564492 C2.19467514,309.953893 2.20685873,313.445196 2.22277159,317.958717 C2.22637052,318.979518 2.25492903,327.05899 2.26334958,329.452976 C2.45138526,382.912033 2.52672391,416.755898 2.52672391,466.353882 C2.52672391,472.820032 4.4432209,477.288656 10.0039174,479.682586 C16.241525,482.367933 27.5347347,484.326611 41.7539247,485.616501 C46.7800253,486.072442 51.8246932,486.412053 56.6336924,486.651595 C59.5099946,486.794868 62.6315891,486.907542 62.8320372,486.90401 C63.4856919,486.892493 66.1011631,486.794638 68.9090658,486.650455 C73.5795575,486.410629 78.4798925,486.071317 83.371966,485.615785 C97.2185675,484.32644 108.281929,482.369341 114.522806,479.682586 C120.083503,477.288656 122,472.820032 122,466.353882 C122,416.755898 122.075339,382.912033 122.263374,329.452976 C122.271795,327.05899 122.300353,318.979518 122.303952,317.958717 C122.319865,313.445196 122.332049,309.953893 122.343664,306.564492 C122.471044,269.394586 122.526724,243.355104 122.526724,211.353882 C122.526724,209.854124 118.638985,202.795547 112.288218,192.680701 C111.906526,192.072781 111.515281,191.452336 111.113637,190.817906 C108.680292,186.974239 101.667899,176.134373 101.075112,175.198968 L100.807021,174.775927 L100.769942,174.276465 C99.6769643,159.554137 98.8590917,149.043238 98.3167298,142.748265 C96.7605421,124.686231 95.3662741,110.936233 93.7734038,96.7915235 C93.0732263,90.5739378 87.8568798,61.4054638 86.5024411,52.6088356 C86.0960324,49.9693459 85.6141258,44.4952799 85.0472508,36.1225125 L84.9151962,34.1720599 L86.8621318,33.9955789 C88.1395284,33.8797885 89.1012415,33.7360766 89.7209845,33.575997 C89.7211621,33.5759511 89.7213396,33.5759052 89.7215171,33.5758594 C89.7090111,32.4002274 89.018738,29.617195 87.7531968,26.0555842 C87.4871004,25.3067093 87.1980826,24.5238696 86.8834985,23.696804 C86.5377636,22.7878405 86.1759198,21.8633289 85.7461365,20.7847269 C85.5551261,20.3053592 84.8975415,18.666196 84.7647172,18.3325053 L84.5980727,17.913849 L84.6270636,17.4641791 C84.6601792,16.9505322 84.6817629,16.4583865 84.7238193,15.3481745 C84.7258666,15.2941238 84.7258666,15.2941238 84.7279176,15.2399971 C84.7791957,13.8872028 84.8089842,13.253933 84.8601307,12.6089951 C84.9657182,11.2775765 85.0612536,10.7277111 85.5404506,10.1180081 C85.9790404,9.5599715 86.1558807,9.32637408 86.398174,8.96834123 C87.0417971,8.01726954 87.3914974,7.18332465 87.3995001,6.53986725 C87.4011561,6.65070135 87.3997157,6.65276568 87.3835896,6.62178201 C87.305259,6.47128286 87.1655702,6.26865168 86.9709976,6.03265721 C86.5572571,5.53083711 85.949509,4.94203453 85.2327312,4.34215494 C84.5889432,3.80336142 83.8917141,3.28526349 83.3000458,2.89853138 C83.0904304,2.76152047 82.9058513,2.64896002 82.7622336,2.56908352 C82.0826345,2.56126399 81.2135353,2.53284974 79.9397165,2.48036827 C79.6966273,2.47035297 76.4379933,2.32958489 75.2978234,2.28407606 C70.6569998,2.09884189 66.5297233,2 62,2 C57.4775752,2 53.5196941,2.09795971 49.0803591,2.28391499 C48.0767325,2.32595499 45.0865979,2.46100599 44.631758,2.48027182 C43.3820359,2.53320678 42.4946921,2.56194608 41.7639644,2.56937605 Z M37.126309,6.59473452 C37.1266105,6.57535715 37.1270833,6.54976026 37.1270833,6.51735898 C37.1270833,6.53208796 37.1272651,6.54691861 37.1276282,6.56185003 Z M34.3767949,33.4386482 C34.3722335,33.4361125 34.3677009,33.4336558 34.3631991,33.4312756 C34.3753695,33.4377103 34.3919936,33.4452853 34.4129055,33.4538102 Z M88.6993341,12.5719748 C88.6947013,12.5778713 88.6900438,12.5837981 88.6853613,12.5897558 C88.6980356,12.5736298 88.7100235,12.5582498 88.7213644,12.5435701 Z"
      )
      .attr("transform", "scale(1.031140441)");

  const addBottleMask = $selection => {
    appendBottlePath(
      $selection
        .append("defs")
        .append("clipPath")
        .attr("id", "bottle-clipPath")
    ).attr("fill", "#000");
  };

  const getTrends = beers => {
    return fetch("https://trends.google.com/trends/api/widgetdata/multiline", {
      headers: {
        Origin: "http://carlosyslas.com"
      },
      mode: "no-cors"
    }).then(r => r.json());
  };

  const updateCountries = $selection => {
    $selection
      .text(d => d.name)
      .classed("active", d => d.code === selectedCountry);
  };

  const renderCountries = () => {
    const $countries = d3
      .select(".country-selector")
      .selectAll(".country")
      .data(COUNTRIES)
      .call(updateCountries)
      .enter()
      .append("li")
      .attr("class", "country")
      .call(updateCountries)
      .on("click", d => {
        selectedCountry = d.code;
        render();
      });
  };

  const updateLabels = ($selection, labels) => {
    $selection.attr("transform", d => `translate(${50} ${yScale(d3.mean(d))})`);

    $selection.select("text").text((d, i) => labels[i]);
    // TODO: update texts
  };

  const renderLabels = ($selection, data, labels) => {
    const $labels = $selection.selectAll(".label").data(data);

    const $newLabels = $labels
      .enter()
      .append("g")
      .attr("class", "label");

    $newLabels
      .append("line")
      .attr("x1", 0)
      .attr("x2", 300)
      .attr("y1", 0)
      .attr("y2", 0)
      .attr("stroke", "#000")
      .attr("stroke-dasharray", "6 6")
      .attr("stroke-width", 3);
    $newLabels.append("text").attr("x", 100);

    $newLabels.call(updateLabels, labels);
    $labels.transition().call(updateLabels, labels);
  };

  const updateBars = $selection => {
    $selection.attr("y", d => yScale(d[0])).attr("height", d => yScale(d[1]));
  };

  const renderBars = ($selection, data) => {
    const $bars = $selection.selectAll(".bar").data(data);

    $bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("width", SIZE.width)
      .call(updateBars)
      .attr("clip-path", "url(#bottle-clipPath)")
      .attr("fill", (d, i) => BEER_COLORS[i]);

    $bars.transition().call(updateBars);
  };

  const renderBottleBorder = $selection => {
    appendBottlePath($selection)
      .attr("class", "border")
      .attr("stroke", "#333")
      .attr("fill", "transparent")
      .attr("stroke-width", 3);
  };

  const renderBubbles = $selection => {
    const randomX = d3.randomUniform(0, SIZE.width);
    const randomY = d3.randomUniform(0, SIZE.height);
    const randomR = d3.randomUniform(1, 4);
    const randomDelay = d3.randomUniform(0, 2);

    $selection
      .selectAll(".bubble")
      .data(Array.from(Array(50)))
      .enter()
      .append("circle")
      .style("animation-delay", () => `${randomDelay()}s`)
      .attr("class", "bubble")
      .attr("cx", randomX)
      .attr("cy", randomY)
      .attr("r", randomR)
      .attr("fill", "#ffffff33")
      .attr("stroke", "#ffffff66");
  };

  const updateSVGSize = $selection => {
    $selection.attr("width", getSVGWidth).attr("height", getSVGHeight);
  };

  const render = () => {
    yScale = d3.scaleLinear().range([0, SIZE.height]);

    const data = beersData[selectedCountry].sort(
      (a, b) => b.popularity - a.popularity
    );

    yScale.domain([0, d3.sum(data, d => d.popularity)]);

    const stackData = stackGenerator(data.map(d => d.popularity));
    const names = data.map(d => d.name);

    // TODO: border is being added multiple times.

    $svg
      .call(updateSVGSize)
      .call(renderLabels, stackData, names)
      .call(renderBars, stackData)
      .call(renderBottleBorder)
      .call(renderBubbles);

    renderCountries();
  };

  const setup = () => {
    $svg = d3
      .select("#chart")
      .append("svg")
      .attr("viewBox", `0 0 ${getSVGWidth()} ${getSVGHeight()}`)
      .call(addBottleMask)
      .call(updateSVGSize)
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    render();
  };

  setup();
})(window.d3);
