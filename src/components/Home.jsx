import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import TaskIcon from "@mui/icons-material/Task";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryIcon from "@mui/icons-material/Inventory";
import OrdersList from "./Orders/Orders.jsx";
import StoreList from "./Stores/Stores.jsx";
import ProductsList from "./Products/Products.jsx";
import iconLogo from "../assets/logo.png";
import decodeService from "../services/decodeToken.js";

const NAVIGATION = [
  {
    kind: "header",
    title: "Menu",
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <TaskIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <InventoryIcon />,
  },
  {
    segment: "stores",
    title: "Stores",
    icon: <StoreIcon />,
  },
  {
    kind: "divider",
  },
  {
    segment: "logout",
    title: "Log Out",
    icon: <LogoutIcon />,
  },
];

const themeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#3A3ABF',
    },
    secondary: {
      main: '#f50057',
    },
  },
};

const demoTheme = createTheme({
  ...themeOptions,
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Typography>Dashboard content for {pathname}</Typography>
    </Box>
  );
}

export default function AppProviderBasic(props) {
  const { window } = props;
  const { isAuthenticated, setIsAuthenticated, ...rest } = props;
  const [pathname, setPathname] = React.useState("/orders");
  const [userRole, setUserRole] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem('LoggedOrderItAppUser');
    const storedUser = decodeService.decodeToken(token);
    const role = storedUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    
    setUserRole(role);

    console.log(role);

  }, []);

  function handleLogout() {
    setIsAuthenticated(false);
    localStorage.removeItem('LoggedOrderItAppUser');
  }

  const filteredNavigation = React.useMemo(() => {
    if (userRole === "ADMIN") {
      return NAVIGATION;
    } else if (userRole === "USER") {
      return NAVIGATION.filter(
        (item) => item.segment === "orders" || item.kind === "header" || item.kind === "divider" || item.segment === "logout"
      );
    }
    return [];
  }, [userRole]);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        if (filteredNavigation.some((item) => item.segment === path.replace("/", ""))) {
          if (path === '/logout') {
            handleLogout();
          } 
          setPathname(String(path));
        }
      },
    };
  }, [pathname, filteredNavigation]);

  const demoWindow = window !== undefined ? window() : undefined;

  const getTitle = (path) => {
    const matchedRoute = filteredNavigation.find((route) => path.includes(route.segment));
    return matchedRoute ? matchedRoute.title : "Dashboard";
  };

  const renderContent = () => {
    switch (pathname) {
      case "/orders":
        return <OrdersList />;
      case "/products":
        return <ProductsList />;
      case "/stores":
        return <StoreList />;
      default:
        return <DemoPageContent pathname={pathname} />;
    }
  };

  return (
    <AppProvider
      branding={{
        logo: "",
        title: getTitle(pathname),
        color: "#333333",
      }}
      navigation={filteredNavigation}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      onTitleClick={(e) => e.preventDefault()}
    >
      <DashboardLayout>{renderContent()}</DashboardLayout>
    </AppProvider>
  );
}
