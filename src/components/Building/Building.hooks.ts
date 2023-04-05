export const useWorker = () => {
  // @ts-ignore
  const instance = new ComlinkWorker<typeof import("./BuildingWorker")>(
    new URL("./BuildingWorker", import.meta.url)
  );

  return { worker: instance };
};
