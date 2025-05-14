import { init } from '@emailjs/browser';

// 已更新为提供的EmailJS Public Key
const EMAIL_PUBLIC_KEY = 'suKHT-g0o2Dgos4zd';

export const initEmailJS = () => {
  try {
    console.log('正在初始化EmailJS...');
    // 添加更多配置选项
    init({
      publicKey: EMAIL_PUBLIC_KEY,
      blockHeadless: false,  // 允许在无头浏览器中使用
      limitRate: {
        // 限制发送频率
        throttle: 4000,  // 至少4秒间隔
      },
    });
    console.log('EmailJS初始化成功!');
  } catch (error) {
    console.error('EmailJS初始化失败:', error);
  }
}; 