import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Pension Management'
  },
  {
    name: 'Pensioners',
    url: '/pensioners',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Transactions',
    url: '/transactions',
    iconComponent: { name: 'cil-dollar' }
  },
  {
    name: 'Workflows',
    iconComponent: { name: 'cil-task' },
    children: [
      {
        name: 'Approve Member',
        url: '/workflows/approve-members'
      },
      {
        name: 'Approve Transaction',
        url: '/workflows/approve-transactions'
      }
    ]
  },

];
