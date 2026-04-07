// src/lib/matcher.test.ts
// 适配版本：5 身份 × 27 痛点 × 54 工作流

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

// 预期身份 ID 列表（与 matcher.json 一致）
const EXPECTED_IDENTITY_IDS = [
  "ecommerce",
  "video-creator",
  "podcaster",
  "writer",
  "student",
];

// 预期每个身份的痛点数量
const EXPECTED_PAINPOINT_COUNTS: Record<string, number> = {
  ecommerce: 7,
  "video-creator": 5,
  podcaster: 4,
  writer: 4,
  student: 7,
};

// ============================================================
// 测试组 1：正常匹配成功
// ============================================================
describe("组1: 正常匹配成功", () => {

  test("1.1 跨境电商 + 独立站商品描述 + free → 返回完整 workflow", () => {
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

  test("1.2 留学生 + 论文降重 + paid → 返回含查重验证的完整链路", () => {
    const result = matchWorkflow(data, "student", "paper-rewrite", "paid");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBe(3);
    // 最后一步应该是查重工具（Copyleaks）
    const lastTool = result!.tools[result!.tools.length - 1];
    expect(lastTool.slug).toBe("copyleaks");
  });

  test("1.3 播客主 + 录制与音质处理 + free → 返回完整 workflow", () => {
    const result = matchWorkflow(data, "podcaster", "podcast-recording", "free");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.4 视频创作者 + 短视频批量生产 + paid → 返回完整 workflow", () => {
    const result = matchWorkflow(data, "video-creator", "short-video-batch", "paid");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.5 图文博主 + 小红书种草图文 + free → 返回完整 workflow", () => {
    const result = matchWorkflow(data, "writer", "xiaohongshu", "free");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.6 同一痛点不同预算 → 返回不同方案", () => {
    const free = matchWorkflow(data, "ecommerce", "product-desc", "free");
    const paid = matchWorkflow(data, "ecommerce", "product-desc", "paid");
    if (free && paid) {
      expect(free.title).not.toEqual(paid.title);
    }
    expect(free !== null || paid !== null).toBe(true);
  });

  test("1.7 所有身份×所有痛点 → 至少有一种预算方案", () => {
    const identities = getIdentities(data);
    identities.forEach((identity) => {
      const pps = getPainpointsByIdentity(data, identity.id);
      expect(pps.length).toBeGreaterThan(0);
      pps.forEach((pp) => {
        const f = matchWorkflow(data, identity.id, pp.id, "free");
        const p = matchWorkflow(data, identity.id, pp.id, "paid");
        expect(f !== null || p !== null).toBe(true);
      });
    });
  });

  test("1.8 所有 tool.slug 格式合法", () => {
    const identities = getIdentities(data);
    identities.forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        (["free", "paid"] as const).forEach((b) => {
          const wf = matchWorkflow(data, identity.id, pp.id, b);
          if (wf) {
            wf.tools.forEach((t) => {
              expect(t.slug).toMatch(/^[a-z0-9-]+$/);
            });
          }
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

  test("2.3 空字符串三连 → null", () => {
    expect(matchWorkflow(data, "", "", "free")).toBeNull();
  });

  test("2.4 budget 传入非 free/paid → null", () => {
    expect(matchWorkflow(data, "ecommerce", "product-desc", "premium" as unknown as "free")).toBeNull();
  });

  test("2.5 getPainpointsByIdentity 非法 id → 空数组", () => {
    const result = getPainpointsByIdentity(data, "hacker");
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  test("2.6 getAvailableBudgets 非法 id → { free: false, paid: false }", () => {
    expect(getAvailableBudgets(data, "x", "y")).toEqual({ free: false, paid: false });
  });

  test("2.7 用旧身份 id 'creator' 查询 → null（已拆分为 video-creator/podcaster/writer）", () => {
    expect(matchWorkflow(data, "creator", "video-script", "free")).toBeNull();
    expect(getPainpointsByIdentity(data, "creator")).toEqual([]);
  });
});

// ============================================================
// 测试组 3：JSON 数据缺失 / 畸形时的容错
// ============================================================
describe("组3: JSON 数据缺失容错", () => {

  test("3.1 合法 matcher.json → valid: true", () => {
    const { valid, errors } = validateMatcherData(matcherJson);
    expect(valid).toBe(true);
    expect(errors).toHaveLength(0);
  });

  test("3.2 identities 空数组 → valid: false", () => {
    const { valid } = validateMatcherData({ identities: [] });
    expect(valid).toBe(false);
  });

  test("3.3 painpoint 缺 workflows → valid: false", () => {
    const bad = {
      identities: [{
        id: "t", label: "T", icon: "🧪",
        painpoints: [{ id: "p", label: "P" }],
      }],
    };
    const { valid, errors } = validateMatcherData(bad);
    expect(valid).toBe(false);
    expect(errors.some((e: string) => /workflow/i.test(e))).toBe(true);
  });

  test("3.4 tools 空数组 → valid: false", () => {
    const bad = {
      identities: [{
        id: "t", label: "T", icon: "🧪",
        painpoints: [{
          id: "p", label: "P",
          workflows: { free: { title: "X", tools: [] } },
        }],
      }],
    };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.5 tool 缺必要字段 → valid: false", () => {
    const bad = {
      identities: [{
        id: "t", label: "T", icon: "🧪",
        painpoints: [{
          id: "p", label: "P",
          workflows: { free: { title: "X", tools: [{ name: "只有名字" }] } },
        }],
      }],
    };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.6 identity.id 重复 → valid: false", () => {
    const bad = {
      identities: [
        { id: "dup", label: "A", icon: "🅰️", painpoints: [{ id: "p1", label: "P1", workflows: { free: { title: "T", tools: [{ name: "A", slug: "a", step: "s", cost: "0" }, { name: "B", slug: "b", step: "s", cost: "0" }] } } }] },
        { id: "dup", label: "B", icon: "🅱️", painpoints: [{ id: "p2", label: "P2", workflows: { paid: { title: "T", tools: [{ name: "C", slug: "c", step: "s", cost: "$1" }, { name: "D", slug: "d", step: "s", cost: "$2" }] } } }] },
      ],
    };
    const { valid, errors } = validateMatcherData(bad);
    expect(valid).toBe(false);
    expect(errors.some((e: string) => /重复|duplicate/i.test(e))).toBe(true);
  });

  test("3.7 workflows 中 free 和 paid 都缺 → valid: false", () => {
    const bad = {
      identities: [{
        id: "t", label: "T", icon: "🧪",
        painpoints: [{ id: "p", label: "P", workflows: {} }],
      }],
    };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.8 传入 null / undefined / 数字 / 字符串 → 不崩溃", () => {
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

  test("4.1 所有5个身份返回不同的痛点列表，id 无交集", () => {
    const allPainpointSets = EXPECTED_IDENTITY_IDS.map((id) => ({
      id,
      painpoints: getPainpointsByIdentity(data, id),
      idSet: new Set(getPainpointsByIdentity(data, id).map((p) => p.id)),
    }));

    // 任意两组身份的痛点 id 无交集
    for (let i = 0; i < allPainpointSets.length; i++) {
      for (let j = i + 1; j < allPainpointSets.length; j++) {
        const overlap = [...allPainpointSets[i].idSet].filter(
          (id) => allPainpointSets[j].idSet.has(id)
        );
        expect(overlap).toHaveLength(0);
      }
    }
  });

  test("4.2 每个身份至少 1 个痛点", () => {
    getIdentities(data).forEach((identity) => {
      expect(getPainpointsByIdentity(data, identity.id).length).toBeGreaterThanOrEqual(1);
    });
  });

  test("4.3 getAvailableBudgets 与 matchWorkflow 结果一致", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        const budgets = getAvailableBudgets(data, identity.id, pp.id);
        expect(budgets.free).toBe(matchWorkflow(data, identity.id, pp.id, "free") !== null);
        expect(budgets.paid).toBe(matchWorkflow(data, identity.id, pp.id, "paid") !== null);
      });
    });
  });

  test("4.4 getPainpointsByIdentity 返回结构仅含 id + label", () => {
    EXPECTED_IDENTITY_IDS.forEach((identityId) => {
      getPainpointsByIdentity(data, identityId).forEach((pp) => {
        expect(Object.keys(pp).sort()).toEqual(["id", "label"]);
      });
    });
  });

  test("4.5 getIdentities 返回5项，每项含 id + label + icon", () => {
    const list = getIdentities(data);
    expect(list.length).toBe(5);
    list.forEach((item) => {
      const keys = Object.keys(item).sort();
      expect(keys).toEqual(["icon", "id", "label"]);
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// 测试组 5：数据与函数交叉完整性
// ============================================================
describe("组5: 数据与函数交叉完整性", () => {

  test("5.1 身份列表与预期完全一致", () => {
    const ids = getIdentities(data).map((i) => i.id).sort();
    expect(ids).toEqual([...EXPECTED_IDENTITY_IDS].sort());
  });

  test("5.2 每个身份的痛点数量与预期一致", () => {
    getIdentities(data).forEach((identity) => {
      const expected = EXPECTED_PAINPOINT_COUNTS[identity.id];
      const actual = getPainpointsByIdentity(data, identity.id).length;
      expect(actual).toBe(expected);
    });
  });

  test("5.3 总痛点数 = 27，总工作流数 = 54", () => {
    let totalPainpoints = 0;
    let totalWorkflows = 0;

    getIdentities(data).forEach((identity) => {
      const pps = getPainpointsByIdentity(data, identity.id);
      totalPainpoints += pps.length;
      pps.forEach((pp) => {
        if (matchWorkflow(data, identity.id, pp.id, "free")) totalWorkflows++;
        if (matchWorkflow(data, identity.id, pp.id, "paid")) totalWorkflows++;
      });
    });

    expect(totalPainpoints).toBe(27);
    expect(totalWorkflows).toBe(54);
  });

  test("5.4 所有 step 字段 ≤ 80 字符（移动端可读性）", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        (["free", "paid"] as const).forEach((b) => {
          const wf = matchWorkflow(data, identity.id, pp.id, b);
          if (wf) {
            wf.tools.forEach((t) => {
              expect(t.step.length).toBeLessThanOrEqual(80);
            });
          }
        });
      });
    });
  });

  test("5.5 全遍历不抛异常（含非法输入）", () => {
    const allIdentityIds = [...getIdentities(data).map((i) => i.id), "fake"];
    const allBudgets = ["free", "paid", "invalid"] as const;
    allIdentityIds.forEach((iid) => {
      const pps = getPainpointsByIdentity(data, iid);
      const ppIds = [...pps.map((p) => p.id), "fake"];
      ppIds.forEach((pid) => {
        allBudgets.forEach((b) => {
          expect(() => matchWorkflow(data, iid, pid, b as unknown as "free")).not.toThrow();
        });
      });
    });
  });

  test("5.6 每条工作流内无工具 slug 重复（防止同一工具出现两次）", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        (["free", "paid"] as const).forEach((b) => {
          const wf = matchWorkflow(data, identity.id, pp.id, b);
          if (wf) {
            const slugs = wf.tools.map((t) => t.slug);
            const uniqueSlugs = new Set(slugs);
            // 如果有重复 slug，说明同一工具出现了两次
            // 注意：Canva 和 Canva Pro 共用 slug 'canva' 是允许的（同一产品不同版本）
            // 但完全相同的 slug 出现在同一工作流中需要检查
            if (slugs.length !== uniqueSlugs.size) {
              // 允许 canva 出现两次（免费版+Pro版场景），其他工具不允许重复
              const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
              duplicates.forEach((dup) => {
                // canva 是唯一允许的例外（免费版和 Pro 版共用 slug）
                if (dup !== "canva") {
                  fail(`工作流 ${identity.id}/${pp.id}/${b} 中工具 ${dup} 重复出现`);
                }
              });
            }
          }
        });
      });
    });
  });

  test("5.7 validateMatcherData 通过后全链路畅通", () => {
    const { valid } = validateMatcherData(data);
    expect(valid).toBe(true);

    const identities = getIdentities(data);
    expect(identities.length).toBe(5);

    // 对每个身份验证完整链路
    identities.forEach((identity) => {
      const pps = getPainpointsByIdentity(data, identity.id);
      expect(pps.length).toBeGreaterThan(0);

      const budgets = getAvailableBudgets(data, identity.id, pps[0].id);
      const b = budgets.free ? "free" : "paid";
      const wf = matchWorkflow(data, identity.id, pps[0].id, b as "free" | "paid");
      expect(wf).not.toBeNull();
      expect(wf!.tools.length).toBeGreaterThanOrEqual(2);
    });
  });
});
