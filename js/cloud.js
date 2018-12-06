var DATA_FILE_PATH = './data/words.json'; // 読み込みデータファイル
var TARGET_ELEMENT_ID = '#cloud'; // 描画先


d3.json(DATA_FILE_PATH).then(function(data) { // v5

  console.log('input file : ' + DATA_FILE_PATH);

  var h = 490;
  var w = 600;

  var random = d3.randomIrwinHall(2);
  var countMax = d3.max(data, function(d){ return d.count} );
  var sizeScale = d3.scaleLinear().domain([0, countMax]).range([10, 100])

  var words = data.map(function(d) {
    return {
    text: d.word,
    size: sizeScale(d.count) //頻出カウントを文字サイズに反映
    };
  });

  d3.layout.cloud().size([w, h])
    .words(words)
//    .rotate(function() { return Math.round(1-random()) *90; }) //ランダムに文字を90度回転
    .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw) //描画関数の読み込み
    .start();


  // wordcloud 描画
  // colorSchema see https://wizardace.com/d3v5-scale-chromatic/
  function draw(words) {
    d3.select(TARGET_ELEMENT_ID).append("svg")
        .attr("width", w)
        .attr("height", h)
      .append("g")
        .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
        
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
    }

});
