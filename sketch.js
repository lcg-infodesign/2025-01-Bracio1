let table;
let validRows = [];

function preload() {
  // caricamento dataset 
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  // canvas e impostazione iniziale
  createCanvas(900, 600);
  noLoop();

  //sfondo chiaro, font e allineamento del testo
  background("#F8F9FA");
  textFont("Helvetica Neue");
  textAlign(LEFT, CENTER);
  noStroke();

  // selezione delle righe del dataset:
  // colonna2 < 0 e colonna3 > 60
  for (let i = 0; i < table.getRowCount(); i++) {
    let c2 = table.getNum(i, "column2");
    let c3 = table.getNum(i, "column3");
    if (c2 < 0 && c3 > 60) validRows.push(table.getRow(i));
  }

  // Titolo principale e sottotitolo con numero di righe filtrate
  fill("#000");
  textSize(28);
  textStyle(BOLD);
  text("DATASET INSIGHT", 40, 50);

  fill("#888");
  textSize(15);
  textStyle(NORMAL);
  text("Righe valide trovate: " + validRows.length, 42, 80);

  
  stroke("#000");
  strokeWeight(0.6);
  line(40, 100, 860, 100);
  noStroke();

  //  statistiche principali per diverse colonne del dataset
  let mediaCol0 = meanFromColumn("column0");
  let stdCol1 = stdFromColumn("column1");
  let modaCol2 = modeFromColumn("column2");
  let medianaCol3 = medianFromColumn("column3");
  let mediaCol4 = meanFromColumn("column4");
  let stdCol4 = stdFromColumn("column4");

  //   risultati visualizzazione
  drawCard(40, 130, 370, 320, [
    ["Media colonna 0", nf(mediaCol0, 1, 2)],
    ["Dev.st colonna 1", nf(stdCol1, 1, 2)],
    ["Moda colonna 2", modaCol2],
    ["Mediana colonna 3", nf(medianaCol3, 1, 2)],
    ["Media colonna 4", nf(mediaCol4, 1, 2)],
    ["Dev.st colonna 4", nf(stdCol4, 1, 2)]
  ]);

  //rappresentazioni visive a destra 
  drawBar(mediaCol0, 480, 160, "Media col0");
  drawBar(stdCol1, 480, 240, "Dev.std col1");
  drawCircle(mediaCol0, mediaCol4);
}

// tutti i valori numerici di una colonna
function getValues(colName) {
  return validRows.map(r => r.getNum(colName));
}

// Calcolo della media di una colonna
function meanFromColumn(colName) {
  let arr = getValues(colName);
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

// Calcolo della deviazione standard di una colonna
function stdFromColumn(colName) {
  let arr = getValues(colName);
  if (arr.length === 0) return 0;
  let m = meanFromColumn(colName);
  let variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return sqrt(variance);
}

// Calcolo della moda (valore più frequente) di una colonna
function modeFromColumn(colName) {
  let arr = getValues(colName);
  if (arr.length === 0) return 0;
  let counts = {};
  for (let v of arr) counts[v] = (counts[v] || 0) + 1;
  return Object.entries(counts).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
}

// Calcolo della mediana (valore centrale) di una colonna ordinata
function medianFromColumn(colName) {
  let arr = getValues(colName).sort((a, b) => a - b);
  if (arr.length === 0) return 0;
  let mid = floor(arr.length / 2);
  return arr.length % 2 === 0 ? (arr[mid - 1] + arr[mid]) / 2 : arr[mid];
}

// card con bordo, ombra e testosss 
function drawCard(x, y, w, h, dataPairs) {
  fill(255, 250);
  rect(x, y, w, h, 12);

  push();
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = "rgba(0,0,0,0.08)";
  noFill();
  stroke("#E5E7E9");
  strokeWeight(1);
  rect(x, y, w, h, 12);
  pop();

  // Titolo 
  fill("#111");
  noStroke();
  textSize(18);
  textStyle(BOLD);
  text("Statistiche principali", x + 25, y + 30);

  textSize(15);
  textStyle(NORMAL);
  fill("#222");
  let startY = y + 70;
  let lineH = 32;
  for (let [label, val] of dataPairs) {
    text(label + ": ", x + 25, startY);
    fill("#888");
    text(val, x + 220, startY);
    fill("#222");
    startY += lineH;
  }
}

//barra orizzontale con gradiente di colore
function drawBar(value, x, y, label) {
  let scaled = map(abs(value), 0, 100, 0, 220);
  let grad = drawingContext.createLinearGradient(x, y, x + scaled, y);
  grad.addColorStop(0, "#111");
  grad.addColorStop(1, "#2A9DF4");
  drawingContext.fillStyle = grad;

  rect(x, y, scaled, 28, 8);

  fill("#000");
  noStroke();
  textSize(14);
  text(label + ": " + nf(value, 1, 2), x, y - 10);
}

//cerchio con dimensione proporzionale a una media e colore variabile
function drawCircle(mean_col0, mean_col4) {
  let size = map(abs(mean_col0), 0, 100, 40, 180);
  let c = lerpColor(color("#111"), color("#2A9DF4"), constrain(mean_col4 / 100, 0, 1));

  push();
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = "rgba(42,157,244,0.25)";
  fill(c);
  noStroke();
  ellipse(700, 430, size, size);
  pop();

  fill("#000");
  textSize(13);
  textAlign(CENTER);
  text("Dimensione proporzionale alla media col0", 700, 520);
}

