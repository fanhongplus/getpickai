// src/lib/matcher.test.ts
// 适配版本：6 身份 × 52 痛点 × 3 预算 × 143 工作流

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

const EXPECTED_IDENTITY_IDS = [
  "ecommerce",
  "video-creator",
  "podcaster",
  "writer",
  "student",
  "developer",
];

const EXPECTED_PAINPOINT_COUNTS: Record<string, number> = {
  ecommerce: 13,
  "video-creator": 9,
  podcaster: 5,
  writer: 8,
  student: 12,
  developer: 5,
};

// ============================================================
// 测试组 1：正常匹配成功
// ============================================================
describe("组1: 正常匹配成功", () => {

  test("1.1 跨境电商 + 独立站商品描述 + free → 完整 workflow", () => {
    const result = matchWorkflow(data, "ecommerce", "product-desc", "free");
    expect(result).not.toBeNull();
    expect(result!.title).toBeTruthy();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
    expect(result!.tools.length).toBeLessThanOrEqual(3);
    result!.tools.forEach((tool) => {
      expect(tool.name).toBeTruthy();
      expect(tool.slug).toMatch(/^[a-z0-9-]+$/);
      expect(tool.step).toBeTruthy();
      expect(tool.cost).toBeTruthy();
    });
  });

  test("1.2 留学生 + 论文降重 + paid → 最后一步是查重", () => {
    const result = matchWorkflow(data, "student", "paper-rewrite", "paid");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBe(3);
    expect(result!.tools[result!.tools.length - 1].slug).toBe("copyleaks");
  });

  test("1.3 独立开发者 + AI辅助编程 + paid → 完整 workflow", () => {
    const result = matchWorkflow(data, "developer", "ai-coding", "paid");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.4 视频创作者 + AI视频生成 + cn-free → 含国产工具", () => {
    const result = matchWorkflow(data, "video-creator", "ai-video-generation", "cn-free");
    expect(result).not.toBeNull();
    const slugs = result!.tools.map((t) => t.slug);
    const hasChinese = slugs.some((s) =>
      ["kling-ai", "dreamina", "hailuo-ai", "doubao", "tongyi-qianwen", "capcut", "jianying"].includes(s)
    );
    expect(hasChinese).toBe(true);
  });

  test("1.5 图文博主 + 小红书 + cn-free → 完整 workflow", () => {
    const result = matchWorkflow(data, "writer", "xiaohongshu", "cn-free");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.6 同一痛点三种预算返回不同方案", () => {
    const free = matchWorkflow(data, "ecommerce", "product-desc", "free");
    const paid = matchWorkflow(data, "ecommerce", "product-desc", "paid");
    const cnFree = matchWorkflow(data, "ecommerce", "product-desc", "cn-free");
    expect(free).not.toBeNull();
    expect(paid).not.toBeNull();
    expect(cnFree).not.toBeNull();
    const titles = new Set([free!.title, paid!.title, cnFree!.title]);
    expect(titles.size).toBe(3);
  });

  test("1.7 所有痛点至少有一种预算方案", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        const f = matchWorkflow(data, identity.id, pp.id, "free");
        const p = matchWorkflow(data, identity.id, pp.id, "paid");
        const c = matchWorkflow(data, identity.id, pp.id, "cn-free");
        expect(f !== null || p !== null || c !== null).toBe(true);
      });
    });
  });

  test("1.8 所有 tool.slug 格式合法", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        (["free", "paid", "cn-free"] as const).forEach((b) => {
          const wf = matchWorkflow(data, identity.id, pp.id, b);
          if (wf) wf.tools.forEach((t) => expect(t.slug).toMatch(/^[a-z0-9-]+$/));
        });
      });
    });
  });
});

