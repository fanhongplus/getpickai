"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import matcherJson from "../../data/matcher.json";
import {
  getIdentities,
  getPainpointsByIdentity,
  matchWorkflow,
} from "@/lib/matcher";
import type { MatcherData, MatcherWorkflow } from "@/lib/types";

const data = matcherJson as MatcherData;

export default function ScenarioMatcher() {
  const [identityId, setIdentityId] = useState("");
  const [painpointId, setPainpointId] = useState("");
  const [budget, setBudget] = useState("");
  const [result, setResult] = useState<MatcherWorkflow | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState("");

  const identities = useMemo(() => getIdentities(data), []);
  const painpoints = useMemo(
    () => (identityId ? getPainpointsByIdentity(data, identityId) : []),
    [identityId]
  );

  // 身份切换 → 重置下游
  useEffect(() => {
    setPainpointId("");
    setBudget("");
    setResult(null);
    setShowResult(false);
    setError("");
  }, [identityId]);

  function handleMatch() {
    if (!identityId || !painpointId || !budget) {
      setError("请完成所有选项后再匹配");
      setShowResult(false);
      return;
    }
    setError("");
    const wf = matchWorkflow(
      data,
      identityId,
      painpointId,
      budget as "free" | "paid"
    );
    setResult(wf);
    setShowResult(true);
  }

  const isPainpointDisabled = !identityId;

  return (
    <div data-testid="scenario-matcher" className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text leading-heading">
          AI 实战场景匹配器
        </h2>
        <p className="mt-3 text-text-secondary text-sm md:text-base max-w-2xl mx-auto">
          告诉我你是谁、要解决什么问题、预算多少，我给你一套即用的 AI 工作流方案。
        </p>
      </div>

      {/* Selector card */}
      <div className="bg-bg-soft border border-border rounded-card p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Identity */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              你是谁？
            </label>
            <select
              data-testid="select-identity"
              value={identityId}
              onChange={(e) => setIdentityId(e.target.value)}
              className="w-full h-11 sm:h-12 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:border-accent transition-colors"
            >
              <option value="" disabled>
                请选择身份...
              </option>
              {identities.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.icon} {i.label}
                </option>
              ))}
            </select>
          </div>

          {/* Painpoint */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              要解决什么？
            </label>
            <select
              data-testid="select-painpoint"
              value={painpointId}
              onChange={(e) => setPainpointId(e.target.value)}
              disabled={isPainpointDisabled}
              className={`w-full h-11 sm:h-12 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:border-accent transition-colors ${
                isPainpointDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="" disabled>
                {isPainpointDisabled ? "先选身份" : "请选择痛点..."}
              </option>
              {painpoints.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-2">
              预算？
            </label>
            <select
              data-testid="select-budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full h-11 sm:h-12 px-3 rounded-lg border border-border bg-bg text-sm text-text focus:outline-none focus:border-accent transition-colors"
            >
              <option value="" disabled>
                请选择预算...
              </option>
              <option value="free">免费</option>
              <option value="paid">付费</option>
            </select>
          </div>
        </div>

        {/* Match button */}
        <div className="mt-5 flex justify-center">
          <button
            data-testid="match-button"
            onClick={handleMatch}
            className="h-11 px-8 bg-accent text-white text-sm font-medium rounded-btn hover:bg-accent-hover transition-colors"
          >
            开始匹配 →
          </button>
        </div>

        {/* Error */}
        {error && (
          <p
            data-testid="error-message"
            className="mt-4 text-center text-sm text-tag-video"
          >
            {error}
          </p>
        )}
      </div>

      {/* Result */}
      {showResult && result && (
        <div
          data-testid="workflow-result"
          className="mt-6 bg-bg border border-border rounded-card p-5 md:p-6 animate-fade-in"
        >
          <div className="flex items-start gap-3 mb-5">
            <div className="text-2xl">✨</div>
            <div>
              <div className="text-xs text-accent font-medium mb-1">
                为你推荐的方案
              </div>
              <h3 className="text-lg md:text-xl font-bold text-text leading-heading">
                {result.title}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {result.tools.map((tool, idx) => (
              <div
                key={`${tool.slug}-${idx}`}
                data-testid="tool-step"
                className="bg-bg-soft border border-border rounded-card p-4 hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 text-accent font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="font-semibold text-text hover:text-accent transition-colors"
                  >
                    {tool.name}
                  </Link>
                </div>
                <p className="text-sm text-text-secondary leading-body mb-3">
                  {tool.step}
                </p>
                <span className="inline-block text-xs px-2 py-0.5 rounded-tag bg-accent/10 text-accent">
                  {tool.cost}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {showResult && !result && (
        <div
          data-testid="empty-state"
          className="mt-6 bg-bg-soft border border-border rounded-card p-8 text-center animate-fade-in"
        >
          <div className="text-4xl mb-3">🤷</div>
          <p className="text-text-secondary text-sm">
            暂无匹配方案，试试调整条件？
          </p>
        </div>
      )}
    </div>
  );
}
