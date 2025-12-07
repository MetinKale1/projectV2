// // src/pages/Layout.jsx
// import { Outlet } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import { useThemeColors } from '../contexts/theme';

// export default function Layout() {

//   return (
//     <div className='container-xl'>
//       <Navbar />
//       <Outlet />
//     </div>
//   );
// }
// src/components/Layout.jsx
import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useThemeColors } from '../contexts/theme';

export default function Layout() {
  const { theme, textTheme } = useThemeColors();
  return (
    <div className={`container-xl bg-${theme} text-${textTheme}`}>
      <Navbar />
      <Outlet />
      <ScrollRestoration />
    </div >
  );
}
