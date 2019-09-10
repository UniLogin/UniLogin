import {useDebugValue, useMemo} from 'react';
import {useSubscription} from 'use-subscription';
import {Property} from 'reactive-properties';

export function useProperty<T>(property: Property<T>): T {
  const value = useSubscription(useMemo(() => ({
    getCurrentValue: property.get.bind(property),
    subscribe: property.subscribe.bind(property),
  }), [property]));

  useDebugValue(value);

  return value;
}
