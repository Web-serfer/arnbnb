import Container from '../Container';
import Categories from './(categories)/Categories';
import Logo from './Logo';
import { Search } from './Search';
import UserMenu from './UserMenu';
import { SafeUser } from '@/types';

interface NavbarProps {
  currentUser?: SafeUser | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  console.log(currentUser);
  return (
    <nav className="fixes w-full bg-white shadow-sm">
      <div className="border-b-[1px] py-4 md:py-6">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </div>
      <Categories />
    </nav>
  );
};

export default Navbar;
