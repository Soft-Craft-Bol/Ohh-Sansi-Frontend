import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css'; 

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <div className="breadcrumbs">
      <Link to="/">Inicio</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <span key={name}> / {name}</span>
        ) : (
          <span key={name}> / <Link to={routeTo}>{name}</Link></span>
        );
      })}
    </div>
  );
};