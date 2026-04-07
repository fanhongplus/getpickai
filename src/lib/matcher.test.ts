// src/lib/matcher.test.ts
// 适配版本：6 身份 × 55 痛点 × 3 预算 × 152 工作流 × 108 工具

import {
  validateMatcherData,
  getIdentities,
  getPainpointsByIdentity,
  matchWorkflow,
  getAvailableBudgets,
} from "./matcher";
import type { MatcherData } from "./types";
import matcherJson from "../../data/matcher.json";

const data = matcherJson as MatcherData;

const EXPECTED_IDENTITY_IDS = ["ecommerce", "video-creator", "podcaster", "writer", "student", "developer"];

const EXPECTED_PAINPOINT_COUNTS: Record<string, number> = {
  ecommerce: 14,
  "video-creator": 9,
  podcaster: 5,
  writer: 8,
  student: 14,
  developer: 5,
};

describe("组1: 正常匹配成功", () => {
  test("1.1 电商+商品描述+free → 完整workflow", () => {
    const r = matchWorkflow(data, "ecommerce", "product-desc", "free");
    expect(r).not.toBeNull();
    expect(r!.tools.length).toBeGreaterThanOrEqual(2);
    expect(r!.tools.length).toBeLessThanOrEqual(4);
    r!.tools.forEach((t) => {
      expect(t.name).toBeTruthy();
      expect(t.slug).toMatch(/^[a-z0-9-]+$/);
      expect(t.step).toBeTruthy();
      expect(t.cost).toBeTruthy();
    });
  });

  test("1.2 留学生+论文降重+paid → 最后一步查重", () => {
    const r = matchWorkflow(data, "student", "paper-rewrite", "paid");
    expect(r).not.toBeNull();
    expect(r!.tools[r!.tools.length - 1].slug).toBe("copyleaks");
  });

  test("1.3 开发者+AI编程+paid → 完整workflow", () => {
    const r = matchWorkflow(data, "developer", "ai-coding", "paid");
    expect(r).not.toBeNull();
    expect(r!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.4 视频+AI视频生成+cn-free → 含国产工具", () => {
    const r = matchWorkflow(data, "video-creator", "ai-video-generation", "cn-free");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => ["kling-ai", "dreamina", "hailuo-ai", "capcut", "jianying"].includes(t.slug))).toBe(true);
  });

  test("1.5 电商+评价洞察+paid → 含 Shulex VOC", () => {
    const r = matchWorkflow(data, "ecommerce", "review-insights", "paid");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => t.slug === "shulex-voc")).toBe(true);
  });

  test("1.6 留学生+主动学习+paid → 含 Quizlet", () => {
    const r = matchWorkflow(data, "student", "active-study", "paid");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => t.slug === "quizlet")).toBe(true);
  });

  test("1.7 留学生+长文档阅读+free → 含 PopAI", () => {
    const r = matchWorkflow(data, "student", "document-reading", "free");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => t.slug === "popai")).toBe(true);
  });

  test("1.8 留学生+文献综述+free → 含 Connected Papers", () => {
    const r = matchWorkflow(data, "student", "literature-review", "free");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => t.slug === "connected-papers")).toBe(true);
  });

  test("1.9 留学生+数学理科+free → 含 Socratic", () => {
    const r = matchWorkflow(data, "student", "math-science", "free");
    expect(r).not.toBeNull();
    expect(r!.tools.some((t) => t.slug === "socratic")).toBe(true);
  });

  test("1.10 同一痛点三种预算返回不同方案", () => {
    const f = matchWorkflow(data, "ecommerce", "product-desc", "free");
    const p = matchWorkflow(data, "ecommerce", "product-desc", "paid");
    const c = matchWorkflow(data, "ecommerce", "product-desc", "cn-free");
    expect(new Set([f!.title, p!.title, c!.title]).size).toBe(3);
  });

  test("1.11 所有痛点至少有一种预算方案", () => {
    getIdentities(data).forEach((i) => {
      getPainpointsByIdentity(data, i.id).forEach((pp) => {
        const f = matchWorkflow(data, i.id, pp.id, "free");
        const p = matchWorkflow(data, i.id, pp.id, "paid");
        const c = matchWorkflow(data, i.id, pp.id, "cn-free");
        expect(f !== null || p !== null || c !== null).toBe(true);
      });
    });
  });

  test("1.12 所有 slug 格式合法", () => {
    getIdentities(data).forEach((i) => {
      getPainpointsByIdentity(data, i.id).forEach((pp) => {
        (["free", "paid", "cn-free"] as const).forEach((b) => {
          const wf = matchWorkflow(data, i.id, pp.id, b);
          if (wf) wf.tools.forEach((t) => expect(t.slug).toMatch(/^[a-z0-9-]+$/));
        });
      });
    });
  });
});

