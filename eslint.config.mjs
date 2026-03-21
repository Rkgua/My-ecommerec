import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
// 1. 导入 prettier 配置
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  // Next.js 的基础规则和 TS 规则
  ...nextVitals,
  ...nextTs,

  // 自定义忽略文件
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

  // 2. 添加 prettier 配置
  // 这会关闭所有与 prettier 冲突的 ESLint 格式化规则
  prettier,
]);

export default eslintConfig;
