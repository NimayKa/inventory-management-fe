import { useEffect, useState } from 'react';
import api from '../../api/axios';
import SEO from '../../components/seo/SEO';
import { BarChart } from '@mantine/charts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function Dashboard() {
  const [stats, setStats] = useState({
    categories: [],
    staffCount: 0,
    logCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard-stats')
      .then((res) => {
        const chartData = (res.data.categories || []).map((item) => ({
          category: item.category || 'Uncategorized',
          'Items Count': item.total,
        }));

        setStats({
          categories: chartData,
          staffCount: res.data.staff_count || 0,
          logCount: res.data.log_count || 0,
        });
      })
      .catch((err) => console.error('Error compiling metric stats stream:', err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 w-full">
      <SEO 
        title="Inventory Management By AkYamin"
        desc="Assessment Test Project"
        url={"localhost"}
        image={``} 
      />

      <div className="mb-6">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm mt-0.5 text-gray-500">Live summary of system activity and repository tracking</p>
      </div>

      {isLoading ? (
        <div className="text-gray-400 animate-pulse text-sm">Compiling analytical metrics...</div>
      ) : (
        <div className="flex flex-col gap-6">
          
          {/* Top Row Grid: Two square boxes showing metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Staff Count */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Staff Members</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.staffCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FontAwesomeIcon icon="users" className="w-5 h-5" />
              </div>
            </div>

            {/* Box 2: Total Logs Altered */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">System Log Entries</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.logCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FontAwesomeIcon icon="clock-rotate-left" className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* Bottom Row Wrapper Layout: Mantine Bar Chart */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">Stock Densities Per Category</h2>
              <p className="text-xs text-gray-400 mt-0.5">Frequency comparison metrics of item registration splits</p>
            </div>

            {stats.categories.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400">No category inventory items mapped yet.</div>
            ) : (
              <div className="pt-2">
                <BarChart
                  h={300}
                  data={stats.categories}
                  dataKey="category"
                  series={[{ name: 'Items Count', color: 'cyan.6' }]}
                  tickLine="y"
                  gridAxis="xy"
                  withTooltip
                />
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}