/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { parseEntityRef } from '@backstage/catalog-model';

export const useCatalogEntities = (refs: string[]) => {
  const catalogApi = useApi(catalogApiRef);
  const [entities, setEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!refs.length) return;

    const fetchEntities = async () => {
      setLoading(true);
      try {
        const filter = refs.map(refString => {
          const { kind, namespace, name } = parseEntityRef(refString);
          return {
            kind,
            'metadata.namespace': namespace,
            'metadata.name': name,
          };
        });

        const response = await catalogApi.getEntities({ filter });
        setEntities(response.items);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [refs, catalogApi]);

  return { entities, loading, error };
};
