import { useEffect, useRef } from "react";
import isEqual from "lodash.isequal";

const useDeepCompareEffect = (callback, dependencies) => {
  const currentDependenciesRef = useRef();

  if (!isEqual(currentDependenciesRef.current, dependencies)) {
    console.log(currentDependenciesRef.current);
    currentDependenciesRef.current = dependencies;
  }

  useEffect(callback, [currentDependenciesRef.current]);
};

export default useDeepCompareEffect;
