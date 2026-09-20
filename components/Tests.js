"use client";

import { useMemo } from "react";
import { todayStr, uid } from "../lib/time";
import { CategorySelect, catInfo } from "./ui";

const num = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

function pctOf(t) {
  const score = num(t.score);
  const max = num(t.max);
  if (score === null || !max) return null;
  return Math.round((score / max) * 1000) / 10;
}

function Trend({ points }) {
  if (points.length < 2) return null;
  const w = 360;
  const h = 110;
  const pad = 18;
  const values = points.map((p) => p.pct);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i) => pad + (i * (w - pad * 2)) / (points.length - 1);
  const y = (v) => h - pad - ((v - min) / span) * (h - pad * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(p.pct)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="trend" role="img" aria-label="Test scores over time">
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" />
      {points.map((p, i) => (
        <g key={p.id}>
          <circle cx={x(i)} cy={y(p.pct)} r="4" fill="var(--hl)" stroke="currentColor" strokeWidth="1.5" />
          <text x={x(i)} y={y(p.pct) - 9} textAnchor="middle" fontSize="10" fill="currentColor">
            {p.pct}%
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function Tests({ tests, categories, update }) {
  const setTests = (fn) => update((s) => ({ ...s, tests: fn(s.tests) }));

  function add() {
    setTests((list) => [
      {
        id: uid("test"),
        name: `Test ${list.length + 1}`,
        date: todayStr(),
        category: categories[0]?.id || "",
        score: "",
        max: "",
        notes: "",
      },
      ...list,
    ]);
  }

  const patch = (id, key, value) => setTests((list) => list.map((t) => (t.id === id ? { ...t, [key]: value } : t)));
  const remove = (id) => setTests((list) => list.filter((t) => t.id !== id));

  const scored = useMemo(
    () =>
      tests
        .map((t) => ({ ...t, pct: pctOf(t) }))
        .filter((t) => t.pct !== null && t.date)
        .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)),
    [tests]
  );

  const best = scored.length ? Math.max(...scored.map((t) => t.pct)) : null;
  const latest = scored.length ? scored[scored.length - 1].pct : null;
  const avg = scored.length ? Math.round((scored.reduce((s, t) => s + t.pct, 0) / scored.length) * 10) / 10 : null;

  return (
    <div className="stack">
      <section className="panel">
        <div className="panelHead">
          <h2>Tests &amp; assessments</h2>
          <button className="btn primary" onClick={add}>
            Add a test
          </button>
        </div>
        <p className="muted">
          Course quizzes, end-sem papers, MTP presentations, placement mock interviews — log the score and which
          section it belongs to. The percentage adds up on its own.
        </p>

        {scored.length > 0 && (
          <div className="statRow">
            <div className="stat">
              <strong>{tests.length}</strong>
              <span>tests logged</span>
            </div>
            <div className="stat">
              <strong>{latest}%</strong>
              <span>latest score</span>
            </div>
            <div className="stat">
              <strong>{best}%</strong>
              <span>best score</span>
            </div>
            <div className="stat">
              <strong>{avg}%</strong>
              <span>average score</span>
            </div>
          </div>
        )}
        <Trend points={scored} />
      </section>

      <section className="panel">
        {tests.length === 0 ? (
          <p className="muted">No tests yet. Add one after your next quiz, paper or mock interview.</p>
        ) : (
          <div className="tableWrap">
            <table className="mockTable">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Date</th>
                  <th>Section</th>
                  <th>Score</th>
                  <th>Out of</th>
                  <th>%</th>
                  <th>What to fix</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tests.map((t) => {
                  const cat = catInfo(categories, t.category);
                  return (
                    <tr key={t.id}>
                      <td>
                        <input aria-label="Test name" value={t.name} onChange={(e) => patch(t.id, "name", e.target.value)} />
                      </td>
                      <td>
                        <input aria-label="Date" type="date" value={t.date} onChange={(e) => patch(t.id, "date", e.target.value)} />
                      </td>
                      <td>
                        <CategorySelect
                          aria-label="Section"
                          categories={categories}
                          value={t.category}
                          onChange={(v) => patch(t.id, "category", v)}
                          style={{ "--cat": cat.color }}
                        />
                      </td>
                      <td>
                        <input
                          aria-label="Score"
                          className="narrow"
                          type="number"
                          value={t.score}
                          onChange={(e) => patch(t.id, "score", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          aria-label="Out of"
                          className="narrow"
                          type="number"
                          value={t.max}
                          onChange={(e) => patch(t.id, "max", e.target.value)}
                        />
                      </td>
                      <td className="totalCell">{pctOf(t) === null ? "–" : `${pctOf(t)}%`}</td>
                      <td>
                        <input
                          aria-label="What to fix"
                          className="notesCell"
                          value={t.notes}
                          placeholder="Weak topics, silly mistakes…"
                          onChange={(e) => patch(t.id, "notes", e.target.value)}
                        />
                      </td>
                      <td>
                        <button className="miniBtn" onClick={() => remove(t.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
