import { describe, expect, it } from "vitest";
import { decodeEntities, parseQuizText, quizPlainText } from "@/lib/utils/quiz-text";

describe("F17: Formatierung in Quiztexten", () => {
  it("zerlegt Text mit Inline-Code", () => {
    expect(parseQuizText("Wozu dient <code>-WhatIf</code> bei <code>Remove-Item</code>?")).toEqual([
      { type: "text", value: "Wozu dient " },
      { type: "code", value: "-WhatIf" },
      { type: "text", value: " bei " },
      { type: "code", value: "Remove-Item" },
      { type: "text", value: "?" },
    ]);
  });

  it("wandelt HTML-Entities um, auch im Code", () => {
    expect(parseQuizText("<code>ls 2&gt;&amp;1</code> &amp; mehr")).toEqual([
      { type: "code", value: "ls 2>&1" },
      { type: "text", value: " & mehr" },
    ]);
    expect(decodeEntities("&lt;a&gt; &quot;x&quot; &#39;y&#39; &#x41;")).toBe("<a> \"x\" 'y' A");
  });

  it("erkennt Zeilenumbrüche und entfernt sonstige Tags", () => {
    expect(parseQuizText("eins<br>zwei <b>fett</b><script>x</script>")).toEqual([
      { type: "text", value: "eins" },
      { type: "br" },
      { type: "text", value: "zwei fettx" },
    ]);
  });

  it("liefert reinen Text", () => {
    expect(quizPlainText("Cmdlet <code>Get-Process</code><br>fertig")).toBe("Cmdlet Get-Process fertig");
  });
});
