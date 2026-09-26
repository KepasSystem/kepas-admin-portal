const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/Dashboard.tsx',
  'src/pages/Login.tsx',
  'src/pages/Tenants.tsx',
  'src/pages/ServiceAccounts.tsx',
  'src/pages/access-control/AccessControl.tsx',
  'src/pages/access-control/components/AdminsTab.tsx',
  'src/pages/access-control/components/RolesTab.tsx'
];

function getDepth(filePath) {
    const parts = filePath.split('/');
    const depth = parts.length - 2;
    if (depth === 0) return './core/i18n';
    let prefix = '';
    for(let i=0; i<depth; i++) prefix += '../';
    return prefix + 'core/i18n';
}

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace react-i18next with our abstraction
  content = content.replace(/import \{ useTranslation \} from 'react-i18next';\n/g, '');
  
  const i18nPath = getDepth(file);
  if (!content.includes('useAppTranslation')) {
    content = `import { useAppTranslation } from '${i18nPath}/useAppTranslation';\nimport { TKeys } from '${i18nPath}/TranslationKeys';\n` + content;
  }

  content = content.replace(/const \{ t, i18n \} = useTranslation\(\);/g, 'const { t, changeLanguage } = useAppTranslation();');
  content = content.replace(/const \{ t \} = useTranslation\(\);/g, 'const { t } = useAppTranslation();');

  // Specific replacements to remove magic strings
  content = content.replace(/t\('dashboard\.title'\)/g, 't(TKeys.Dashboard.Title)');
  content = content.replace(/t\('dashboard\.subtitle'\)/g, 't(TKeys.Dashboard.Subtitle)');
  content = content.replace(/t\('dashboard\.downloadReport'\)/g, 't(TKeys.Dashboard.DownloadReport)');
  content = content.replace(/t\('dashboard\.mrr'\)/g, 't(TKeys.Dashboard.Mrr)');
  content = content.replace(/t\('dashboard\.serviceAccounts'\)/g, 't(TKeys.Dashboard.ServiceAccounts)');
  content = content.replace(/t\('dashboard\.tenants'\)/g, 't(TKeys.Dashboard.Tenants)');
  content = content.replace(/t\('dashboard\.activeTenants'\)/g, 't(TKeys.Dashboard.ActiveTenants)');
  content = content.replace(/t\('dashboard\.newSubscriptionsToday'\)/g, 't(TKeys.Dashboard.NewSubscriptionsToday)');
  content = content.replace(/t\('dashboard\.growthChart'\)/g, 't(TKeys.Dashboard.GrowthChart)');
  content = content.replace(/t\('dashboard\.chartPlaceholder'\)/g, 't(TKeys.Dashboard.ChartPlaceholder)');

  content = content.replace(/t\('login\.welcome'\)/g, 't(TKeys.Login.Welcome)');
  content = content.replace(/t\('login\.emailLabel'\)/g, 't(TKeys.Login.EmailLabel)');
  content = content.replace(/t\('login\.passwordLabel'\)/g, 't(TKeys.Login.PasswordLabel)');
  content = content.replace(/t\('login\.button'\)/g, 't(TKeys.Login.Button)');
  content = content.replace(/t\('login\.forgotPassword'\)/g, 't(TKeys.Login.ForgotPassword)');
  
  content = content.replace(/t\('accessControl\.title'\)/g, 't(TKeys.AccessControl.Title)');
  content = content.replace(/t\('accessControl\.subtitle'\)/g, 't(TKeys.AccessControl.Subtitle)');
  content = content.replace(/t\('accessControl\.tabs\.roles'\)/g, 't(TKeys.AccessControl.Tabs.Roles)');
  content = content.replace(/t\('accessControl\.tabs\.admins'\)/g, 't(TKeys.AccessControl.Tabs.Admins)');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated UI file ${file}`);
  }
});
