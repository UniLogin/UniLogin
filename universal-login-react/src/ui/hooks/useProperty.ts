import {useMemo} from 'react';
import {useSubscription} from 'use-subscription';
import {Property} from 'reactive-properties';

export function useProperty<T>(property: Property<T>): T {
  return useSubscription(useMemo(() => ({
    getCurrentValue: property.get.bind(property),
    subscribe: property.subscribe.bind(property),
  }), [property]));
}
