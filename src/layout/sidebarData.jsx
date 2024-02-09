import Tug from '../assets/images/sidebar-icons/tug.png';
import Claim from '../assets/images/sidebar-icons/claim.png';
import Position from '../assets/images/sidebar-icons/position.png';

export const sidebarMenu = [
  {
    name: 'Buy Tug Pairs',
    icon: Tug,
    link: '/buy_tug_points',
  },
];
export const sidebarMenu2 = [
  {
    name: 'Open Positions',
    icon: Position,
    link: '/openposition',
    items: '2',
  },
  {
    name: 'Claim Proceeds',
    icon: Claim,
    link: '/claim_proceeds',
    items: '1',
  },
];
