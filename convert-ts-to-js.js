#!/usr/bin/env node

/**
 * TypeScript到JavaScript的批量转换脚本
 * 这个脚本会遍历src目录下的所有.ts文件，并将它们转换为.js文件，移除类型注解和接口定义
 */

import { readFileSync, writeFileSync, readdirSync, statSync, unlinkSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// 解决ES模块中__dirname的问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 需要忽略的文件或目录
const IGNORE_LIST = [
  'src/vite-env.d.ts',
  'src/stores/index.ts', // 假设有index.ts文件
  'src/api/index.ts',    // 稍后单独处理
  'node_modules',
  '.git',
  'dist',
  'build',
  'src-tauri'
];

// 需要保留的TypeScript类型关键字后的内容的关键字
const PRESERVE_AFTER_KEYWORDS = ['as', 'in', 'of'];

/**
 * 检查路径是否应该被忽略
 */
function shouldIgnore(filePath) {
  return IGNORE_LIST.some(ignore => filePath.includes(ignore));
}

/**
 * 将TypeScript文件转换为JavaScript文件
 */
function convertTsToJs(filePath) {
  try {
    const tsContent = readFileSync(filePath, 'utf8');
    let jsContent = tsContent;

    // 移除类型注解，但保留某些关键字后的值
    jsContent = jsContent.replace(/(:\s*[\w<>,|\[\]\s\(\)]+)(?![^;]*\/\/)/g, (match, group) => {
      // 检查是否有需要保留的关键字
      for (const keyword of PRESERVE_AFTER_KEYWORDS) {
        const regex = new RegExp(`:\s*(.+?\s+${keyword}\s+.+)`, 'g');
        const matches = regex.exec(match);
        if (matches && matches[1]) {
          return `: ${matches[1]}`;
        }
      }
      return '';
    });

    // 移除接口定义
    jsContent = jsContent.replace(/interface\s+\w+\s*{[^}]*}\n?/g, '');

    // 移除类型导入
    jsContent = jsContent.replace(/import\s+type\s+[{\w\s,}]+\s+from\s+[\'\"]/g, 'import ');
    jsContent = jsContent.replace(/import\s+[{\w\s,}]+\s+from\s+[\'\"]\s*;\s*\/\/\s*\w+\s*types?/g, '');

    // 移除泛型类型参数（简单情况）
    jsContent = jsContent.replace(/<[\w,\s\[\]]+>/g, '');

    // 移除类型断言（as关键字后面的类型）
    jsContent = jsContent.replace(/\s+as\s+\w+/g, '');

    // 替换.ts扩展名的导入路径
    jsContent = jsContent.replace(/from\s+['"]([^'"]+)\.ts['"]/g, (match, group) => {
      return `from '${group}.js'`;
    });

    // 创建新的.js文件路径
    const jsFilePath = filePath.replace(/\.ts$/, '.js');

    // 写入.js文件
    writeFileSync(jsFilePath, jsContent, 'utf8');
    console.log(`✓ 转换成功: ${filePath} -> ${jsFilePath}`);

  } catch (error) {
    console.error(`✗ 转换失败: ${filePath}`, error);
  }
}

/**
 * 遍历目录并转换TypeScript文件
 */
function traverseDirectory(dirPath) {
  const files = readdirSync(dirPath);

  for (const file of files) {
    const fullPath = join(dirPath, file);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (!shouldIgnore(fullPath)) {
        traverseDirectory(fullPath);
      }
    } else if (stat.isFile() && file.endsWith('.ts') && !shouldIgnore(fullPath)) {
      convertTsToJs(fullPath);
    }
  }
}

/**
 * 移除不需要的TypeScript配置文件
 */
function cleanupTsFiles() {
  const tsFilesToRemove = [
    'tsconfig.json',
    'tsconfig.node.json'
  ];

  tsFilesToRemove.forEach(filePath => {
    try {
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        console.log(`✓ 已移除: ${filePath}`);
      }
    } catch (error) {
      console.error(`✗ 移除失败: ${filePath}`, error);
    }
  });
}

// 执行转换
console.log('开始将TypeScript文件转换为JavaScript文件...');
traverseDirectory(join(__dirname, 'src'));
cleanupTsFiles();
console.log('转换完成！');