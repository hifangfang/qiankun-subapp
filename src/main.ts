import "./core/public-path";
debugger
import { lifeCycle, render } from "./core/life-cycle";

/**
 * @name 统一注册插件
 */
import './core/install';

/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ :any= (window as any).__POWERED_BY_QIANKUN__;
__qiankun__ || render();