// ============================================================
// 测试组 2：非法输入回退
// ============================================================
describe("组2: 非法输入回退", () => {

  test("2.1 不存在的 identityId → null", () => {
    expect(matchWorkflow(data, "GHOST", "product-desc", "free")).toBeNull();
  });

  test("2.2 不存在的 painpointId → null", () => {
    expect(matchWorkflow(data, "ecommerce", "GHOST", "free")).toBeNull();
  });

  test("2.3 空字符串 → null", () => {
    expect(matchWorkflow(data, "", "", "free")).toBeNull();
  });

  test("2.4 非法 budget → null", () => {
    expect(matchWorkflow(data, "ecommerce", "product-desc", "premium" as unknown as "free")).toBeNull();
  });

  test("2.5 getPainpointsByIdentity 非法 id → 空数组", () => {
    expect(getPainpointsByIdentity(data, "hacker")).toEqual([]);
  });

  test("2.6 getAvailableBudgets 非法 id → 全 false", () => {
    expect(getAvailableBudgets(data, "x", "y")).toEqual({ free: false, paid: false });
  });

  test("2.7 旧 id 'creator' → null", () => {
    expect(matchWorkflow(data, "creator", "video-script", "free")).toBeNull();
  });
});

// ============================================================
// 测试组 3：JSON 数据缺失容错
// ============================================================
describe("组3: JSON 数据缺失容错", () => {

  test("3.1 合法数据 → valid: true", () => {
    const { valid, errors } = validateMatcherData(matcherJson);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test("3.2 identities 空 → false", () => {
    expect(validateMatcherData({ identities: [] }).valid).toBe(false);
  });

  test("3.3 缺 workflows → false", () => {
    const bad = { identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P" }] }] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.4 tools 空数组 → false", () => {
    const bad = { identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: { free: { title: "X", tools: [] } } }] }] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.5 tool 缺字段 → false", () => {
    const bad = { identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: { free: { title: "X", tools: [{ name: "只有名字" }] } } }] }] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.6 id 重复 → false", () => {
    const bad = { identities: [
      { id: "dup", label: "A", icon: "🅰️", painpoints: [{ id: "p1", label: "P", workflows: { free: { title: "T", tools: [{ name: "A", slug: "a", step: "s", cost: "0" }, { name: "B", slug: "b", step: "s", cost: "0" }] } } }] },
      { id: "dup", label: "B", icon: "🅱️", painpoints: [{ id: "p2", label: "P", workflows: { paid: { title: "T", tools: [{ name: "C", slug: "c", step: "s", cost: "$1" }, { name: "D", slug: "d", step: "s", cost: "$2" }] } } }] },
    ] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.7 workflows 全空 → false", () => {
    const bad = { identities: [{ id: "t", label: "T", icon: "🧪", painpoints: [{ id: "p", label: "P", workflows: {} }] }] };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.8 垃圾数据不崩溃", () => {
    [null, undefined, 42, "str", true, []].forEach((junk) => {
      expect(() => validateMatcherData(junk)).not.toThrow();
      expect(validateMatcherData(junk).valid).toBe(false);
    });
  });
});

// ============================================================
// 测试组 4：联动菜单正确性
// ============================================================
describe("组4: 联动菜单正确性", () => {

  test("4.1 6个身份痛点 id 无交集", () => {
    const allSets = EXPECTED_IDENTITY_IDS.map((id) => new Set(getPainpointsByIdentity(data, id).map((p) => p.id)));
    for (let i = 0; i < allSets.length; i++) {
      for (let j = i + 1; j < allSets.length; j++) {
        const overlap = [...allSets[i]].filter((id) => allSets[j].has(id));
        expect(overlap).toHaveLength(0);
      }
    }
  });

  test("4.2 每身份至少1个痛点", () => {
    getIdentities(data).forEach((i) => expect(getPainpointsByIdentity(data, i.id).length).toBeGreaterThanOrEqual(1));
  });

  test("4.3 getAvailableBudgets 与 matchWorkflow 一致", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        const b = getAvailableBudgets(data, identity.id, pp.id);
        expect(b.free).toBe(matchWorkflow(data, identity.id, pp.id, "free") !== null);
        expect(b.paid).toBe(matchWorkflow(data, identity.id, pp.id, "paid") !== null);
      });
    });
  });

  test("4.4 返回结构仅含 id+label", () => {
    EXPECTED_IDENTITY_IDS.forEach((id) => {
      getPainpointsByIdentity(data, id).forEach((pp) => expect(Object.keys(pp).sort()).toEqual(["id", "label"]));
    });
  });

  test("4.5 getIdentities 返回6项", () => {
    const list = getIdentities(data);
    expect(list.length).toBe(6);
    list.forEach((item) => {
      expect(Object.keys(item).sort()).toEqual(["icon", "id", "label"]);
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
    });
  });
});

