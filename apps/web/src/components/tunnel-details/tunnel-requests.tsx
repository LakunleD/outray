import { Search, Filter, Download, MoreVertical } from "lucide-react";

function formatBytes(bytes: number): string {
  if (bytes >= 1_073_741_824) {
    return `${(bytes / 1_073_741_824).toFixed(1)} GB`;
  } else if (bytes >= 1_048_576) {
    return `${(bytes / 1_048_576).toFixed(1)} MB`;
  } else if (bytes >= 1_024) {
    return `${(bytes / 1_024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

interface TunnelRequestsProps {
  requests: any[];
}

export function TunnelRequests({ requests }: TunnelRequestsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-colors text-sm">
          <Filter size={16} />
          Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-colors text-sm">
          <Download size={16} />
          Export
        </button>
      </div>

      <div className="bg-white/2 border border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-150">
        <div className="overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-gray-400 font-medium sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 bg-white/5">Status</th>
                <th className="px-6 py-3 bg-white/5">Method</th>
                <th className="px-6 py-3 bg-white/5">Path</th>
                <th className="px-6 py-3 bg-white/5">Time</th>
                <th className="px-6 py-3 bg-white/5">Duration</th>
                <th className="px-6 py-3 bg-white/5">Size</th>
                <th className="px-6 py-3 bg-white/5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No requests found
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          req.status >= 500
                            ? "bg-red-500/10 text-red-500"
                            : req.status >= 400
                              ? "bg-orange-500/10 text-orange-500"
                              : req.status >= 300
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-green-500/10 text-green-500"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">
                      {req.method}
                    </td>
                    <td
                      className="px-6 py-4 text-gray-300 truncate max-w-50"
                      title={req.path}
                    >
                      {req.path}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(req.time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {req.duration}ms
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatBytes(req.size)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
