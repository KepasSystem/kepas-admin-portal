export const TKeys = {
  Login: {
    Welcome: 'login.welcome',
    EmailLabel: 'login.emailLabel',
    PasswordLabel: 'login.passwordLabel',
    Button: 'login.button',
    ForgotPassword: 'login.forgotPassword'
  },
  Dashboard: {
    Title: 'dashboard.title',
    Subtitle: 'dashboard.subtitle',
    DownloadReport: 'dashboard.downloadReport',
    Mrr: 'dashboard.mrr',
    ServiceAccounts: 'dashboard.serviceAccounts',
    Tenants: 'dashboard.tenants',
    ActiveTenants: 'dashboard.activeTenants',
    NewSubscriptionsToday: 'dashboard.newSubscriptionsToday',
    GrowthChart: 'dashboard.growthChart',
    ChartPlaceholder: 'dashboard.chartPlaceholder'
  },
  Menus: {
    Home: 'menus.home',
    Services: 'menus.services',
    Customers: 'menus.customers',
    Bookings: 'menus.bookings',
    Settings: 'menus.settings'
  },
  Common: {
    Save: 'common.save',
    Cancel: 'common.cancel',
    Loading: 'common.loading',
    Previous: 'common.previous',
    Next: 'common.next',
    Search: 'common.search',
    Actions: 'common.actions',
    Status: 'common.status',
    ComingSoon: 'common.comingSoon',
    ShowingOf: 'common.showingOf'
  },
  Tenants: {
    Title: 'tenants.title',
    Subtitle: 'tenants.subtitle',
    NewTenant: 'tenants.newTenant',
    Columns: {
      Company: 'tenants.columns.company',
      Subdomain: 'tenants.columns.subdomain',
      CurrentPlan: 'tenants.columns.currentPlan'
    },
    EmptyState: 'tenants.emptyState',
    Loading: 'tenants.loading'
  },
  ServiceAccounts: {
    Title: 'serviceAccounts.title',
    Subtitle: 'serviceAccounts.subtitle',
    NewAccount: 'serviceAccounts.newAccount',
    Columns: {
      Owner: 'serviceAccounts.columns.owner',
      TenantsCount: 'serviceAccounts.columns.tenantsCount',
      SubscriptionsCount: 'serviceAccounts.columns.subscriptionsCount',
      Created: 'serviceAccounts.columns.created'
    },
    EmptyState: 'serviceAccounts.emptyState',
    Loading: 'serviceAccounts.loading'
  },
  AccessControl: {
    Title: 'accessControl.title',
    Subtitle: 'accessControl.subtitle',
    Tabs: {
      Roles: 'accessControl.tabs.roles',
      Admins: 'accessControl.tabs.admins'
    },
    Roles: {
      Loading: 'accessControl.roles.loading',
      ConfirmDelete: 'accessControl.roles.confirmDelete',
      NewRole: 'accessControl.roles.newRole',
      Columns: {
        Actions: 'accessControl.roles.columns.actions',
        Permissions: 'accessControl.roles.columns.permissions',
        Role: 'accessControl.roles.columns.role'
      }
    },
    Admins: {
      NewAdmin: 'accessControl.admins.newAdmin',
      Loading: 'accessControl.admins.loading',
      NoRole: 'accessControl.admins.noRole',
      Columns: {
        Actions: 'accessControl.admins.columns.actions',
        Status: 'accessControl.admins.columns.status',
        User: 'accessControl.admins.columns.user',
        Role: 'accessControl.admins.columns.role'
      },
      Tooltips: {
        Block: 'accessControl.admins.tooltips.block',
        Unblock: 'accessControl.admins.tooltips.unblock'
      },
      Status: {
        Active: 'accessControl.admins.status.active',
        Blocked: 'accessControl.admins.status.blocked'
      }
    }
  }
} as const;
