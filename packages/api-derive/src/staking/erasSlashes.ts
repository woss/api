// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { Option, StorageKey } from '@polkadot/types';
import type { BalanceOf, EraIndex, Perbill } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { Observable } from '@polkadot/x-rxjs';
import type { DeriveEraSlashes, DeriveEraValSlash } from '../types';

import { combineLatest, of } from '@polkadot/x-rxjs';
import { map, switchMap } from '@polkadot/x-rxjs/operators';

import { deriveCache, memo } from '../util';

const CACHE_KEY = 'eraSlashes';

function mapSlashes (era: EraIndex, noms: [StorageKey, Option<BalanceOf>][], vals: [StorageKey, Option<ITuple<[Perbill, BalanceOf]>>][]): DeriveEraSlashes {
  const nominators: DeriveEraValSlash = {};
  const validators: DeriveEraValSlash = {};

  noms.forEach(([key, optBalance]): void => {
    nominators[key.args[1].toString()] = optBalance.unwrap();
  });

  vals.forEach(([key, optRes]): void => {
    validators[key.args[1].toString()] = optRes.unwrapOrDefault()[1];
  });

  return { era, nominators, validators };
}

export function _eraSlashes (instanceId: string, api: ApiInterfaceRx): (era: EraIndex, withActive: boolean) => Observable<DeriveEraSlashes> {
  return memo(instanceId, (era: EraIndex, withActive: boolean): Observable<DeriveEraSlashes> => {
    const cacheKey = `${CACHE_KEY}-${era.toString()}`;
    const cached = withActive
      ? undefined
      : deriveCache.get<DeriveEraSlashes>(cacheKey);

    return cached
      ? of(cached)
      : combineLatest([
        api.query.staking.nominatorSlashInEra.entries(era),
        api.query.staking.validatorSlashInEra.entries(era)
      ]).pipe(
        map(([noms, vals]): DeriveEraSlashes => {
          const value = mapSlashes(era, noms, vals);

          !withActive && deriveCache.set(cacheKey, value);

          return value;
        })
      );
  });
}

export function eraSlashes (instanceId: string, api: ApiInterfaceRx): (era: EraIndex) => Observable<DeriveEraSlashes> {
  return memo(instanceId, (era: EraIndex): Observable<DeriveEraSlashes> =>
    api.derive.staking._eraSlashes(era, true)
  );
}

export function _erasSlashes (instanceId: string, api: ApiInterfaceRx): (eras: EraIndex[], withActive: boolean) => Observable<DeriveEraSlashes[]> {
  return memo(instanceId, (eras: EraIndex[], withActive: boolean): Observable<DeriveEraSlashes[]> =>
    eras.length
      ? combineLatest(
        eras.map((era) => api.derive.staking._eraSlashes(era, withActive))
      )
      : of([])
  );
}

export function erasSlashes (instanceId: string, api: ApiInterfaceRx): (withActive?: boolean) => Observable<DeriveEraSlashes[]> {
  return memo(instanceId, (withActive = false): Observable<DeriveEraSlashes[]> =>
    api.derive.staking.erasHistoric(withActive).pipe(
      switchMap((eras) => api.derive.staking._erasSlashes(eras, withActive))
    )
  );
}
