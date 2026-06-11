import { useEffect } from 'react';

export function RulesPage() {
  useEffect(() => { document.title = 'Regeln — WM Tipps 2026'; }, []);
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
            <span className="text-2xl font-bold text-gray-500 min-w-[2rem] text-center">0</span>
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

      {/* Einsatz & Gewinnverteilung */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-wm-dark mb-4">Einsatz & Gewinnverteilung</h2>

        <div className="flex items-center gap-3 mb-5 p-3 bg-wm-dark/5 rounded-xl">
          <span className="text-2xl">💰</span>
          <p className="text-sm text-gray-700">
            Der Einsatz beträgt <span className="font-semibold">5 €</span> pro Person für das gesamte Turnier.
          </p>
        </div>

        <div className="flex items-start gap-3 mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
          <span className="text-2xl">⚡</span>
          <p className="text-sm text-gray-700">
            Ab der <span className="font-semibold">K.O.-Runde</span> verdoppeln sich die Punkte —
            ein exaktes Ergebnis gibt dann <span className="font-semibold text-wm-gold">6 Punkte</span>,
            ein richtiger Ausgang <span className="font-semibold text-wm-gold">2 Punkte</span>.
          </p>
        </div>

        <h3 className="text-sm font-bold text-gray-700 mb-3">Preisverteilung am Turnierende</h3>
        <div className="space-y-2">
          {[
            { place: '🥇 1. Platz', pct: '40 %', color: 'bg-yellow-50 border-yellow-300' },
            { place: '🥈 2. Platz', pct: '30 %', color: 'bg-gray-50 border-gray-300' },
            { place: '🥉 3. Platz', pct: '15 %', color: 'bg-orange-50 border-orange-200' },
            { place: '4. Platz',    pct: '15 %', color: 'bg-orange-50 border-orange-200' },
          ].map(({ place, pct, color }) => (
            <div key={place} className={`flex items-center justify-between px-4 py-2.5 rounded-lg border ${color}`}>
              <span className="text-sm font-medium text-gray-800">{place}</span>
              <span className="text-sm font-bold text-wm-dark">{pct}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Der Gewinnbetrag wird auf Basis der tatsächlichen Teilnehmerzahl berechnet.
        </p>
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
