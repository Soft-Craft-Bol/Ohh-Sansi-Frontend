import Header from "../../components/header/Header";
import UpdateExcel from "../../components/loadExcel/UpdateXcel";

const InscripcionExcel = () =>{
    return(
        <div className="register-masive">
            <Header 
            title="Inscribir múltiples participantes con un archivo Excel"
            description="Registra varios participantes en un archivo con todos los datos requeridos"
            />
            <UpdateExcel/>
        </div>
    )
}
export default InscripcionExcel;