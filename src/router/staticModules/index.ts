import dashboard from './dashboard';
import demos from './demos';
import externaLink from './externa-link';
import account from './account';
import goods from '@/router/staticModules/goods';

export default [...goods, ...dashboard, ...demos, ...externaLink, ...account];
