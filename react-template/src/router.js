import React, { useState, useEffect, useContext } from 'react';

const RouterContext = React.createContext();

export function BrowserRouter({ children }) {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function Routes({ children }) {
  const { path } = useContext(RouterContext);
  let element = null;
  React.Children.forEach(children, child => {
    if (!element && React.isValidElement(child)) {
      const { path: childPath } = child.props;
      if (childPath === path) {
        element = child.props.element;
      }
    }
  });
  return element;
}

export function Route() {
  return null;
}

export function Link({ to, children, ...rest }) {
  const { navigate } = useContext(RouterContext);
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

export function Navigate({ to }) {
  const { navigate } = useContext(RouterContext);
  useEffect(() => {
    navigate(to);
  }, [to]);
  return null;
}

export function useNavigate() {
  const { navigate } = useContext(RouterContext);
  return navigate;
}
