import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../context/PrivateRoute";
import LoginUser from "../pages/login/LoginUser";
import { lazy } from "react";

const Inicio = lazy(() => import("../pages/inicio/Inicio"));


const AppRoutes = () => (
    <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginUser />} />

        {/* Rutas privadas */}
        <Route path="/home" element={<PrivateRoute><Inicio /></PrivateRoute>} />
        {/*Principal Sidebar*/ }
        <Route path="/users" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/registerUser" element={<PrivateRoute><RegisterUser/> </PrivateRoute>} />
        <Route path="/register" element={<RegisterUser/> } />
        <Route path="/editUser/:id" element={<PrivateRoute><RegisterUser/></PrivateRoute>} />
        <Route path="/horario" element={<PrivateRoute><Horarios/></PrivateRoute>} />

        <Route path="/sucursales" element={<PrivateRoute><Sucursales /></PrivateRoute>} />
        <Route path="/sucursales/addSucursal" element = {<PrivateRoute> <AddSucursal> </AddSucursal></PrivateRoute>} />
        <Route path="/editSucursal/:id" element ={<PrivateRoute> <AddSucursal/> </PrivateRoute>}/>
        <Route path="/despachos" element = {<PrivateRoute> <Despachos /> </PrivateRoute>}/>
        <Route path="/despachos/create" element = {<PrivateRoute> <CrearDespacho /> </PrivateRoute>}/>

        <Route path="/productos" element = {<PrivateRoute> <Productos/> </PrivateRoute>}/>
        <Route path="/addProduct" element = {<PrivateRoute> <ItemForm /> </PrivateRoute>}/>
        <Route path="/editProduct/:id" element = {<PrivateRoute>  <ItemForm/> </PrivateRoute>} />
        <Route path="/productos-externos" element = {<PrivateRoute> <ProductosExternos /> </PrivateRoute>}/>
        <Route path="/carrito" element = {<PrivateRoute> <CarrritoLista /></PrivateRoute>}/>
        <Route path="/reservas" element = {<PrivateRoute> <ReservasTable /></PrivateRoute>}/>
        <Route path="/product" element = {<BreadList /> }/>

        <Route path="/facturacion" element={<PrivateRoute><Facturacion /></PrivateRoute>} />
        <Route path="/ventas" element={<PrivateRoute><ListVentas /></PrivateRoute>} />
        <Route path="/gastos" element={<PrivateRoute><Gastos/></PrivateRoute>} />
        <Route path="/impuestos-form" element={<PrivateRoute> <FacturaForm/> </PrivateRoute>}/>

        <Route path="/clientes/crear-cliente" element = {<PrivateRoute> <ClientForm /> </PrivateRoute>}/>
        <Route path="/editClient/:id" element = {<PrivateRoute> <ClientForm /> </PrivateRoute>}/>
        <Route path="/clientes" element = {<PrivateRoute> <Clientes /> </PrivateRoute>}/>
        <Route path="/insumos" element = {<PrivateRoute> <Insumos /> </PrivateRoute>}/>
        <Route path="/insumos/edit/:id" element = {<PrivateRoute> <ItemForm /> </PrivateRoute>}/>
        <Route path="/" element = {<LandingPage />}/>
        <Route path="/insumos/crear" element={<PrivateRoute><CrearInsumoPage /></PrivateRoute>} />
        <Route path="/insumos/edit/:id" element={<PrivateRoute><EditarInsumo /></PrivateRoute>} />
    </Routes>
);

export default AppRoutes;
