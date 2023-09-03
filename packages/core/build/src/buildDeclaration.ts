import gulp from 'gulp';
import path from 'path';
import fs from 'fs';
import gulpTs from 'gulp-typescript';
import { ROOT_PATH } from './constant';

export const buildDeclaration = (cwd: string, targetDir: string) => {
  return new Promise((resolve, reject) => {
    const srcPath = path.join(cwd, 'src');
    const targetPath = path.join(cwd, targetDir);

    const tsConfig = gulpTs.createProject(path.join(ROOT_PATH, 'tsconfig.json'));
    delete tsConfig.config.compilerOptions.paths;
    const patterns = [
      path.join(srcPath, '**/*.{ts,tsx}'),
      `!${path.join(srcPath, '**/fixtures{,/**}')}`,
      `!${path.join(srcPath, '**/demos{,/**}')}`,
      `!${path.join(srcPath, '**/__test__{,/**}')}`,
      `!${path.join(srcPath, '**/__tests__{,/**}')}`,
      `!${path.join(srcPath, '**/*.mdx')}`,
      `!${path.join(srcPath, '**/*.md')}`,
      `!${path.join(srcPath, '**/*.+(test|e2e|spec).+(js|jsx|ts|tsx)')}`,
      `!${path.join(srcPath, '**/tsconfig{,.*}.json')}`,
      `!${path.join(srcPath, '.umi{,-production,-test}{,/**}')}`,
    ];
    gulp
      .src(patterns, { base: srcPath, allowEmpty: true })
      .pipe(gulpTs(tsConfig.config.compilerOptions))
      .dts.pipe(gulp.dest(targetPath))
      .on('end', resolve)
      .on('error', reject);
  });
};
