import MenuDescontos from "../components/MenuDescontos";
import { Outlet } from "react-router-dom";

export default function Descontos() {
  return (
    <div>
      <MenuDescontos />
      <Outlet />
    </div>
  );
}
