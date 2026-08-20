"use client";

import type { CharacterCard, GameRun, StoryNode } from "./types";
import { getPreset } from "./presets";

const RUNS_KEY = "parallel-her:runs";
const SESSION_KEY = "parallel-her:guest";
const TTL = 24 * 60 * 60 * 1000;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  try { return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
};

export function ensureGuest() {
  if (typeof window === "undefined") return;
  const current = safeParse<{ expiresAt: number } | null>(localStorage.getItem(SESSION_KEY), null);
  if (!current || current.expiresAt < Date.now()) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ id: crypto.randomUUID(), expiresAt: Date.now() + TTL }));
    localStorage.removeItem(RUNS_KEY);
  }
}

export function allRuns(): GameRun[] {
  ensureGuest();
  const runs = safeParse<GameRun[]>(localStorage.getItem(RUNS_KEY), []);
  const valid = runs.filter((run) => !run.presetId || Boolean(getPreset(run.presetId)));
  if (valid.length !== runs.length) localStorage.setItem(RUNS_KEY, JSON.stringify(valid));
  return valid;
}

export function saveRun(run: GameRun) {
  const runs = allRuns().filter((item) => item.id !== run.id);
  localStorage.setItem(RUNS_KEY, JSON.stringify([run, ...runs]));
}

export function getRun(id: string) { return allRuns().find((run) => run.id === id); }

export function createPresetRun(presetId: string) {
  const preset = getPreset(presetId);
  if (!preset) throw new Error("预设角色不存在");
  const run: GameRun = {
    id: crypto.randomUUID(), presetId, currentIndex: 0, choices: [], branch: 1,
    createdAt: Date.now(), updatedAt: Date.now(), finished: false,
    character: { id: preset.id, name: preset.name, age: preset.age, portrait: preset.portrait, background: preset.situation, goal: preset.tagline, resources: ["已有生活经验", "仍可调动的人际支持"], dilemma: preset.situation, isCustom: false },
  };
  saveRun(run); return run;
}

export function createCustomRun(character: CharacterCard) {
  const run: GameRun = { id: crypto.randomUUID(), character, currentIndex: 0, choices: [], branch: 1, createdAt: Date.now(), updatedAt: Date.now(), finished: false };
  saveRun(run); return run;
}

export function customNodes(character: CharacterCard): StoryNode[] {
  const base = getPreset("test-story")!.nodes;
  return base.map((node, index) => ({ ...node, id: `custom-${index + 1}`, title: index === 0 ? "生活按下暂停键" : node.title, scene: index === 0 ? `${character.name}看着自己写下的处境：${character.dilemma}。现实没有立刻给出答案，但三个可以尝试的方向正在出现。` : node.scene.replace(/她/g, character.name), choices: node.choices.map((choice, c) => ({ ...choice, id: `custom-${index + 1}-${c}` })) }));
}

export function nodesForRun(run: GameRun) { return run.presetId ? getPreset(run.presetId)!.nodes : customNodes(run.character); }
