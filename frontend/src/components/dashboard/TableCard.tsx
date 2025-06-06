import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Download, ChevronUp, ChevronDown, 
  Eye, Edit, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableCardProps {
  title: string;
  subtitle?: string;
  columns: Column[];
  data: any[];
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: any) => void;
    color?: string;
    disabled?: (row: any) => boolean;
  }[];
  onRowClick?: (row: any) => void;
  className?: string;
  selectable?: boolean;
}

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
      </div>
    ))}
  </div>
);

const TableCard: React.FC<TableCardProps> = ({
  title,
  subtitle,
  columns,
  data,
  size = 'medium',
  loading = false,
  searchable = true,
  filterable = false,
  exportable = false,
  pagination = true,
  pageSize = 10,
  actions = [],
  onRowClick,
  className = '',
  selectable = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  const sizeClasses = {
    small: 'col-span-1 row-span-1 min-h-[300px]',
    medium: 'col-span-1 row-span-2 min-h-[400px] md:col-span-2',
    large: 'col-span-1 row-span-2 min-h-[500px] md:col-span-3 lg:col-span-4'
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: {
      scale: 1.005,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const rowVariants = {
    initial: { opacity: 0, x: -20 },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.3,
        ease: "easeOut"
      }
    }),
    hover: {
      backgroundColor: 'rgba(59, 130, 246, 0.05)',
      transition: { duration: 0.2 }
    }
  };

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = data;
    
    if (searchTerm) {
      filtered = filtered.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  // Handle sorting
  const handleSort = (key: string) => {
  setSortConfig(current => {
    if (current?.key === key) {
      return current.direction === 'asc' 
        ? { key, direction: 'desc' as const }
        : null;
    }
    return { key, direction: 'asc' as const };
  });
};

  // Handle row selection
  const handleRowSelect = (rowId: string) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index.toString())));
    }
  };

  // Handle export
  const handleExport = () => {
  const csvContent = [
    columns.map(col => col.label).join(','),
    ...sortedData.map(row => 
      columns.map(col => row[col.key] || '').join(',')
    )
  ].join('\n'); // Changed from \\n to \n
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.csv`; // Changed from \\s+ to \s+
  a.click();
  window.URL.revokeObjectURL(url);
};

  if (loading) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden`}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            
            {exportable && (
              <button
                onClick={handleExport}
                className="p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Download className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto h-full">
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                <tr>
                  {selectable && (
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                  )}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : ''}`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp className={`h-3 w-3 ${sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'text-blue-500' : 'text-gray-400'}`} />
                            <ChevronDown className={`h-3 w-3 -mt-1 ${sortConfig?.key === column.key && sortConfig.direction === 'desc' ? 'text-blue-500' : 'text-gray-400'}`} />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  {actions.length > 0 && (
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                <AnimatePresence>
                  {paginatedData.map((row, index) => (
                    <motion.tr
                      key={index}
                      custom={index}
                      variants={rowVariants}
                      initial="initial"
                      animate="animate"
                      whileHover="hover"
                      className={`${onRowClick ? 'cursor-pointer' : ''} ${selectedRows.has(index.toString()) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedRows.has(index.toString())}
                            onChange={() => handleRowSelect(index.toString())}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                      {actions.length > 0 && (
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {actions.map((action, actionIndex) => (
                              <button
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                disabled={action.disabled?.(row)}
                                className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${action.color || 'text-gray-600 dark:text-gray-400'}`}
                                title={action.label}
                              >
                                {action.icon}
                              </button>
                            ))}
                          </div>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Example usage component for demonstration
const TableCardExample = () => {
  const sampleData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Faculty', status: 'Active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Inactive', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Wilson', email: 'alice@example.com', role: 'Faculty', status: 'Active', lastLogin: '2024-01-15' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Student', status: 'Active', lastLogin: '2024-01-13' },
  ];

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'Admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
          value === 'Faculty' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <span className={`flex items-center ${
          value === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            value === 'Active' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          {value}
        </span>
      )
    },
    { key: 'lastLogin', label: 'Last Login', sortable: true },
  ];

  const actions = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row: any) => console.log('View', row),
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row: any) => console.log('Edit', row),
      color: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row: any) => console.log('Delete', row),
      color: 'text-red-600 dark:text-red-400',
      disabled: (row: any) => row.role === 'Admin'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TableCard
          title="User Management"
          subtitle="Manage system users and their roles"
          columns={columns}
          data={sampleData}
          size="large"
          searchable={true}
          filterable={true}
          exportable={true}
          pagination={true}
          pageSize={3}
          actions={actions}
          selectable={true}
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </div>
    </div>
  );
};

export default TableCard;
export { TableCardExample };