describe("组2: 非法输入回退", () => {
  test("2.1 不存在的 identityId → null", () => { expect(matchWorkflow(data, "GHOST", "p", "free")).toBeNull(); });
  test("2.2 不存在的 painpointId → null", () => { expect(matchWorkflow(data, "ecommerce", "GHOST", "free")).toBeNull(); });
  test("2.3 空字符串 → null", () => { expect(matchWorkflow(data, "", "", "free")).toBeNull(); });
  test("2.4 非法 budget → null", () => { expect(matchWorkflow(data, "ecommerce", "product-desc", "premium" as unknown as "free")).toBeNull(); });
  test("2.5 非法 id → 空数组", () => { expect(getPainpointsByIdentity(data, "hacker")).toEqual([]); });
  test("2.6 非法 id → 全 false", () => { expect(getAvailableBudgets(data, "x", "y")).toEqual({ free: false, paid: false }); });
  test("2.7 旧 id 'creator' → null", () => { expect(matchWorkflow(data, "creator", "video-script", "free")).toBeNull(); });
});

describe("组3: JSON 数据缺失容错", () => {
  test("3.1 合法数据 → valid: true", () => { const { valid, errors } = validateMatcherData(matcherJson); expect(valid).toBe(true); expect(errors).toHaveLength(0); });
  test("3.2 identities 空 → false", () => { expect(validateMatcherData({ identities: [] }).valid).toBe(false); });
  test("3.3 缺 workflows → false", () => { expect(validateMatcherData({ identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P" }] }] }).valid).toBe(false); });
  test("3.4 tools 空 → false", () => { expect(validateMatcherData({ identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: { free: { title: "X", tools: [] } } }] }] }).valid).toBe(false); });
  test("3.5 tool 缺字段 → false", () => { expect(validateMatcherData({ identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: { free: { title: "X", tools: [{ name: "A" }] } } }] }] }).valid).toBe(false); });
  test("3.6 id 重复 → false", () => {
    const bad = { identities: [
      { id: "dup", label: "A", icon: "🅰️", painpoints: [{ id: "p1", label: "P", workflows: { free: { title: "T", tools: [{ name: "A", slug: "a", step: "s", cost: "0" }, { name: "B", slug: "b", step: "s", cost: "0" }] } } }] },
      { id: "dup", label: "B", icon: "🅱️", painpoints: [{ id: "p2", label: "P", workflows: { paid: { title: "T", tools: [{ name: "C", slug: "c", step: "s", cost: "$1" }, { name: "D", slug: "d", step: "s", cost: "$2" }] } } }] },
    ] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });
  test("3.7 workflows 全空 → false", () => { expect(validateMatcherData({ identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: {} }] }] }).valid).toBe(false); });
  test("3.8 垃圾数据不崩溃", () => { [null, undefined, 42, "str", true, []].forEach((j) => { expect(() => validateMatcherData(j)).not.toThrow(); expect(validateMatcherData(j).valid).toBe(false); }); });
});

describe("组4: 联动菜单正确性", () => {
  test("4.1 6个身份痛点 id 无交集", () => {
    const sets = EXPECTED_IDENTITY_IDS.map((id) => new Set(getPainpointsByIdentity(data, id).map((p) => p.id)));
    for (let i = 0; i < sets.length; i++) for (let j = i + 1; j < sets.length; j++) expect([...sets[i]].filter((id) => sets[j].has(id))).toHaveLength(0);
  });
  test("4.2 每身份至少1个痛点", () => { getIdentities(data).forEach((i) => expect(getPainpointsByIdentity(data, i.id).length).toBeGreaterThanOrEqual(1)); });
  test("4.3 getAvailableBudgets 一致", () => {
    getIdentities(data).forEach((i) => { getPainpointsByIdentity(data, i.id).forEach((pp) => {
      const b = getAvailableBudgets(data, i.id, pp.id);
      expect(b.free).toBe(matchWorkflow(data, i.id, pp.id, "free") !== null);
      expect(b.paid).toBe(matchWorkflow(data, i.id, pp.id, "paid") !== null);
    }); });
  });
  test("4.4 返回结构仅含 id+label", () => { EXPECTED_IDENTITY_IDS.forEach((id) => { getPainpointsByIdentity(data, id).forEach((pp) => expect(Object.keys(pp).sort()).toEqual(["id", "label"])); }); });
  test("4.5 getIdentities 返回6项", () => { expect(getIdentities(data).length).toBe(6); getIdentities(data).forEach((i) => expect(Object.keys(i).sort()).toEqual(["icon", "id", "label"])); });
});

