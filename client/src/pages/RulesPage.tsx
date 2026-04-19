export function RulesPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-wm-dark mb-6">Regeln & Punktesystem</h1>

      {/* Punktesystem */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-wm-dark mb-4">Punktevergabe</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <span className="text-2xl font-bold text-wm-gold min-w-[2rem] text-center">3</span>
            <div>
              <p className="font-semibold text-gray-800">Exaktes Ergebnis</p>
              <p className="text-sm text-gray-600">
                Du hast das genaue Endergebnis getippt — z.&nbsp;B. Tipp 2:1, Ergebnis 2:1.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
            <span className="text-2xl font-bold text-wm-green min-w-[2rem] text-center">1</span>
            <div>
              <p className="font-semibold text-gray-800">Richtiger Ausgang</p>
              <p className="text-sm text-gray-600">
                Du hast den Sieger (oder Unentschieden) richtig vorhergesagt, aber das genaue
                Ergebnis nicht — z.&nbsp;B. Tipp 2:0, Ergebnis 3:1.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <span className="text-2xl font-bold text-gray-400 min-w-[2rem] text-center">0</span>
            <div>
              <p className="font-semibold text-gray-800">Falsch getippt</p>
              <p className="text-sm text-gray-600">
                Weder Ergebnis noch Ausgang stimmen — z.&nbsp;B. Tipp 1:0, Ergebnis 0:2.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t text-sm text-gray-500">
          <p>
            Die Rangliste sortiert nach Gesamtpunkten. Bei Gleichstand entscheidet die Anzahl
            der exakten Ergebnisse, danach der Benutzername alphabetisch.
          </p>
        </div>
      </div>

      {/* Tipps abgeben */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-wm-dark mb-3">Tipps abgeben</h2>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
          <li>Tipps können bis zum Anstoß des jeweiligen Spiels abgegeben werden.</li>
          <li>Bereits abgegebene Tipps können bis zum Anstoß geändert werden.</li>
          <li>Nach Spielbeginn ist keine Änderung mehr möglich.</li>
          <li>Punkte werden automatisch berechnet, sobald ein Admin das Ergebnis einträgt.</li>
        </ul>
      </div>

      {/* Über die Seite */}
      <div className="bg-gradient-to-r from-wm-dark to-wm-green rounded-2xl text-white p-6">
        <h2 className="text-lg font-bold mb-3">Über diese Seite</h2>
        <p className="text-sm text-green-100 leading-relaxed mb-3">
          Diese Tippspiel-Plattform wurde vollständig von{' '}
          <span className="font-semibold text-wm-gold">Claude Code</span> entwickelt —
          dem KI-Coding-Assistenten von Anthropic.
        </p>
        <p className="text-sm text-green-100 leading-relaxed">
          Frontend: React + TypeScript + Tailwind CSS, gehostet auf GitHub Pages.
          <br />
          Backend: Node.js + Express + SQLite, gehostet auf Railway.
        </p>
      </div>
    </div>
  );
}
