/* Shared helpers: API calls + CSV parsing. Loaded by every page. */
(function (w) {
  var CFG = w.ASCON_CONFIG || {};

  // Apps Script + GitHub Pages: POST a plain-text body (a "simple request")
  // so the browser skips the CORS preflight that Apps Script can't answer.
  function api(action, payload) {
    payload = payload || {};
    payload.action = action;
    return fetch(CFG.API_URL, {
      method: 'POST',
      body: JSON.stringify(payload)   // no custom headers -> text/plain -> no preflight
    }).then(function (r) { return r.json(); })
      .then(function (j) {
        if (j && j.error) throw new Error(j.error);
        return j;
      });
  }

  // Minimal, correct CSV parser (handles quoted fields, commas, newlines).
  function parseCSV(text) {
    text = text.replace(/^\uFEFF/, '');           // strip BOM
    var rows = [], row = [], cur = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += ch;
      } else {
        if (ch === '"') q = true;
        else if (ch === ',') { row.push(cur); cur = ''; }
        else if (ch === '\n' || ch === '\r') {
          if (ch === '\r' && text[i + 1] === '\n') i++;
          row.push(cur); cur = '';
          if (row.length > 1 || row[0] !== '') rows.push(row);
          row = [];
        } else cur += ch;
      }
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return String(h).trim().toLowerCase(); });
    var out = [];
    for (var r = 1; r < rows.length; r++) {
      if (rows[r].every(function (c) { return String(c).trim() === ''; })) continue;
      var o = {};
      head.forEach(function (h, j) { o[h] = rows[r][j] !== undefined ? String(rows[r][j]).trim() : ''; });
      out.push(o);
    }
    return out;
  }

  function toCSV(headers, rows) {
    var esc = function (v) { v = (v == null ? '' : String(v)); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    var lines = [headers.map(esc).join(',')];
    rows.forEach(function (r) { lines.push(r.map(esc).join(',')); });
    return '\uFEFF' + lines.join('\r\n');
  }

  function download(filename, text, type) {
    var blob = new Blob([text], { type: type || 'text/csv;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]; }); }
  function configured() { return CFG.API_URL && CFG.API_URL.indexOf('PASTE_YOUR') !== 0; }

  w.ASCON = { api: api, parseCSV: parseCSV, toCSV: toCSV, download: download, esc: esc, CFG: CFG, configured: configured };
})(window);
