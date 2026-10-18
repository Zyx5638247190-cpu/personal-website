/** 页面通用异步状态机，供数据区块统一处理加载/错误/空 */
export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

/** 导航项：path 为路由地址，label 为展示文案 */
export interface NavItem {
  path: string;
  label: string;
}
