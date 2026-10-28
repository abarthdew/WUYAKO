import { validateTheme } from '../../src/features/theme/validateTheme.js';

// kind별 본문 검사. 등록되지 않은 kind는 객체인지만 본다.
const VALIDATORS = {
  theme: validateTheme,
};

export const validateBody = (kind, body) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return ['본문은 객체여야 합니다'];
  return VALIDATORS[kind]?.(body) ?? [];
};

export const KINDS = ['theme', 'mission', 'layout', 'lesson'];
export const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
