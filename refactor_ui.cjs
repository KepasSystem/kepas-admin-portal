const fs = require('fs');

function updateTenants() {
  let content = fs.readFileSync('src/pages/Tenants.tsx', 'utf8');
  
  if(!content.includes('const [search, setSearch]')) {
    content = content.replace('const [isModalOpen, setIsModalOpen] = useState(false);', "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [search, setSearch] = useState('');\n  const [page, setPage] = useState(1);");
  }

  content = content.replace(
    /const \{ data: tenants = \[\], isLoading, error \} = useQuery\(\{\s*queryKey: \['tenants'\],\s*queryFn: async \(\) => \{\s*const response = await tenantService\.getAllTenants\(\);\s*if \(!response\.success\) throw new Error\(response\.message\);\s*return response\.data \|\| \[\];\s*\}\s*\}\);/g,
    const { data, isLoading, error } = useQuery({\n    queryKey: ['tenants', search, page],\n    queryFn: async () => {\n      const response = await tenantService.getAllTenants(search, page, 10);\n      if (!response.success) throw new Error(response.message);\n      return response.data || { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 };\n    }\n  });\n  const tenants = data?.items || [];
  );

  content = content.replace(/<input type="text" placeholder="Buscar cliente..." disabled className=".*?" \/>/, '<input type="text" placeholder="Buscar cliente..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64" value={search} onChange={(e) => setSearch(e.target.value)} />');

  // Uncomment pagination
  content = content.replace(/\{\/\* <div className="flex justify-between items-center mt-4">/g, '<div className="flex justify-between items-center mt-4">');
  content = content.replace(/<\/div> \*\/\}/g, '</div>');

  content = content.replace(/<span className="text-sm text-gray-700">.*?Página <span className="font-medium">1<\/span> de <span className="font-medium">10<\/span>.*?<\/span>/s, '<span className="text-sm text-gray-700">Mostrando {tenants.length} de {data?.totalCount || 0} inquilinos</span>');

  content = content.replace(/<button className="px-3 py-1 border border-gray-300.*?<\/button>/g, '');
  content = content.replace(/<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">.*?<\/nav>/s, <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination"><button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Anterior</button><span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">Página {page}</span><button onClick={() => setPage(p => p + 1)} disabled={!data || data.pageNumber * data.pageSize >= data.totalCount} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Próxima</button></nav>);

  fs.writeFileSync('src/pages/Tenants.tsx', content, 'utf8');
}

function updateAccounts() {
  let content = fs.readFileSync('src/pages/ServiceAccounts.tsx', 'utf8');
  
  if(!content.includes('const [search, setSearch]')) {
    content = content.replace('const [isModalOpen, setIsModalOpen] = useState(false);', "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [search, setSearch] = useState('');\n  const [page, setPage] = useState(1);");
  }

  content = content.replace(
    /const \{ data: accounts = \[\], isLoading, error \} = useQuery\(\{\s*queryKey: \['service-accounts'\],\s*queryFn: async \(\) => \{\s*const response = await serviceAccountService\.getAllAccounts\(\);\s*if \(!response\.success\) throw new Error\(response\.message\);\s*return response\.data \|\| \[\];\s*\}\s*\}\);/g,
    const { data, isLoading, error } = useQuery({\n    queryKey: ['service-accounts', search, page],\n    queryFn: async () => {\n      const response = await serviceAccountService.getAllAccounts(search, page, 10);\n      if (!response.success) throw new Error(response.message);\n      return response.data || { items: [], totalCount: 0, pageNumber: 1, pageSize: 10 };\n    }\n  });\n  const accounts = data?.items || [];
  );

  content = content.replace(/<input type="text" placeholder="Buscar por nome ou email..." disabled className=".*?" \/>/, '<input type="text" placeholder="Buscar por nome ou email..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-64" value={search} onChange={(e) => setSearch(e.target.value)} />');

  // Pagination for Accounts
  const paginationHtml = 
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-700">Mostrando {accounts.length} de {data?.totalCount || 0} contas</span>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Anterior</button>
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">Página {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={!data || data.pageNumber * data.pageSize >= data.totalCount} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Próxima</button>
        </nav>
      </div>;

  if(!content.includes('aria-label="Pagination"')) {
    content = content.replace(/<\/div>\s*<CreateServiceAccountModal/g, paginationHtml + '\n      </div>\n\n      <CreateServiceAccountModal');
  }

  fs.writeFileSync('src/pages/ServiceAccounts.tsx', content, 'utf8');
}

updateTenants();
updateAccounts();
