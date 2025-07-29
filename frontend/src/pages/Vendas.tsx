import { Outlet } from "react-router-dom";
import MenuVendas from "../components/MenuVendas";

export default function Vendas() {
  return (
    <div>
      <MenuVendas />
      <Outlet />
    </div>
  );
}
