// Scenario Matcher 纯函数模块
// 此文件无 fs 依赖，客户端组件可直接 import

import type { MatcherData, MatcherWorkflow, MatcherBudget } from "./types";

const ID_PATTERN = /^[a-z0-9-]+$/;

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.length > 0;
}

function validateTool(
  tool: unknown,
  path: string,
  errors: string[]
): boolean {
  if (!isObject(tool)) {
    errors.push(`${path}: 必须是对象`);
    return false;
  }
  let ok = true;
  if (!isNonEmptyString(tool.name)) {
    errors.push(`${path}.name: 必须是非空字符串`);
    ok = false;
  }
  if (!isNonEmptyString(tool.slug)) {
    errors.push(`${path}.slug: 必须是非空字符串`);
    ok = false;
  }
  if (!isNonEmptyString(tool.step)) {
    errors.push(`${path}.step: 必须是非空字符串`);
    ok = false;
  }
  if (!isNonEmptyString(tool.cost)) {
    errors.push(`${path}.cost: 必须是非空字符串`);
    ok = false;
  }
  return ok;
}

function validateWorkflow(
  workflow: unknown,
  path: string,
  errors: string[]
): boolean {
  if (!isObject(workflow)) {
    errors.push(`${path}: 必须是对象`);
    return false;
  }
  let ok = true;
  if (!isNonEmptyString(workflow.title)) {
    errors.push(`${path}.title: 必须是非空字符串`);
    ok = false;
  }
  if (!Array.isArray(workflow.tools)) {
    errors.push(`${path}.tools: 必须是数组`);
    return false;
  }
  if (workflow.tools.length < 2 || workflow.tools.length > 4) {
    errors.push(
      `${path}.tools: 长度必须为 2-4，当前为 ${workflow.tools.length}`
    );
    ok = false;
  }
  workflow.tools.forEach((tool, idx) => {
    if (!validateTool(tool, `${path}.tools[${idx}]`, errors)) {
      ok = false;
    }
  });
  return ok;
}

/**
 * 校验 matcher 数据结构完整性（规则 D1-D8）
 */
export function validateMatcherData(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!isObject(data)) {
    errors.push("data: 必须是对象");
    return { valid: false, errors };
  }

  if (!Array.isArray(data.identities)) {
    errors.push("identities: 必须是数组");
    return { valid: false, errors };
  }

  if (data.identities.length === 0) {
    errors.push("identities: 不能为空数组");
    return { valid: false, errors };
  }

  const seenIdentityIds = new Set<string>();

  data.identities.forEach((identity, i) => {
    const idPath = `identities[${i}]`;

    if (!isObject(identity)) {
      errors.push(`${idPath}: 必须是对象`);
      return;
    }

    if (!isNonEmptyString(identity.id)) {
      errors.push(`${idPath}.id: 必须是非空字符串`);
    } else if (!ID_PATTERN.test(identity.id)) {
      errors.push(`${idPath}.id: 仅允许小写字母、数字和连字符`);
    } else if (seenIdentityIds.has(identity.id)) {
      errors.push(`${idPath}.id: 重复的 identity id "${identity.id}"`);
    } else {
      seenIdentityIds.add(identity.id);
    }

    if (!isNonEmptyString(identity.label)) {
      errors.push(`${idPath}.label: 必须是非空字符串`);
    }

    if (!isNonEmptyString(identity.icon)) {
      errors.push(`${idPath}.icon: 必须是非空字符串`);
    }

    if (!Array.isArray(identity.painpoints)) {
      errors.push(`${idPath}.painpoints: 必须是数组`);
      return;
    }

    if (identity.painpoints.length === 0) {
      errors.push(`${idPath}.painpoints: 不能为空数组`);
    }

    const seenPainpointIds = new Set<string>();

    identity.painpoints.forEach((painpoint: unknown, j: number) => {
      const ppPath = `${idPath}.painpoints[${j}]`;

      if (!isObject(painpoint)) {
        errors.push(`${ppPath}: 必须是对象`);
        return;
      }

      if (!isNonEmptyString(painpoint.id)) {
        errors.push(`${ppPath}.id: 必须是非空字符串`);
      } else if (!ID_PATTERN.test(painpoint.id)) {
        errors.push(`${ppPath}.id: 仅允许小写字母、数字和连字符`);
      } else if (seenPainpointIds.has(painpoint.id)) {
        errors.push(
          `${ppPath}.id: 在该 identity 内重复的 painpoint id "${painpoint.id}"`
        );
      } else {
        seenPainpointIds.add(painpoint.id);
      }

      if (!isNonEmptyString(painpoint.label)) {
        errors.push(`${ppPath}.label: 必须是非空字符串`);
      }

      if (!isObject(painpoint.workflows)) {
        errors.push(`${ppPath}.workflows: 必须是对象`);
        return;
      }

      const hasFree = painpoint.workflows.free !== undefined;
      const hasPaid = painpoint.workflows.paid !== undefined;
      const hasCnFree = painpoint.workflows["cn-free"] !== undefined;

      if (!hasFree && !hasPaid && !hasCnFree) {
        errors.push(
          `${ppPath}.workflows: 必须至少包含 free、paid 或 cn-free workflow`
        );
        return;
      }

      if (hasFree) {
        validateWorkflow(
          painpoint.workflows.free,
          `${ppPath}.workflows.free`,
          errors
        );
      }
      if (hasPaid) {
        validateWorkflow(
          painpoint.workflows.paid,
          `${ppPath}.workflows.paid`,
          errors
        );
      }
      if (hasCnFree) {
        validateWorkflow(
          painpoint.workflows["cn-free"],
          `${ppPath}.workflows.cn-free`,
          errors
        );
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

/**
 * 提取身份列表（填充第一个下拉）
 */
export function getIdentities(
  data: MatcherData
): { id: string; label: string; icon: string }[] {
  if (!data || !Array.isArray(data.identities)) return [];
  return data.identities.map((identity) => ({
    id: identity.id,
    label: identity.label,
    icon: identity.icon,
  }));
}

/**
 * 根据 identityId 获取该身份下的痛点列表
 */
export function getPainpointsByIdentity(
  data: MatcherData,
  identityId: string
): { id: string; label: string }[] {
  if (!data || !Array.isArray(data.identities)) return [];
  const identity = data.identities.find((i) => i.id === identityId);
  if (!identity || !Array.isArray(identity.painpoints)) return [];
  return identity.painpoints.map((pp) => ({ id: pp.id, label: pp.label }));
}

/**
 * 三级精确匹配：identity → painpoint → budget
 */
export function matchWorkflow(
  data: MatcherData,
  identityId: string,
  painpointId: string,
  budget: MatcherBudget
): MatcherWorkflow | null {
  if (budget !== "free" && budget !== "paid" && budget !== "cn-free") return null;
  if (!data || !Array.isArray(data.identities)) return null;
  const identity = data.identities.find((i) => i.id === identityId);
  if (!identity) return null;
  const painpoint = identity.painpoints.find((p) => p.id === painpointId);
  if (!painpoint) return null;
  const workflow = painpoint.workflows[budget];
  return workflow ?? null;
}

/**
 * 检查某 identity + painpoint 下哪些预算有方案
 */
export function getAvailableBudgets(
  data: MatcherData,
  identityId: string,
  painpointId: string
): { free: boolean; paid: boolean } {
  return {
    free: matchWorkflow(data, identityId, painpointId, "free") !== null,
    paid: matchWorkflow(data, identityId, painpointId, "paid") !== null,
  };
}
