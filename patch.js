const fs = require('fs');
let t = fs.readFileSync('src/components/modals/CreateTenantModal.tsx', 'utf8');
const target = /<label className="block text-sm font-medium text-gray-700 mb-1">Sub.*nio KEPAS<\/label>[\s\S]*?<\/div>\s*<\/div>/;
const replacement = `<label className="block text-sm font-medium text-gray-700 mb-1">Domínio do Workspace</label>
              <input required type="text" value={formData.subdomain} onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, '') })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="exemplo.com" />
            </div>`;
t = t.replace(target, replacement);
fs.writeFileSync('src/components/modals/CreateTenantModal.tsx', t, 'utf8');
