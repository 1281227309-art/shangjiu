// 打包入口：把 Pretext 的两个公开入口合并为一个全局对象，供经典 <script> 使用
// （经典脚本可在 file:// 下运行，ES module 不能——这是本文件存在的唯一原因）
export * from './dist/layout.js';
export * from './dist/rich-inline.js';
