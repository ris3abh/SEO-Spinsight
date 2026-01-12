'use client';

import { ForecastResult } from '@/lib/forecasting';

interface ForecastResultsProps {
  forecasts: ForecastResult[];
  includeRevenue: boolean;
}

export default function ForecastResults({
  forecasts,
  includeRevenue,
}: ForecastResultsProps) {
  const totalExpectedSessions = forecasts.reduce(
    (sum, f) => sum + f.expectedSessions,
    0
  );
  const totalExpectedConversions = forecasts.reduce(
    (sum, f) => sum + f.expectedConversions,
    0
  );
  const totalExpectedRevenue = includeRevenue
    ? forecasts.reduce((sum, f) => sum + (f.expectedRevenue || 0), 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Total Sessions (Expected)
          </h3>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {totalExpectedSessions.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Total Conversions (Expected)
          </h3>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {totalExpectedConversions.toLocaleString()}
          </p>
        </div>
        {includeRevenue && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Total Revenue (Expected)
            </h3>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
              ${totalExpectedRevenue.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Conservative Sessions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Expected Sessions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Optimistic Sessions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Conservative Conversions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Expected Conversions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                  Optimistic Conversions
                </th>
                {includeRevenue && (
                  <>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Conservative Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Expected Revenue
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                      Optimistic Revenue
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
              {forecasts.map((forecast) => (
                <tr key={forecast.month}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {forecast.month}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                    {forecast.conservativeSessions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {forecast.expectedSessions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                    {forecast.optimisticSessions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                    {forecast.conservativeConversions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-zinc-900 dark:text-zinc-100">
                    {forecast.expectedConversions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                    {forecast.optimisticConversions.toLocaleString()}
                  </td>
                  {includeRevenue && (
                    <>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                        ${(forecast.conservativeRevenue || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-zinc-900 dark:text-zinc-100">
                        ${(forecast.expectedRevenue || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-zinc-700 dark:text-zinc-300">
                        ${(forecast.optimisticRevenue || 0).toLocaleString()}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
