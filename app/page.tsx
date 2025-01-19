'use client';

import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';

type SortData = {
  data: string[];
};

export default function Home() {
  const [sort, setSort] = useQueryState('sort', { defaultValue: 'asc', clearOnDefault:false });
  const [mapData, setMapData] = useState<string[]>([]);
  const [objectData, setObjectData] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [mapResponse, objectResponse] = await Promise.all([
        fetch(`/api/with-map?sort=${sort}`).then((res) => res.json() as Promise<SortData>),
        fetch(`/api/with-object?sort=${sort}`).then((res) => res.json() as Promise<SortData>),
      ]);

      setMapData(mapResponse.data);
      setObjectData(objectResponse.data);
    };

    fetchData();
  }, [sort]);

  return (
    <main className="p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <label htmlFor="sort" className="block text-sm font-medium mb-2">
            Sort Order
          </label>
          <select
            className="w-full px-3 py-2 border rounded-md"
            id="sort"
            onChange={(e) => setSort(e.target.value as 'asc' | 'desc')}
            value={sort}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">Map Route Results <span className="block bg-red-500 w-4 h-4 rounded-full" /></h2>
            <ul className="space-y-2">
              {mapData.map((item) => (
                <li key={item} className="px-4 py-2 bg-gray-50 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">Object Route Results <span className="block bg-green-500 w-4 h-4 rounded-full" /></h2>
            <ul className="space-y-2">
              {objectData.map((item) => (
                <li key={item} className="px-4 py-2 bg-gray-50 rounded">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
