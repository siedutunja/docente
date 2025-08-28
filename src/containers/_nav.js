import * as CONFIG from '@/assets/config.js'
import jwt from 'jsonwebtoken'

let menu = []
let token = sessionStorage.getItem('token')
if ( token == null ) {
  let valores = window.location.search
  let urlParams = new URLSearchParams(valores)
  token = urlParams.get('token')
}
jwt.verify(token, CONFIG.SECRET_KEY, (err, data) => {
  if (err) {
    alert('¡Nav. Lo sentimos, el token no es válido o el token ha expirado.! Es necesario iniciar una nueva sesión.')
    location.replace(CONFIG.ROOT_WEBSITE)
  } else {
    window.history.replaceState({},'','/docente/')
    sessionStorage.setItem('token', token)
    let tokenDecodificado = jwt.decode(token)
    let tokenPermisos = tokenDecodificado.permisos
    //console.log(tokenDecodificado)
    let indice = 0
    menu = [
      {
        _name: 'CSidebarNav',
        _children: [
          {
            _name: 'CSidebarNavTitle',
            _children: ['Menú Principal']
          }
        ]
      }
    ]
    // PLANILLAS
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Mis Planillas',
        icon: 'cilDescription',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Asignación Académica', to: '/planillas/asignacionacademica'})
    //menu[0]._children[indice].items.push({ name: 'Configurar Planillas', to: '/planillas/configurarplanillas'})
    menu[0]._children[indice].items.push({ name: 'Configurar Planillas', to: '/planillas/configurarplanilla'})
    menu[0]._children[indice].items.push({ name: 'Actividades Académicas', to: '/planillas/actividadesacademicas'})
    // ESTUDIANTES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Estudiantes',
        icon: 'cilEducation',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Consultar Estudiante', to: '/estudiantes/buscarestudiante'})
    menu[0]._children[indice].items.push({ name: 'Observador', to: '/estudiantes/listaobservadores'})
    menu[0]._children[indice].items.push({ name: 'Entrevista Familiar', to: '/estudiantes/listaentrevistasfamiliares'})
    // EVALUACIONES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Evaluaciones',
        icon: 'cilCalculator',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Notas Parciales por Periodo', to: '/evaluaciones/planillaparcialperiodo'})
    menu[0]._children[indice].items.push({ name: 'Resumen Final por Periodo', to: '/evaluaciones/planillafinalperiodo'})
    menu[0]._children[indice].items.push({ name: 'Recuperaciones por Periodo', to: '/evaluaciones/planillarecuperacionperiodo'})
    menu[0]._children[indice].items.push({ name: 'Ausencias', to: '/evaluaciones/ausencias'})
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Listados y Formatos',
        icon: 'cilCalendar',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Listas y Planillas', to: '/planillas/listadoscurso'})
    menu[0]._children[indice].items.push({ name: 'Auxiliar con Notas', to: '/planillas/planillasnotas'})

    // DESCRIPTORES
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Descriptores',
        icon: 'cilList',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Generales', to: '/descriptores/generales'})
    menu[0]._children[indice].items.push({ name: 'Complementarios', to: '/descriptores/complementarios'})
    if (tokenDecodificado.id_institucion == '17ee4f30-fc80-11ec-a1d1-1dc2835404e5' || tokenDecodificado.id_institucion == '097b7b10-fcaa-11ec-8267-536b07c743c4' || tokenDecodificado.id_institucion == '8a1bd1e0-fcb2-11ec-8267-536b07c743c4') {
      menu[0]._children[indice].items.push({ name: 'Preescolar', to: '/descriptores/preescolar'})
    }
    if (tokenDecodificado.id_institucion == 'eb58bf60-fc83-11ec-a1d1-1dc2835404e5') {
      menu[0]._children[indice].items.push({ name: 'Logros', to: '/descriptores/logros'})
    }
    menu[0]._children.push(
      {
        _name: 'CSidebarNavDropdown',
        name: 'Informes y Estadísticas',
        icon: 'cilBarChart',
        items: []
      }
    )
    indice++
    menu[0]._children[indice].items.push({ name: 'Consolidados por Periodo', to: '/informes/consolidadoscurso'})
    menu[0]._children[indice].items.push({ name: 'Reportes por Periodo', to: '/informes/reportesperiodos'})
  }
})

export default menu