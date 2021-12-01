import { readdir } from 'fs/promises'
import { join } from 'path'
import type { FastifyInstance, FastifyPluginAsync, FastifyPluginOptions } from 'fastify'

async function loadPlugins (directoryPath: string, app: FastifyInstance, options: FastifyPluginOptions): Promise<void> {
  const filesList = await readdir(directoryPath)
  const importsPromises = filesList
    .map((filename) => join(directoryPath, filename))
    .map(async (filePath) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const fileExport: { default: FastifyPluginAsync } = await import(filePath)
      const plugin = fileExport.default
      return plugin(app, options)
    })
  await Promise.all(importsPromises)
}

type AutoloadPluginOptions = FastifyPluginOptions & {
  dir: string;
}

export function autoload (app: FastifyInstance, options: AutoloadPluginOptions): Promise<void> {
  return loadPlugins(options.dir, app, options)
}
