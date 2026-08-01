import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// O next-pwa injeta uma config de `webpack` mesmo com `disable: true`,
// o que conflita com o Turbopack (padrão do Next 16 em dev). Por isso,
// só envolvemos a config com o PWA em produção.
const finalConfig =
  process.env.NODE_ENV === 'production'
    ? require('next-pwa')({ dest: 'public', register: true, skipWaiting: true })(nextConfig)
    : nextConfig;

export default finalConfig;

