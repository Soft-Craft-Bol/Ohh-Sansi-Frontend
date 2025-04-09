import Header from "../../components/header/Header";
import LoadExcel from "../../components/loadExcel/LoadExcel";

const InscripcionExcel = () =>{
    return(
        <div className="register-masive">
            <Header 
            title="Inscribir múltiples participantes con un archivo Excel"
            description="Registra varios participantes en un archivo con todos los datos requeridos"
            />
            <LoadExcel/>
        </div>
    )
}
export default InscripcionExcel;