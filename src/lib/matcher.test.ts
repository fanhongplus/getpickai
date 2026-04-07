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

  test("1.2 留学生 + 论文降重 + paid → 返回完整 workflow", () => {
    const result = matchWorkflow(data, "student", "paper-rewrite", "paid");
    expect(result).not.toBeNull();
    expect(result!.tools.length).toBeGreaterThanOrEqual(2);
  });

  test("1.3 同一痛点不同预算 → 返回不同方案（如果都存在）", () => {
    const free = matchWorkflow(data, "ecommerce", "product-desc", "free");
    const paid = matchWorkflow(data, "ecommerce", "product-desc", "paid");
    if (free && paid) {
      expect(free.title).not.toEqual(paid.title);
    }
    expect(free !== null || paid !== null).toBe(true);
  });

  test("1.4 所有身份×所有痛点 → 至少有一种预算方案", () => {
    const identities = getIdentities(data);
    expect(identities.length).toBeGreaterThanOrEqual(3);
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

  test("1.5 所有 tool.slug 格式合法", () => {
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
    expect(
      matchWorkflow(
        data,
        "ecommerce",
        "product-desc",
        "premium" as unknown as "free"
      )
    ).toBeNull();
  });

  test("2.5 getPainpointsByIdentity 非法 id → 空数组", () => {
    const result = getPainpointsByIdentity(data, "hacker");
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  test("2.6 getAvailableBudgets 非法 id → { free: false, paid: false }", () => {
    expect(getAvailableBudgets(data, "x", "y")).toEqual({
      free: false,
      paid: false,
    });
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
      identities: [
        {
          id: "t",
          label: "T",
          icon: "🧪",
          painpoints: [{ id: "p", label: "P" }],
        },
      ],
    };
    const { valid, errors } = validateMatcherData(bad);
    expect(valid).toBe(false);
    expect(errors.some((e: string) => /workflow/i.test(e))).toBe(true);
  });

  test("3.4 tools 空数组 → valid: false", () => {
    const bad = {
      identities: [
        {
          id: "t",
          label: "T",
          icon: "🧪",
          painpoints: [
            {
              id: "p",
              label: "P",
              workflows: { free: { title: "X", tools: [] } },
            },
          ],
        },
      ],
    };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.5 tool 缺必要字段 → valid: false", () => {
    const bad = {
      identities: [
        {
          id: "t",
          label: "T",
          icon: "🧪",
          painpoints: [
            {
              id: "p",
              label: "P",
              workflows: {
                free: { title: "X", tools: [{ name: "只有名字" }] },
              },
            },
          ],
        },
      ],
    };
    expect(validateMatcherData(bad).valid).toBe(false);
  });

  test("3.6 identity.id 重复 → valid: false", () => {
    const bad = {
      identities: [
        {
          id: "dup",
          label: "A",
          icon: "🅰️",
          painpoints: [
            {
              id: "p1",
              label: "P1",
              workflows: {
                free: {
                  title: "T",
                  tools: [
                    { name: "A", slug: "a", step: "s", cost: "0" },
                    { name: "B", slug: "b", step: "s", cost: "0" },
                  ],
                },
              },
            },
          ],
        },
        {
          id: "dup",
          label: "B",
          icon: "🅱️",
          painpoints: [
            {
              id: "p2",
              label: "P2",
              workflows: {
                paid: {
                  title: "T",
                  tools: [
                    { name: "C", slug: "c", step: "s", cost: "$1" },
                    { name: "D", slug: "d", step: "s", cost: "$2" },
                  ],
                },
              },
            },
          ],
        },
      ],
    };
    const { valid, errors } = validateMatcherData(bad);
    expect(valid).toBe(false);
    expect(errors.some((e: string) => /重复|duplicate/i.test(e))).toBe(true);
  });

  test("3.7 workflows 中 free 和 paid 都缺 → valid: false", () => {
    const bad = {
      identities: [
        {
          id: "t",
          label: "T",
          icon: "🧪",
          painpoints: [{ id: "p", label: "P", workflows: {} }],
        },
      ],
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
  test("4.1 不同身份返回不同痛点列表，id 无交集", () => {
    const ecom = getPainpointsByIdentity(data, "ecommerce");
    const stu = getPainpointsByIdentity(data, "student");
    const cre = getPainpointsByIdentity(data, "creator");

    expect(ecom).not.toEqual(stu);
    expect(ecom).not.toEqual(cre);
    expect(stu).not.toEqual(cre);

    const ids = [ecom, stu, cre].map(
      (list) => new Set(list.map((p) => p.id))
    );
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const overlap = Array.from(ids[i]).filter((id) => ids[j].has(id));
        expect(overlap).toHaveLength(0);
      }
    }
  });

  test("4.2 每个身份至少 1 个痛点", () => {
    getIdentities(data).forEach((identity) => {
      expect(
        getPainpointsByIdentity(data, identity.id).length
      ).toBeGreaterThanOrEqual(1);
    });
  });

  test("4.3 getAvailableBudgets 与 matchWorkflow 结果一致", () => {
    getIdentities(data).forEach((identity) => {
      getPainpointsByIdentity(data, identity.id).forEach((pp) => {
        const budgets = getAvailableBudgets(data, identity.id, pp.id);
        expect(budgets.free).toBe(
          matchWorkflow(data, identity.id, pp.id, "free") !== null
        );
        expect(budgets.paid).toBe(
          matchWorkflow(data, identity.id, pp.id, "paid") !== null
        );
      });
    });
  });

  test("4.4 getPainpointsByIdentity 返回结构仅含 id + label", () => {
    getPainpointsByIdentity(data, "ecommerce").forEach((pp) => {
      expect(Object.keys(pp).sort()).toEqual(["id", "label"]);
    });
  });

  test("4.5 getIdentities 返回 ≥ 3 项，每项含 id + label + icon", () => {
    const list = getIdentities(data);
    expect(list.length).toBeGreaterThanOrEqual(3);
    list.forEach((item) => {
      expect(Object.keys(item).sort()).toEqual(["icon", "id", "label"]);
      expect(item.id).toMatch(/^[a-z0-9-]+$/);
      expect(item.label.length).toBeGreaterThan(0);
      expect(item.icon.length).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// 测试组 5：数据 × 函数交叉验证
// ============================================================
describe("组5: 数据与函数交叉完整性", () => {
  test("5.1 identities 数量 = 3", () => {
    expect(getIdentities(data).length).toBe(3);
  });

  test("5.2 每个身份恰好 3 个痛点", () => {
    getIdentities(data).forEach((identity) => {
      expect(getPainpointsByIdentity(data, identity.id).length).toBe(3);
    });
  });

  test("5.3 workflow.tools 的 step 字段 ≤ 80 字", () => {
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

  test("5.4 matchWorkflow 全遍历不抛异常", () => {
    const allIdentityIds = [...getIdentities(data).map((i) => i.id), "fake"];
    const allBudgets = ["free", "paid", "invalid"] as const;
    allIdentityIds.forEach((iid) => {
      const pps = getPainpointsByIdentity(data, iid);
      const ppIds = [...pps.map((p) => p.id), "fake"];
      ppIds.forEach((pid) => {
        allBudgets.forEach((b) => {
          expect(() =>
            matchWorkflow(data, iid, pid, b as unknown as "free")
          ).not.toThrow();
        });
      });
    });
  });

  test("5.5 validateMatcherData 通过后，所有函数链路畅通", () => {
    const { valid } = validateMatcherData(data);
    expect(valid).toBe(true);

    const identities = getIdentities(data);
    expect(identities.length).toBeGreaterThan(0);

    const firstId = identities[0];
    const pps = getPainpointsByIdentity(data, firstId.id);
    expect(pps.length).toBeGreaterThan(0);

    const budgets = getAvailableBudgets(data, firstId.id, pps[0].id);
    expect(typeof budgets.free).toBe("boolean");
    expect(typeof budgets.paid).toBe("boolean");

    const b = budgets.free ? "free" : "paid";
    const wf = matchWorkflow(
      data,
      firstId.id,
      pps[0].id,
      b as "free" | "paid"
    );
    expect(wf).not.toBeNull();
    expect(wf!.tools.length).toBeGreaterThanOrEqual(2);
  });
});
