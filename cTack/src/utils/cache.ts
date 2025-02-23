// Helper to clear require cache for a specific file
export function clearRequireCache(modulePath: string) {
  try {
    delete require.cache[require.resolve(modulePath)];
  } catch (e) {
    console.warn(`Failed to clear cache for ${modulePath}:`, e);
  }
}

export function clearAllAppCache(path: string) {
  // Get all cached modules
  const cachedModules = Object.keys(require.cache);
  console.log(`🦊 \x1b[1;30mCache size ${cachedModules.length}\x1b[0m\n`);

  // Clear cache for modules in APP_DIR
  cachedModules.forEach((modulePath) => {
    if (modulePath.includes(path)) {
      console.log(`🦊 \x1b[1;30mClearing cache for ${modulePath}\x1b[0m`);
      clearRequireCache(modulePath);
    }
  });
}
