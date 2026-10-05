(function () {
  "use strict";
  const W = 595, H = 842, SCALE = 2, MARGIN = 42;
  const COLORS = { navy: "#103f6b", ink: "#17324d", muted: "#526579", line: "#d8e0e8", good: "#167044", partial: "#966100", gap: "#a42a35", missing: "#526579", na: "#526579" };
  const translate = value => window.civicTranslate ? window.civicTranslate(String(value == null ? "" : value)) : String(value == null ? "" : value);
  function statusForRatio(ratio) { return ratio == null ? "missing" : ratio >= .75 ? "good" : ratio >= .45 ? "partial" : "gap"; }
  // Canvas uses the browser's Unicode fonts and shaping. PDF pages retain the
  // complete rendered text, including scripts unsupported by WinAnsi fonts.
  function render(report) {
    const pages = [];
    let canvas, ctx, y;
    function font(size, bold) { ctx.font = (bold ? "600 " : "") + size + 'px system-ui, "Segoe UI", sans-serif'; }
    function raw(value, x, top, size, bold, color) {
      font(size, bold); ctx.fillStyle = color || COLORS.ink;
      ctx.textBaseline = "top"; ctx.fillText(value, x, top);
    }
    function newPage() {
      canvas = document.createElement("canvas"); canvas.width = W * SCALE; canvas.height = H * SCALE;
      ctx = canvas.getContext("2d"); if (!ctx) throw new Error("PDF rendering is unavailable.");
      ctx.scale(SCALE, SCALE); ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COLORS.navy; ctx.fillRect(0, 0, W, 88);
      font(17, true);
      const titleLines = wrap(translate(report.title), W - MARGIN * 2);
      titleLines.forEach((line, index) => raw(line, MARGIN, 20 + index * 21, 17, true, "#ffffff"));
      raw(translate(report.pathway), MARGIN, 66, 10, false, "#e7f1fa");
      y = 108; pages.push(canvas);
    }
    function room(height) { if (y + height > H - 62) newPage(); }
    function graphemes(value) {
      return typeof Intl.Segmenter === "function" ? Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value), part => part.segment) : Array.from(value);
    }
    function wrap(value, width) {
      const lines = [];
      for (const paragraph of String(value).split(/\r?\n/)) {
        let line = "";
        for (const word of paragraph.split(/\s+/).filter(Boolean)) {
          const candidate = line ? line + " " + word : word;
          if (ctx.measureText(candidate).width <= width) { line = candidate; continue; }
          if (line) { lines.push(line); line = ""; }
          if (ctx.measureText(word).width <= width) { line = word; continue; }
          for (const char of graphemes(word)) {
            if (line && ctx.measureText(line + char).width > width) { lines.push(line); line = ""; }
            line += char;
          }
        }
        lines.push(line);
      }
      return lines;
    }
    function paragraph(value, options) {
      const o = options || {}, size = o.size || 10, leading = size * 1.45;
      font(size, o.bold);
      const lines = wrap(o.userText ? String(value) : translate(value), W - 2 * MARGIN);
      for (const line of lines) { room(leading); raw(line, MARGIN, y, size, o.bold, o.color); y += leading; }
      y += o.gap == null ? 7 : o.gap;
    }
    function heading(value) { room(48); y += 7; paragraph(value, { size: 13, bold: true, color: COLORS.navy, gap: 9 }); }
    function field(label, value, userText) {
      room(38); paragraph(label, { bold: true, gap: 2 }); paragraph(value || "Not provided", { userText: !!userText });
    }
    newPage();
    heading("Assessment overview");
    paragraph(report.overall?.label || "Incomplete", { size: 12, bold: true, color: COLORS[report.overall?.status] });
    paragraph(report.overallDetail || "");
    if (report.completion) {
      const c = report.completion;
      field("Completion", c.answered + " / " + c.total);
      if (c.answered < c.total) paragraph("Incomplete assessment. Complete all required questions before relying on the findings.", { bold: true, color: COLORS.gap });
    }
    const meta = report.meta || {};
    field("AI system or use", meta.project, true);
    field("Responsible education authority or institution", meta.publicBody || meta.agency, true);
    field("Education purpose, context and affected groups", meta.purpose, true);
    field("Responsible review lead", meta.accountableOwner, true);
    field("Assessment date", meta.assessmentDate, true);
    if (meta.nextReview) field("Next review", meta.nextReview, true);
    heading("Decision and conditions");
    field("Final decision", report.decision);
    field("Actions, responsible roles, dates and remaining risk", report.conditions, true);
    paragraph(report.note || "This self assessment records the evidence and judgement provided. It does not verify compliance or authorise the use.");
    heading("Preliminary risk route");
    paragraph(report.riskRoute?.label || "Incomplete", { bold: true, color: COLORS[report.riskRoute?.status] });
    paragraph(report.riskRoute?.detail || "");
    heading("Results by category");
    for (const item of report.dimensions || []) {
      room(66); paragraph(item.name, { bold: true, gap: 2 });
      paragraph(item.scoreText || "Pending", { bold: true, color: COLORS[item.status], gap: 3 });
      const ratio = item.ratio;
      if (ratio != null) {
        ctx.fillStyle = "#edf2f6"; ctx.fillRect(MARGIN, y, W - 2 * MARGIN, 6);
        ctx.fillStyle = COLORS[item.status] || COLORS.missing;
        ctx.fillRect(MARGIN, y, (W - 2 * MARGIN) * Math.max(0, Math.min(1, ratio)), 6); y += 12;
      }
      if (item.detail) paragraph(item.detail);
    }
    heading("Key findings");
    if (!(report.findings || []).length) paragraph("No priority issue was generated automatically. Review the evidence and remaining uncertainty before closing the assessment.");
    for (const item of report.findings || []) {
      paragraph(item.title, { bold: true, color: COLORS[item.status], gap: 3 }); paragraph(item.text, { userText: true });
    }
    heading("Priority actions");
    for (const item of report.takeaways || []) paragraph(item);
    heading("Full response record");
    let section = "";
    for (const item of report.responses || []) {
      if (item.section !== section) { section = item.section; heading(section); }
      paragraph(item.prompt, { bold: true, gap: 3 });
      // Translate only exact questionnaire options; free responses remain intact.
      paragraph(Array.isArray(item.answer) ? item.answer.map(translate).join("; ") : translate(item.answer || "Not answered"));
      if (item.evidence) field("Evidence / reason", item.evidence, true);
    }
    pages.forEach((page, index) => {
      ctx = page.getContext("2d");
      ctx.strokeStyle = COLORS.line; ctx.beginPath(); ctx.moveTo(MARGIN, H - 45); ctx.lineTo(W - MARGIN, H - 45); ctx.stroke();
      raw(translate("Version 2.2"), MARGIN, H - 32, 8, false, COLORS.muted);
      const label = (index + 1) + " / " + pages.length;
      font(8); raw(label, W - MARGIN - ctx.measureText(label).width, H - 32, 8, false, COLORS.muted);
    });
    return pages;
  }
  function encodePdf(pages) {
    const encoder = new TextEncoder(), objects = [];
    const bytes = value => encoder.encode(value);
    const join = arrays => {
      const result = new Uint8Array(arrays.reduce((n, item) => n + item.length, 0));
      let offset = 0; for (const item of arrays) { result.set(item, offset); offset += item.length; } return result;
    };
    objects[1] = bytes("<< /Type /Catalog /Pages 2 0 R >>");
    const kids = pages.map((_, i) => (3 + i * 3) + " 0 R").join(" ");
    objects[2] = bytes("<< /Type /Pages /Kids [" + kids + "] /Count " + pages.length + " >>");
    pages.forEach((canvas, index) => {
      const pageId = 3 + index * 3, imageId = pageId + 1, streamId = pageId + 2;
      const data = atob(canvas.toDataURL("image/jpeg", .94).split(",")[1]);
      const image = Uint8Array.from(data, c => c.charCodeAt(0));
      objects[pageId] = bytes("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /XObject << /Img " + imageId + " 0 R >> >> /Contents " + streamId + " 0 R >>");
      objects[imageId] = join([bytes("<< /Type /XObject /Subtype /Image /Width " + canvas.width + " /Height " + canvas.height + " /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length " + image.length + " >>\nstream\n"), image, bytes("\nendstream")]);
      const commands = "q " + W + " 0 0 " + H + " 0 0 cm /Img Do Q\n";
      objects[streamId] = bytes("<< /Length " + bytes(commands).length + " >>\nstream\n" + commands + "endstream");
    });
    const parts = [bytes("%PDF-1.4\n")], offsets = [0]; let length = parts[0].length;
    for (let id = 1; id < objects.length; id++) {
      offsets[id] = length; const object = join([bytes(id + " 0 obj\n"), objects[id], bytes("\nendobj\n")]);
      parts.push(object); length += object.length;
    }
    let xref = "xref\n0 " + objects.length + "\n0000000000 65535 f \n";
    for (let id = 1; id < objects.length; id++) xref += String(offsets[id]).padStart(10, "0") + " 00000 n \n";
    parts.push(bytes(xref + "trailer\n<< /Size " + objects.length + " /Root 1 0 R >>\nstartxref\n" + length + "\n%%EOF"));
    return join(parts);
  }
  window.downloadAssessmentPdf = function (report, filename) {
    const data = encodePdf(render(report));
    const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
    const link = document.createElement("a"); link.href = url; link.download = filename || "assessment-results.pdf";
    document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  window.assessmentPdfStatusFromRatio = statusForRatio;
}());
