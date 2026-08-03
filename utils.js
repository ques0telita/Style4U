import tailwindcss from 'tailwindcss';
import postcss from 'postcss';

import animationPlugin from './src/index.js'

const TAILWIND_BASE = '@tailwind utilities'

export function generatePluginCSS (options) {
    return postcss([
        tailwindcss({
            plugins: [animationsPlugin]
        })
    ])
    .process(`${TAILWIND_BASE}.content { @apply pl-0 }`)
    .then(result => result.css)
}

console.log(await generatePluginCSS())