describe("组5: 数据与函数交叉完整性", () => {
  test("5.1 身份列表一致", () => { expect(getIdentities(data).map((i) => i.id).sort()).toEqual([...EXPECTED_IDENTITY_IDS].sort()); });
  test("5.2 痛点数量一致", () => { getIdentities(data).forEach((i) => expect(getPainpointsByIdentity(data, i.id).length).toBe(EXPECTED_PAINPOINT_COUNTS[i.id])); });
  test("5.3 总痛点=55 总工作流=152", () => {
    let pp = 0, wf = 0;
    getIdentities(data).forEach((i) => { const pps = getPainpointsByIdentity(data, i.id); pp += pps.length;
      pps.forEach((p) => { (["free", "paid", "cn-free"] as const).forEach((b) => { if (matchWorkflow(data, i.id, p.id, b)) wf++; }); });
    });
    expect(pp).toBe(55);
    expect(wf).toBe(152);
  });
  test("5.4 所有 step ≤ 80 字符", () => {
    getIdentities(data).forEach((i) => { getPainpointsByIdentity(data, i.id).forEach((p) => {
      (["free", "paid", "cn-free"] as const).forEach((b) => { const wf = matchWorkflow(data, i.id, p.id, b); if (wf) wf.tools.forEach((t) => expect(t.step.length).toBeLessThanOrEqual(80)); });
    }); });
  });
  test("5.5 每条工作流 2-4 个工具", () => {
    getIdentities(data).forEach((i) => { getPainpointsByIdentity(data, i.id).forEach((p) => {
      (["free", "paid", "cn-free"] as const).forEach((b) => { const wf = matchWorkflow(data, i.id, p.id, b); if (wf) {
        expect(wf.tools.length).toBeGreaterThanOrEqual(2);
        expect(wf.tools.length).toBeLessThanOrEqual(4);
      }});
    }); });
  });
  test("5.6 全遍历不抛异常", () => {
    [...getIdentities(data).map((i) => i.id), "fake"].forEach((iid) => {
      [...getPainpointsByIdentity(data, iid).map((p) => p.id), "fake"].forEach((pid) => {
        ["free", "paid", "cn-free", "invalid"].forEach((b) => { expect(() => matchWorkflow(data, iid, pid, b as unknown as "free")).not.toThrow(); });
      });
    });
  });
  test("5.7 无非法 slug 重复", () => {
    getIdentities(data).forEach((i) => { getPainpointsByIdentity(data, i.id).forEach((p) => {
      (["free", "paid", "cn-free"] as const).forEach((b) => { const wf = matchWorkflow(data, i.id, p.id, b); if (wf) {
        const slugs = wf.tools.map((t) => t.slug);
        slugs.filter((s, idx) => slugs.indexOf(s) !== idx).forEach((dup) => { if (dup !== "canva") fail(`${i.id}/${p.id}/${b} 中 ${dup} 重复`); });
      }});
    }); });
  });
  test("5.8 cn-free ≥ 35 个痛点", () => {
    let c = 0;
    getIdentities(data).forEach((i) => { getPainpointsByIdentity(data, i.id).forEach((p) => { if (matchWorkflow(data, i.id, p.id, "cn-free")) c++; }); });
    expect(c).toBeGreaterThanOrEqual(35);
  });
  test("5.9 全链路畅通", () => {
    expect(validateMatcherData(data).valid).toBe(true);
    getIdentities(data).forEach((i) => {
      const pps = getPainpointsByIdentity(data, i.id);
      expect(pps.length).toBeGreaterThan(0);
      const b = getAvailableBudgets(data, i.id, pps[0].id);
      const budget = b.free ? "free" : "paid";
      const wf = matchWorkflow(data, i.id, pps[0].id, budget as "free" | "paid");
      expect(wf).not.toBeNull();
      expect(wf!.tools.length).toBeGreaterThanOrEqual(2);
    });
  });
});
