let table;
let validRows = [];

function preload() {
  //file CSV con i dati
  table = loadTable("dataset.csv", "csv", "header");
}

function setup() {
  createCanvas(800, 600);
  background("#EAF2F8");
  textSize(16);
  noLoop();

  // Controllo delle righe del file CSV
  for (let i = 0; i < table.getRowCount(); i++) {
    let c2 = table.getNum(i, "column2");
    let c3 = table.getNum(i, "column3");

    if (c2 < 0 && c3 > 60) {
      validRows.push(table.getRow(i));
    }
  }

  fill(0);
  text("Righe valide trovate: " + validRows.length, 20, 30);

  // --- Calcolo delle statistiche richieste ---
  let mediaCol0 = meanFromColumn("column0");
  let stdCol1 = stdFromColumn("column1");
  let modaCol2 = modeFromColumn("column2");
  let medianaCol3 = medianFromColumn("column3");
  let mediaCol4 = meanFromColumn("column4");
  let stdCol4 = stdFromColumn("column4");

  // --- Testo con i risultati (2 rappresentazioni testuali) ---
  fill(30);
  text("Media colonna0: " + nf(mediaCol0, 1, 2), 20, 80);
  text("Deviazione standard colonna1: " + nf(stdCol1, 1, 2), 20, 110);
  text("Moda colonna2: " + modaCol2, 20, 140);
  text("Mediana colonna3: " + nf(medianaCol3, 1, 2), 20, 170);
  text("Media colonna4: " + nf(mediaCol4, 1, 2), 20, 200);
  text("Deviazione standard colonna4: " + nf(stdCol4, 1, 2), 20, 230);

  //  rappresentazioni grafiche
  drawBar(mediaCol0, 400, 100, "Media col0");
  drawBar(stdCol1, 400, 180, "Dev.std col1");

  // Quinta rappresentazione 
  drawCircle(mediaCol0, mediaCol4);
}




function getValues(colName) {
  let values = [];
  for (let r of validRows) {
    values.push(r.getNum(colName));
  }
  return values;
}

function meanFromColumn(colName) {
  let arr = getValues(colName);
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdFromColumn(colName) {
  let arr = getValues(colName);
  if (arr.length === 0) return 0;
  let m = meanFromColumn(colName);
  let variance = arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

function modeFromColumn(colName) {
  let arr = getValues(colName);
  if (arr.length === 0) return 0;
  let counts = {};
  for (let v of arr) {
    counts[v] = (counts[v] || 0) + 1;
  }
  let maxCount = 0;
  let mode = null;
  for (let [key, val] of Object.entries(counts)) {
    if (val > maxCount) {
      maxCount = val;
      mode = key;
    }
  }
  return mode;
}

function medianFromColumn(colName) {
  let arr = getValues(colName).sort((a, b) => a - b);
  if (arr.length === 0) return 0;
  let mid = floor(arr.length / 2);
  if (arr.length % 2 === 0) {
    return (arr[mid - 1] + arr[mid]) / 2;
  } else {
    return arr[mid];
  }
}


// disegno rappresentazioni

function drawBar(value, x, y, label) {
  let scaled = map(abs(value), 0, 100, 0, 200);
  fill("#4A90E2");
  rect(x, y, scaled, 30);
  fill(0);
  text(label + ": " + nf(value, 1, 2), x, y - 5);
}

function drawCircle(mean_col0, mean_col4) {
  // Il cerchio cambia dimensione in base alla media della colonna 0
  let size = map(abs(mean_col0), 0, 100, 30, 200);
  fill("#F5B041");
  ellipse(600, 400, size, size);
  fill(0);
  textAlign(CENTER);
  text("Raggio proporzionale media col0", 600, 480);
}
