import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    iconComponent: { name: 'dashboardSolid' },
    children: [
      {
        name: 'Dashboard',
        url: '/dashboard',
        iconComponent: { name: 'dashboardSolid' }
      }
    ]
  },

  {
    name: 'Pensioners',
    iconComponent: { name: 'peopleSolid' },
    children: [
      {
        name: 'Pensioners',
        url: '/pensioners',
        iconComponent: { name: 'peopleSolid' }
      }
    ]
  },
  {
    name: 'Advances',
    iconComponent: { name: 'dollarSolid' },
    children: [
      {
        name: 'Advances',
        url: '/transactions',
        iconComponent: { name: 'dollarSolid' }
      }
    ]
  },
  {
    name: 'Approvals',
    iconComponent: { name: 'shieldCheckSolid' },
    children: [
      {
        name: 'Approve Member',
        url: '/workflows/approve-members',
        iconComponent: { name: 'userSolid' }
      },
      {
        name: 'Approve Transaction',
        url: '/workflows/approve-transactions',
        iconComponent: { name: 'checkCircleSolid' }
      }
    ]
  },
  {
    name: 'Users',
    iconComponent: { name: 'userSolid' },
    children: [
      {
        name: 'Users',
        url: '/users',
        iconComponent: { name: 'userSolid' }
      },
      {
        name: 'Profiles',
        url: '/profiles',
        iconComponent: { name: 'descriptionSolid' }
      },
      {
        name: 'Permissions',
        url: '/permissions',
        iconComponent: { name: 'lockLockedSolid' }
      }
    ]
  },

];
