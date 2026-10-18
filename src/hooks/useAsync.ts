import { useCallback, useEffect, useRef, useState } from 'react';

export interface AsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

interface SettledResult<T> {
  /** 这次结果对应的请求标识，用来判断是否还是当前请求 */
  key: string;
  data: T | null;
  error: Error | null;
}

/**
 * 统一的数据读取 Hook。
 * deps 变化时重新请求；组件卸载后丢弃结果，避免对已卸载组件 setState。
 *
 * loading 由「已返回结果是否属于当前请求」推导，而不是在 effect 里同步 setState：
 * 后者会触发一次额外渲染（React 19 的 set-state-in-effect 规则也会报错）。
 */
export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []): AsyncResult<T> {
  const [result, setResult] = useState<SettledResult<T> | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // deps 只放字符串/数字等可序列化的筛选参数，用它拼请求标识足够且稳定
  const requestKey = `${reloadKey}:${JSON.stringify(deps)}`;

  // 用 ref 持有最新 loader，避免调用方的内联函数每次渲染都触发新请求
  const loaderRef = useRef(loader);
  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let alive = true;

    loaderRef
      .current()
      .then((data) => {
        if (alive) setResult({ key: requestKey, data, error: null });
      })
      .catch((reason: unknown) => {
        if (alive) {
          setResult({
            key: requestKey,
            data: null,
            error: reason instanceof Error ? reason : new Error(String(reason)),
          });
        }
      });

    return () => {
      alive = false;
    };
  }, [requestKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  // 结果不属于当前请求时视为加载中，切换筛选条件时旧数据不会残留
  const settled = result && result.key === requestKey ? result : null;

  return {
    data: settled ? settled.data : null,
    loading: settled === null,
    error: settled ? settled.error : null,
    refetch,
  };
}
