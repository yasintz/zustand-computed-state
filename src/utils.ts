export function getAllGetters(obj: any) {
  const getters: any = {};

  // Iterate over all properties of the object itself (not its prototype chain)
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);

    // Check if the property has a getter
    if (descriptor && typeof descriptor.get === 'function') {
      getters[prop] = descriptor.get;
    }
  });

  // Iterate over all properties of the object's prototype chain
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    Object.getOwnPropertyNames(proto).forEach(prop => {
      const descriptor = Object.getOwnPropertyDescriptor(proto, prop);

      // Check if the property has a getter
      if (
        descriptor &&
        typeof descriptor.get === 'function' &&
        !getters.hasOwnProperty(prop)
      ) {
        getters[prop] = descriptor.get;
      }
    });

    proto = Object.getPrototypeOf(proto);
  }

  return getters;
}

const copyDescriptors = (target: any, source: any) => {
  Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
};

export function combineSlices<StoreType>(...obj: any[]): StoreType {
  const target = {};

  obj.forEach(source => {
    copyDescriptors(target, source);
  });
  return target as any;
}