// ============================================================
// 测试组 5：数据与函数交叉完整性
// ============================================================
describe("组5: 数据与函数交叉完整性", () => {

  test("5.1 身份列表一致", () => {
    expect(getIdentities(data).map((i) => i.id).sort()).toEqual([...EXPECTED_IDENTITY_IDS].sort());
  });

  test("5.2 痛点数量一致", () => {
    getIdentities(data).forEach((i) => expect(getPainpointsByIdentity(data, i.id).length).toBe(EXPECTED_PAINPOINT_COUNTS[i.id]));
  });

  test("5.3 总痛点=52 总工作流=143", () => {
    let pp = 0, wf = 0;
    getIdentities(data).forEach((i) => {
      const pps = getPainpointsByIdentity(data, i.id);
      pp += pps.length;
      pps.forEach((p) => {
        (["free", "paid", "cn-free"] as const).forEach((b) => { if (matchWorkflow(data, i.id, p.id, b)) wf++; });
      });
    });
    expect(pp).toBe(52);
    expect(wf).toBe(143);
  });

  test("5.4 所有 step ≤ 80 字符", () => {
    getIdentities(data).forEach((i) => {
      getPainpointsByIdentity(data, i.id).forEach((p) => {
        (["free", "paid", "cn-free"] as const).forEach((b) => {
          const wf = matchWorkflow(data, i.id, p.id, b);
          if (wf) wf.tools.forEach((t) => expect(t.step.length).toBeLessThanOrEqual(80));
        });
      });
    });
  });

  test("5.5 全遍历不抛异常", () => {
    [...getIdentities(data).map((i) => i.id), "fake"].forEach((iid) => {
      [...getPainpointsByIdentity(data, iid).map((p) => p.id), "fake"].forEach((pid) => {
        ["free", "paid", "cn-free", "invalid"].forEach((b) => {
          expect(() => matchWorkflow(data, iid, pid, b as unknown as "free")).not.toThrow();
        });
      });
    });
  });

  test("5.6 无非法 slug 重复", () => {
    getIdentities(data).forEach((i) => {
      getPainpointsByIdentity(data, i.id).forEach((p) => {
        (["free", "paid", "cn-free"] as const).forEach((b) => {
          const wf = matchWorkflow(data, i.id, p.id, b);
          if (wf) {
            const slugs = wf.tools.map((t) => t.slug);
            slugs.filter((s, idx) => slugs.indexOf(s) !== idx).forEach((dup) => {
              if (dup !== "canva") fail(`${i.id}/${p.id}/${b} 中 ${dup} 重复`);
            });
          }
        });
      });
    });
  });

  test("5.7 cn-free 覆盖 ≥ 35 个痛点", () => {
    let count = 0;
    getIdentities(data).forEach((i) => {
      getPainpointsByIdentity(data, i.id).forEach((p) => {
        if (matchWorkflow(data, i.id, p.id, "cn-free")) count++;
      });
    });
    expect(count).toBeGreaterThanOrEqual(35);
  });

  test("5.8 全链路畅通", () => {
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
