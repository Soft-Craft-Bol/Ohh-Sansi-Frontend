from rdflib import Graph, Namespace, RDF, RDFS, OWL, Literal, URIRef
from rdflib.namespace import XSD

# Crear grafo
g = Graph()

# Namespaces
ex = Namespace("http://example.org/transporte#")
g.bind("ex", ex)
g.bind("rdf", RDF)
g.bind("rdfs", RDFS)
g.bind("owl", OWL)
g.bind("xsd", XSD)

# Clases
clases = [
    "infraestructura", "camino", "carretera", "ciclovia", "puente_viaducto", "tunel", "via_ferrea",
    "medio", "automovil", "bicicleta", "camion", "flota", "motocicleta", "tren",
    "ruta", "estacion", "parada", "terminal",
    "señalización", "reductores_de_velocidad", "semaforos", "señales_de_transito",
    "usuarios", "conductor", "pasajero"
]

for clase in clases:
    g.add((ex[clase], RDF.type, OWL.Class))

# Relaciones (ObjectProperties)
object_properties = {
    "conectadoA": ("infraestructura", "infraestructura"),
    "conducidoPor": ("automovil", "conductor"),
    "sirveA": ("parada", "pasajero"),
    "circulaPor": ("tren", "via_ferrea"),
    "contiene": ("flota", "medio"),
}

for prop, (dominio, rango) in object_properties.items():
    g.add((ex[prop], RDF.type, OWL.ObjectProperty))
    g.add((ex[prop], RDFS.domain, ex[dominio]))
    g.add((ex[prop], RDFS.range, ex[rango]))

# Propiedades de datos
g.add((ex["nombre"], RDF.type, OWL.DatatypeProperty))
g.add((ex["nombre"], RDFS.domain, ex["usuarios"]))
g.add((ex["nombre"], RDFS.range, XSD.string))

# Crear algunos individuos y relaciones básicas
g.add((ex["auto_ToyotaCorolla_2020"], RDF.type, ex["automovil"]))
g.add((ex["conductor_Juan"], RDF.type, ex["conductor"]))
g.add((ex["auto_ToyotaCorolla_2020"], ex["conducidoPor"], ex["conductor_Juan"]))

g.add((ex["camino_Andes"], RDF.type, ex["camino"]))
g.add((ex["carretera_Panamericana"], RDF.type, ex["carretera"]))
g.add((ex["camino_Andes"], ex["conectadoA"], ex["carretera_Panamericana"]))

g.add((ex["tren_Regional"], RDF.type, ex["tren"]))
g.add((ex["ferrocarril_Central"], RDF.type, ex["via_ferrea"]))
g.add((ex["tren_Regional"], ex["circulaPor"], ex["ferrocarril_Central"]))

g.add((ex["parada_Avenida10"], RDF.type, ex["parada"]))
g.add((ex["pasajero_Luis"], RDF.type, ex["pasajero"]))
g.add((ex["parada_Avenida10"], ex["sirveA"], ex["pasajero_Luis"]))

g.add((ex["flota_EmpresaX"], RDF.type, ex["flota"]))
g.add((ex["camion_VolvoFM"], RDF.type, ex["camion"]))
g.add((ex["flota_EmpresaX"], ex["contiene"], ex["camion_VolvoFM"]))

# Guardar como OWL
file_path = "/mnt/data/transporte_urbano.owl"
g.serialize(destination=file_path, format='xml')
file_path
