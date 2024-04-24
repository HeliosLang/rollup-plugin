import { compileAndInject } from "@helios-lang/esbuild-plugin"

/**
 * @typedef {import("rollup").Plugin} Plugin
 */

/**
 * TODO: find a way to extract define and tsConfig from the build context (or alternatively: create a specialized vite-plugin that does that)
 * @typedef {{
 *   define: Record<string, string>
 *   tsConfig: string
 *   contextEntryPoint: string
 * }} HeliosRollupPluginOptions
 */

/**
 * @param {HeliosRollupPluginOptions} options
 * @returns {Plugin}
 */
export default function makePlugin(options) {
    const cache = {}

    return {
        name: "rollup-plugin-helios",
        transform: async (content, path) => {
            if (path != options.contextEntryPoint) {
                return null
            }

            const newContent = await compileAndInject({
                path: options.contextEntryPoint,
                env: options.define,
                tsConfig: options.tsConfig,
                cache,
                content: content
            })

            return {
                code: newContent,
                map: null // TODO: alter sourcemap as well
            }
        }
    }
}
